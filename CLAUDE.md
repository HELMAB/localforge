# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dev Tools Manager is an Electron desktop application for managing development projects. It creates projects (Laravel, Vue, Nuxt, React, WordPress), configures Nginx virtual hosts, generates SSL certificates, and manages development tools (PHP, Composer, Node.js, Nginx, PostgreSQL, MySQL). The UI is bilingual (Khmer/English).

**Tech Stack:**
- **Frontend**: Vue 3 (Composition API) + Vite + Vue Router + Vue I18n + Tailwind CSS
- **Desktop**: Electron (main process handles IPC, renderer process is Vue app)
- **Build**: Vite for bundling, electron-builder for packaging

## Development Commands

### Running the Application

```bash
# Development mode (Vite dev server + Electron with hot reload)
npm run electron:dev

# Vite dev server only (for testing Vue app in browser)
npm run dev

# Production mode (no hot reload)
npm start
```

### Building

```bash
# Build Vue app with Vite
npm run build

# Build and package for distribution
npm run electron:build      # Default platform
npm run build:linux         # Linux (AppImage, deb)
npm run build:win           # Windows (NSIS installer)
npm run build:mac           # macOS (DMG)
```

### Preview Production Build

```bash
npm run preview
```

## Architecture

### Electron Process Model

**Main Process** (`src/main/main.js`):
- Creates BrowserWindow
- Handles all IPC communication (file dialogs, project creation, tool installation, Nginx config, SSL generation)
- Executes shell commands and sudo operations
- In development: loads `http://localhost:5173` (Vite dev server)
- In production: loads `src/renderer/dist/index.html` (built files)
- **Important**: Main process is unchanged from vanilla JS - all IPC handlers remain identical

**Renderer Process** (`src/renderer/src/`):
- Vue 3 single-page application
- Communicates with main process via `ipcRenderer.invoke()`
- Uses `nodeIntegration: true` and `contextIsolation: false` for direct access to Node.js APIs

### Vue Application Structure

```
src/renderer/src/
├── main.js                 # Vue app entry (mounts app, registers router & i18n)
├── App.vue                 # Root component (layout shell)
├── components/
│   ├── layout/            # AppHeader, TabNavigation, AppFooter
│   ├── common/            # Reusable UI (StatusMessage, DirectorySelector, InfoBox)
│   └── forms/             # Feature forms + tool-sections/
├── views/                 # Route wrappers (CreateProjectView, NginxConfigView, etc.)
├── composables/           # Business logic & IPC wrappers
├── router/                # Vue Router config (hash mode for Electron compatibility)
├── i18n/                  # Vue I18n setup + locales (km.js, en.js)
└── assets/styles/         # Tailwind CSS
```

### Key Architectural Patterns

**IPC Communication Pattern:**
1. Composables (`useProject`, `useNginx`, `useSsl`, `useTools`) wrap IPC calls
2. All composables use `useIpc()` base composable for `ipcRenderer.invoke()`
3. Forms import composables, call methods, handle loading states and errors
4. Main process handles actual system operations (shell commands, file operations, sudo)

**State Management:**
- No Vuex/Pinia - state is local to components
- `useStatus()` composable provides reactive status messages
- `useTools()` composable caches installed tools state after checking

**Routing:**
- Uses `createWebHashHistory()` (required for Electron's file:// protocol)
- Tabs map to routes: `/create`, `/nginx`, `/ssl`, `/manage`
- View components are thin wrappers that compose form components

**Internationalization:**
- Vue I18n with `legacy: false` (Composition API mode)
- Default locale: `km` (Khmer), fallback: `en` (English)
- Language switching updates locale reactively via `useI18n()`

## Critical Implementation Details

### Vite Configuration

The Vite config uses a custom root (`src/renderer`) and builds to `src/renderer/dist`. This is intentional for Electron integration:

```js
root: path.join(__dirname, 'src/renderer')
build: { outDir: 'dist' }
base: './'  // Important for relative paths in production
```

**Do not add** `vite-plugin-electron` or `vite-plugin-electron-renderer` - they cause duplicate Electron windows. We manually start Electron with `concurrently`.

### IPC Handlers (Main Process)

All IPC channels are defined in `src/main/main.js`:
- `select-directory` - File dialog
- `create-project` - Project scaffolding (Laravel, Vue, Nuxt, React, WordPress)
- `configure-nginx` - Generates Nginx config, creates symlink, reloads Nginx (requires sudo)
- `generate-ssl` - Runs mkcert
- `check-installed-tools` - Checks PHP, Node, Composer, Nginx, PostgreSQL, MySQL versions
- `install-*` - Tool installation (requires sudo)

**Sudo Operations:**
Uses `sudo-prompt` package for privileged operations (Nginx config, tool installation). Commands are executed with user's password prompt.

### Tailwind CSS

Tailwind scans Vue files via `content` paths in `tailwind.config.js`:
```js
content: ["./src/renderer/index.html", "./src/renderer/src/**/*.{vue,js}"]
```

Custom styles in `src/renderer/src/assets/styles/main.css` include transition effects for Vue Router and tab navigation.

### Multi-Language Support

Translation keys are centralized in `src/renderer/src/i18n/locales/`:
- `km.js` - Khmer (default language)
- `en.js` - English

Components access translations via `const { t } = useI18n()` and use `{{ t('key') }}` in templates.

## Common Development Tasks

### Adding a New IPC Handler

1. Add handler in `src/main/main.js`:
```js
ipcMain.handle('my-operation', async (event, data) => {
  // Implementation
})
```

2. Create/update composable in `src/renderer/src/composables/`:
```js
export function useMyFeature() {
  const { invoke } = useIpc()
  async function myOperation(data) {
    return await invoke('my-operation', data)
  }
  return { myOperation }
}
```

3. Use in component:
```js
const { myOperation } = useMyFeature()
```

### Adding a New Translation

Add key to both `src/renderer/src/i18n/locales/km.js` and `en.js`:
```js
// km.js
export default {
  myKey: 'តម្លៃភាសាខ្មែរ',
  // ...
}

// en.js
export default {
  myKey: 'English value',
  // ...
}
```

### Adding a New Route/Tab

1. Create view component in `src/renderer/src/views/MyView.vue`
2. Add route in `src/renderer/src/router/index.js`:
```js
{ path: '/my-route', name: 'myRoute', component: () => import('../views/MyView.vue') }
```
3. Add tab in `src/renderer/src/components/layout/TabNavigation.vue`:
```js
{ path: '/my-route', label: 'myTabLabel' }
```
4. Add translation keys for tab label

## Build Output

- **Development**: Vite serves from `src/renderer` on port 5173
- **Production Vue Build**: `src/renderer/dist/`
- **Production Electron Build**: `dist-builder/` (AppImage, .deb, etc.)

## Known Constraints

- Main process uses CommonJS (`require`), renderer uses ES modules (`import`)
- `nodeIntegration: true` means renderer can access Node.js - this is intentional but less secure than context isolation
- Hash routing (`#/create`) required for Electron - standard history mode doesn't work with `file://` protocol
- Sudo operations block UI - user must enter password in system dialog
- NVM commands need shell initialization (`export NVM_DIR=...`) to work in child processes
