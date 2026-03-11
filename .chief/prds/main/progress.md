## Codebase Patterns
- Main process uses CommonJS (`require`), renderer uses ES modules (`import`)
- ESLint enforces no unused variables (must prefix with `_` if intentionally unused)
- Menu module uses `Menu.buildFromTemplate()` and `Menu.setApplicationMenu()`
- IPC from main to renderer uses `mainWindow.webContents.send(channel, data)`
- Routes: `/projects`, `/virtual-hosts`, `/services`, `/settings`
- Prettier: no semicolons, single quotes, 2-space indent

---

## 2026-03-11 - US-001
- Created `src/main/menu.js` with `buildMenu(mainWindow)` and `rebuildMenu(mainWindow, state)` exports
- Menu includes: File (Quit), Edit (role-based), Navigation (4 route items with CmdOrCtrl+1-4), View (dark mode checkbox + language radio submenu), Window (Reload, DevTools, Minimize)
- Module-level `isDark` and `language` variables track current state for checked/radio items
- Files changed: `src/main/menu.js` (new)
- **Learnings for future iterations:**
  - Don't import `app` from electron unless actually used — lint will fail
  - Use `{ role: 'editMenu' }` for the Edit menu to get platform-appropriate items
  - `process.platform === 'darwin'` check needed for File menu (close vs quit)
---

## 2026-03-11 - US-002
- Integrated native menu into main process by importing `buildMenu`/`rebuildMenu` from `./menu`
- Added `ipcMain` to electron destructure for IPC listeners
- Removed `autoHideMenuBar: true` so native menu is always visible
- Added `ipcMain.on('dark-mode-changed')` and `ipcMain.on('language-changed')` listeners that call `rebuildMenu`
- Called `buildMenu(mainWindow)` right after `createWindow()` in `app.whenReady()`
- Files changed: `src/main/main.js`
- **Learnings for future iterations:**
  - Use `ipcMain.on()` (not `ipcMain.handle()`) for one-way renderer-to-main IPC that doesn't need a return value
  - Prefix unused callback params with `_` (e.g., `_event`) to satisfy ESLint
  - The PRD file may get `inProgress` field added by external tooling — handle gracefully when updating
---

## 2026-03-11 - US-003
- Wired renderer to native menu IPC in `App.vue`
- Added `ipcRenderer` import via `window.require('electron')` and `useRouter` from vue-router
- Added IPC listeners: `navigate` (router.push), `menu-toggle-dark-mode` (toggleDarkMode), `menu-set-language` (set locale)
- On mount, sends initial `dark-mode-changed` and `language-changed` to sync menu state
- Added `watch` on `locale` to send `language-changed` on every change
- Updated `toggleDarkMode` to send `dark-mode-changed` with new `isDark` value after toggling
- Files changed: `src/renderer/src/App.vue`
- **Learnings for future iterations:**
  - Use `window.require('electron')` in renderer (not `import`) since `nodeIntegration: true` and CommonJS interop
  - `ipcRenderer.on` callback receives `(_event, data)` — prefix unused event param with `_`
  - The `isDark` ref from `useDarkMode` is module-level (shared), so destructuring it works for reading current state
  - When menu-toggle-dark-mode fires, it calls the same toggleDarkMode which also sends dark-mode-changed back — this keeps menu checkbox in sync
---
