# Dev Tools Manager

A desktop application for managing development projects with support for Laravel, Vue.js, Nuxt.js, React, and WordPress.

![Dev Tools Manager](art.png)

## Features

### Core Features
- ✨ Create projects: Laravel, Vue, Nuxt, React, WordPress
- 🔧 Automated Nginx virtual host configuration
- 🔒 Generate HTTPS certificates using mkcert
- 🛠️ Manage development tools: PHP, Composer, Node.js, Nginx, PostgreSQL, MySQL
- 🌐 Bilingual support: Khmer (default) and English
- 💅 Modern UI with Vue 3 and Tailwind CSS
- ⚡ Built with Electron + Vue 3 + Vite

### Enhanced Features ✨
- 🎨 **Form Validation** - Real-time validation with VeeValidate & Yup
- 🌙 **Dark Mode** - Full dark theme with system preference detection
- ⌨️ **Keyboard Shortcuts** - Navigate and control the app with hotkeys ([View shortcuts](KEYBOARD_SHORTCUTS.md))
- 💾 **Settings Persistence** - Save preferences (language, theme, defaults)
- 📊 **Progress Indicators** - Visual feedback for long operations
- 🎯 **Enhanced UX** - Smooth transitions, hover effects, and accessibility

For detailed information about enhanced features, see [FEATURES.md](FEATURES.md).

## Requirements

### Essential Requirements

Before using this application, ensure you have:

- **Node.js** (v16 or higher) - Required to run the application
- **sudo privileges** - Required for installing development tools

### Optional Tools (Can be installed via "Manage Tools" tab)

The following tools can be installed directly from the application:

- **PHP** (8.0, 8.1, 8.2, 8.3, 8.4)
- **Composer** (for Laravel projects)
- **Node.js versions** (via NVM for version management)
- **Nginx** (for web server configuration)
- **PostgreSQL** (database server)
- **MySQL** (database server)

### Manual Installation Required

- **mkcert** (for SSL certificate generation) - Must be installed manually
- **NVM** (for managing multiple Node.js versions) - Recommended for Node.js version switching

### Installing mkcert

```bash
# Linux
sudo apt install libnss3-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
mkcert -install

# macOS
brew install mkcert
mkcert -install

# Windows
choco install mkcert
mkcert -install
```

### Installing NVM (Optional, for Node.js version management)

```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Then restart your terminal and verify
nvm --version
```

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode (with Hot Reload)

```bash
npm run electron:dev
```

This starts:
- Vite dev server on port 5173
- Electron app with hot module replacement
- Instant updates when you edit Vue components

### Vite Dev Server Only (Browser Testing)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Build Executable

```bash
# Build Vue app and package for distribution
npm run electron:build    # Default platform

# Build for specific platforms
npm run build:linux       # Linux (AppImage, deb)
npm run build:win         # Windows (NSIS installer)
npm run build:mac         # macOS (DMG)
```

## Features Guide

### 1. Create Project

- Select project type (Laravel, Vue, Nuxt, React, WordPress)
- Enter project name
- Choose project location
- Click "Create Project"

### 2. Configure Nginx

- Enter domain name (e.g., myproject.local)
- Select project path
- Set port (default: 80)
- Click "Configure"

Note: You may need sudo privileges for Nginx configuration.

### 3. Generate SSL Certificate

- Enter domain name
- Click "Generate Certificate"
- Certificates will be created in your home directory

### 4. Manage Development Tools

The "Manage Tools" tab allows you to install and manage development tools directly from the application:

#### PHP Management
- View installed PHP versions
- Install new PHP versions (8.0, 8.1, 8.2, 8.3, 8.4)
- Install PHP extensions for specific versions

#### Composer Management
- Check Composer installation status
- Install Composer globally

#### Node.js Management
- View installed Node.js versions via NVM
- Install new Node.js versions
- Set default Node.js version

#### Nginx Management
- Check Nginx installation status
- Install Nginx web server

#### PostgreSQL Management
- Check PostgreSQL installation status
- Install specific PostgreSQL versions

#### MySQL Management
- Check MySQL installation status
- Install MySQL database server

**Note:** All installation operations require sudo privileges and will prompt for your password.

### Language Toggle

Click the language button in the top right corner to switch between Khmer and English, or use the keyboard shortcut `Ctrl+L`.

### Dark Mode

Toggle dark mode by:
- Clicking the moon/sun icon in the header
- Using the keyboard shortcut `Ctrl+D`
- Changing it in Settings (`Ctrl+,`)
- Dark mode preference is automatically detected from your system

### Settings

Access application settings by:
- Clicking the gear icon in the header
- Using the keyboard shortcut `Ctrl+,`

Configure:
- Default project paths and versions
- Language and theme preferences
- Keyboard shortcut visibility
- Auto-detect PHP-FPM option

### Keyboard Shortcuts

The application supports keyboard shortcuts for improved productivity. Press `Ctrl+1` through `Ctrl+4` to navigate between tabs quickly. See [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md) for the complete list.

## Project Structure

```
dev-tools-app/
├── src/
│   ├── main/
│   │   └── main.js              # Electron main process (IPC handlers)
│   └── renderer/
│       ├── index.html           # Vite entry point
│       └── src/
│           ├── main.js          # Vue app bootstrap
│           ├── App.vue          # Root component
│           ├── components/      # Vue components
│           │   ├── layout/      # Header, Navigation, Footer
│           │   ├── common/      # Reusable UI components
│           │   └── forms/       # Feature forms + tool sections
│           ├── views/           # Route view components
│           ├── composables/     # IPC wrappers & business logic
│           ├── router/          # Vue Router configuration
│           ├── i18n/            # Vue I18n (Khmer/English)
│           └── assets/styles/   # Tailwind CSS
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json
└── README.md
```

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite (fast development & HMR)
- **Desktop Framework**: Electron
- **Routing**: Vue Router (hash mode for Electron compatibility)
- **Internationalization**: Vue I18n (Khmer/English)
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Architecture

### Electron + Vue 3 Integration

This application uses a hybrid architecture:

**Main Process** (`src/main/main.js`):
- Handles all system operations (file I/O, shell commands, sudo operations)
- Exposes IPC handlers for the renderer process
- In development: loads Vite dev server (`http://localhost:5173`)
- In production: loads built files from `src/renderer/dist/`

**Renderer Process** (Vue 3 App):
- Modern Vue 3 application with Composition API
- Communicates with main process via composables that wrap `ipcRenderer.invoke()`
- Uses Vue Router for tab navigation (hash mode for Electron compatibility)
- Vue I18n for bilingual support (reactive language switching)

### Component Architecture

**Composables Pattern:**
All Electron IPC calls are wrapped in composables (`src/renderer/src/composables/`):
- `useIpc()` - Base IPC communication
- `useProject()` - Project creation and directory selection
- `useNginx()` - Nginx configuration
- `useSsl()` - SSL certificate generation
- `useTools()` - Development tools management
- `useStatus()` - Status message handling

**Component Hierarchy:**
- **Layout Components**: Header (language switcher), TabNavigation (routing), Footer
- **Common Components**: Reusable UI (StatusMessage, DirectorySelector, InfoBox)
- **Form Components**: Feature-specific forms that use composables for business logic
- **View Components**: Route wrappers that compose forms

## Troubleshooting

### Development Issues

**Two Electron windows opening:**
- This was fixed in the latest version
- If it happens, ensure `vite-plugin-electron` is NOT in `vite.config.js`

**Vite dev server not starting:**
```bash
# Kill any process using port 5173
lsof -ti:5173 | xargs kill -9
npm run electron:dev
```

**Electron shows blank screen:**
- Open DevTools (F12 or Ctrl+Shift+I) and check console for errors
- Verify Vite server is running on `http://localhost:5173`
- Check that `NODE_ENV=development` is set

**Hot reload not working:**
- Restart `npm run electron:dev`
- Check Vite server is running in the terminal output

### Nginx Configuration Issues

If Nginx configuration fails, ensure:
- Nginx is installed and running (you can install it via "Manage Tools" tab)
- You have sudo privileges
- The project path exists and is accessible

### SSL Certificate Issues

If SSL generation fails:
- Verify mkcert is installed: `mkcert -version`
- Run `mkcert -install` to install the local CA

### Project Creation Issues

- Ensure Composer is installed for Laravel projects (install via "Manage Tools" tab)
- Verify Node.js is installed for Vue/Nuxt/React projects
- Check internet connection for downloading project templates

### Manage Tools Installation Issues

If tool installation fails:
- **Permission denied**: Ensure you entered your sudo password correctly
- **PHP installation fails**: Check if you have Ubuntu's `software-properties-common` package installed
- **Node.js versions not showing**: Install NVM first (see NVM installation guide above)
- **Database installation fails**: Ensure your system package manager is up to date (`sudo apt update`)

**Tip**: Check the status messages displayed in the application for specific error details.

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
