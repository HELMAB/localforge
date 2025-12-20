# Main Process Architecture

This directory contains the refactored Electron main process code, organized into modular components for better maintainability.

## Directory Structure

```
src/main/
├── main.js                      # Entry point - window management & IPC registration
├── operationRollback.js         # Rollback utilities (unchanged)
├── handlers/                    # IPC handler registrations by feature
│   ├── projectHandlers.js       # Project creation, directory selection
│   ├── nginxHandlers.js         # Nginx configuration management
│   ├── toolsHandlers.js         # Development tools installation
│   └── systemHandlers.js        # System operations, backups, updates
├── services/                    # Business logic modules
│   ├── projectService.js        # Project creation logic
│   ├── nginxService.js          # Nginx operations
│   ├── nginxConfigGenerator.js  # Nginx config templates
│   └── toolsService.js          # Tools installation logic
└── utils/                       # Shared utilities
    └── helpers.js               # Common functions (stripAnsi, detectDistro, execSudo)
```

## Architecture Overview

### 1. **main.js** (Entry Point)
- Creates the BrowserWindow
- Sets up auto-updater
- Registers all IPC handlers from handler modules
- **Lines of code: ~90** (down from ~2446)

### 2. **handlers/** (IPC Layer)
Each handler module registers IPC channels and delegates to services:
- **projectHandlers.js**: `select-directory`, `create-project`, `cancel-operation`
- **nginxHandlers.js**: `configure-nginx`, `list-nginx-configs`, `enable/disable-nginx-config`, etc.
- **toolsHandlers.js**: `install-php`, `install-node`, `check-installed-tools`, etc.
- **systemHandlers.js**: `backup-file`, `export-backup`, `import-backup`, `check-for-updates`

### 3. **services/** (Business Logic)
Pure business logic with no IPC dependencies:

#### **projectService.js**
- `buildProjectCommand()` - Generates shell commands for project creation
- `executeProject()` - Executes commands with output streaming
- `cancelOperation()` - Terminates running operations
- Handles Laravel, Vue, Nuxt, React, WordPress project types

#### **nginxService.js**
- `configureNginx()` - Complete nginx configuration workflow
- `listNginxConfigs()` - Lists all nginx configurations
- `enableNginxConfig()` / `disableNginxConfig()` - Toggle configs
- `addSSLToConfig()` / `removeSSLFromConfig()` - SSL management
- `getNginxConfigDetails()` - Parse config files
- `deleteProjectAndConfigs()` - Remove project configs

#### **nginxConfigGenerator.js**
- `generateNginxConfig()` - Main config generator
- Separate functions for each project type:
  - `generateNuxtConfig()` - Nuxt SPA with `.output/public`
  - `generateStaticSpaConfig()` - Vue/React with `/dist`
  - `generateStaticHtmlConfig()` - Static HTML
  - `generatePhpConfig()` - Laravel/PHP with PHP-FPM
  - `generateWordPressConfig()` - WordPress with WP rules

#### **toolsService.js**
- PHP: `installPhp()`, `installPhpExtensions()`, `getPhpIniPath()`, `readPhpIni()`, `writePhpIni()`
- Node: `installNode()`, `setDefaultNode()`, `uninstallNode()`
- Others: `installNginx()`, `installComposer()`, `installPostgreSQL()`, `installMySQL()`
- `checkInstalledTools()` - Check all installed tool versions

### 4. **utils/helpers.js** (Shared Utilities)
- `stripAnsi()` - Remove ANSI escape codes from strings
- `detectDistro()` - Detect Linux distribution (Debian/RedHat/Arch)
- `execSudo()` - Execute commands with sudo prompt

## Benefits of This Architecture

### ✅ Separation of Concerns
- **IPC handlers** only handle communication (thin layer)
- **Services** contain all business logic (testable)
- **Utils** provide shared functionality

### ✅ Maintainability
- Each file has a single responsibility
- Easy to locate and modify specific features
- Clear file naming conventions

### ✅ Testability
- Services are pure functions (no IPC dependencies)
- Can be unit tested independently
- Mock dependencies easily

### ✅ Reusability
- Services can be imported and used by multiple handlers
- Utilities are shared across all modules
- Config generators can be reused or extended

### ✅ Scalability
- Add new features by creating new handler files
- Extend services without touching IPC layer
- Add new project types by extending config generator

## Adding New Features

### Example: Adding a new IPC handler

1. **Create service function** in `services/yourService.js`:
```js
function yourNewFeature(params) {
  // Business logic here
  return result
}
module.exports = { yourNewFeature }
```

2. **Create handler** in `handlers/yourHandlers.js`:
```js
const { ipcMain } = require('electron')
const { yourNewFeature } = require('../services/yourService')

function registerYourHandlers() {
  ipcMain.handle('your-channel', async (_event, params) => {
    return yourNewFeature(params)
  })
}
module.exports = { registerYourHandlers }
```

3. **Register in main.js**:
```js
const { registerYourHandlers } = require('./handlers/yourHandlers')

app.whenReady().then(() => {
  // ...
  registerYourHandlers()
})
```

## Migration Notes

- **Original main.js** backed up as `main.js.backup`
- All IPC channel names remain **exactly the same** (renderer code unchanged)
- All functionality preserved, just reorganized
- No breaking changes to the API

## Code Metrics

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| main.js | 2446 lines | 90 lines | **96% reduction** |
| Total main process | 2446 lines | ~700 lines (split across 10 files) | Modular |

## Testing Checklist

- [ ] Project creation (Laravel, Vue, Nuxt, React, WordPress)
- [ ] Nginx configuration (create, enable, disable, delete)
- [ ] SSL generation and management
- [ ] PHP installation and extensions
- [ ] Node.js installation via NVM
- [ ] Tools installation (Nginx, Composer, PostgreSQL, MySQL)
- [ ] Backup export/import
- [ ] Auto-updater functionality
