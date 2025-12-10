# Dev Tools Manager

A desktop application for managing development projects with support for Laravel, Vue.js, Nuxt.js, React, and WordPress.

![Dev Tools Manager](art.png)

## Features

- ✨ Create projects: Laravel, Vue, Nuxt, React, WordPress
- 🔧 Automated Nginx virtual host configuration
- 🔒 Generate HTTPS certificates using mkcert
- 🛠️ Manage development tools: PHP, Composer, Node.js, Nginx, PostgreSQL, MySQL
- 🌐 Bilingual support: Khmer (default) and English
- 💅 Modern UI with Tailwind CSS
- ⚡ Built with Electron

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

3. Build Tailwind CSS:
```bash
npm run build:css
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Build Executable

```bash
# Build for Linux
npm run build:linux

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac
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

Click the language button in the top right corner to switch between Khmer and English.

## Project Structure

```
dev-tools-app/
├── src/
│   ├── main/
│   │   └── main.js          # Electron main process
│   ├── renderer/
│   │   ├── index.html       # Main UI
│   │   ├── app.js          # Application logic
│   │   └── styles.css      # Tailwind styles
│   └── utils/              # Utility functions
├── package.json
├── tailwind.config.js
└── README.md
```

## Troubleshooting

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
