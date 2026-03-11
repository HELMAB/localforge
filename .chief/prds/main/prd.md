# PRD: Replace Header & Tabs with Native Electron Menu

## Introduction

Remove the in-app Vue header (logo, dark mode toggle, language selector, peace banner) and tab navigation bar, replacing them with Electron's native window menu. This gives the app a cleaner, more native desktop feel while preserving all navigation and preference controls.

## Goals

- Replace in-app header and tab navigation with a native Electron menu bar
- Preserve all navigation functionality (4 views with Ctrl+1-4 shortcuts)
- Preserve dark mode toggle and language switching via the View menu
- Keep menu state in sync with renderer state (checked/radio indicators)
- Remove unused components and composables to reduce code bloat

## User Stories

### US-001: Create Native Menu Module
**Priority:** 1
**Description:** As a developer, I need a reusable menu builder module in the main process so that the native Electron menu can be constructed and rebuilt when state changes.

**Acceptance Criteria:**
- [ ] New file `src/main/menu.js` created using CommonJS (matching main process convention)
- [ ] Exports `buildMenu(mainWindow)` that creates and sets the application menu
- [ ] Exports `rebuildMenu(mainWindow, state)` that updates checked/radio state and re-applies the menu
- [ ] Module-level variables track current `isDark` (boolean) and `language` ('km'|'en') state
- [ ] Menu includes: File (Quit), Navigation (4 items), View (dark mode checkbox + language radio submenu), Edit (role-based), Window (Reload, DevTools, Minimize)
- [ ] Navigation items send IPC `'navigate'` with route path to renderer (e.g., `/projects`)
- [ ] Dark mode item sends IPC `'menu-toggle-dark-mode'` to renderer
- [ ] Language items send IPC `'menu-set-language'` with `'km'` or `'en'` to renderer
- [ ] `npm run lint` passes

### US-002: Integrate Menu into Main Process
**Priority:** 2
**Description:** As a developer, I need the main process to initialize the native menu and handle state sync IPC from the renderer so that menu state stays accurate.

**Acceptance Criteria:**
- [ ] `ipcMain` added to the `require('electron')` destructure in `src/main/main.js`
- [ ] `buildMenu` and `rebuildMenu` imported from `./menu`
- [ ] `autoHideMenuBar: true` removed from BrowserWindow options
- [ ] `buildMenu(mainWindow)` called after window creation in `app.whenReady()`
- [ ] IPC listener `'dark-mode-changed'` calls `rebuildMenu` with updated `isDark`
- [ ] IPC listener `'language-changed'` calls `rebuildMenu` with updated `language`
- [ ] `npm run lint` passes

### US-003: Wire Renderer to Native Menu IPC
**Priority:** 3
**Description:** As a user, I want menu clicks to navigate views and toggle preferences so that the native menu fully replaces the old in-app controls.

**Acceptance Criteria:**
- [ ] `App.vue` imports `ipcRenderer` from electron and `useRouter` from vue-router
- [ ] IPC listener `'navigate'` calls `router.push(path)` to switch views
- [ ] IPC listener `'menu-toggle-dark-mode'` calls the existing `toggleDarkMode` function
- [ ] IPC listener `'menu-set-language'` sets `locale.value` to the received language
- [ ] On mount, renderer sends `'dark-mode-changed'` and `'language-changed'` with initial state to sync menu
- [ ] A Vue `watch` on `locale` sends `'language-changed'` to main process on every change
- [ ] After `toggleDarkMode`, sends `'dark-mode-changed'` with new `isDark` value to main process
- [ ] `npm run lint` passes

### US-004: Remove Header, Tabs, and Unused Code
**Priority:** 4
**Description:** As a developer, I want to clean up the removed UI components and unused composables so the codebase stays lean.

**Acceptance Criteria:**
- [ ] `<AppHeader />` removed from `App.vue` template
- [ ] `<TabNavigation />` removed from `App.vue` template
- [ ] `AppHeader` and `TabNavigation` imports removed from `App.vue` script
- [ ] `window.addEventListener('toggle-dark-mode', ...)` and `window.addEventListener('toggle-language', ...)` removed from `App.vue` (replaced by IPC)
- [ ] File deleted: `src/renderer/src/components/layout/AppHeader.vue`
- [ ] File deleted: `src/renderer/src/components/layout/TabNavigation.vue`
- [ ] File deleted: `src/renderer/src/composables/usePeaceBanner.js`
- [ ] File deleted: `src/renderer/src/composables/useKeyboardShortcuts.js`
- [ ] `useKeyboardShortcuts` import and call removed from `App.vue`
- [ ] Layout styling in `App.vue` adjusted (remove header-related spacing like `mb-6` on outer wrapper)
- [ ] `npm run lint` passes

## Functional Requirements

- FR-1: The native menu bar must always be visible (not auto-hidden)
- FR-2: Navigation menu must contain 4 items: Projects (Ctrl+1), Virtual Hosts (Ctrl+2), Services (Ctrl+3), Settings (Ctrl+4)
- FR-3: Clicking a Navigation menu item must navigate the Vue Router to the corresponding route
- FR-4: View menu must contain a Dark Mode toggle checkbox item with Ctrl+D accelerator
- FR-5: View menu must contain a Language submenu with radio items for Khmer and English
- FR-6: Dark mode checkbox state must reflect the actual app dark mode state
- FR-7: Language radio selection must reflect the actual app language
- FR-8: Standard Edit menu (undo, redo, cut, copy, paste, select all) must be available
- FR-9: Window menu must include Reload, Toggle DevTools, and Minimize

## Non-Goals

- No custom/styled menu (uses native OS menu only)
- No macOS-specific app menu handling (app targets Linux primarily)
- No new settings UI for dark mode or language (these exist in Settings view already)
- No changes to the router configuration or view components
- No changes to the main process IPC handlers for project/nginx/tools/system

## Technical Considerations

- **Main process uses CommonJS** (`require`), renderer uses ES modules (`import`). The new `menu.js` must use CommonJS.
- **`nodeIntegration: true` and `contextIsolation: false`** — renderer can use `require('electron').ipcRenderer` directly.
- **Menu rebuild on state change** — `Menu.setApplicationMenu()` is called on every dark mode/language toggle. This is lightweight and standard Electron practice.
- **Accelerator conflicts** — Ctrl+D (bookmark in Chrome) is overridden by native menu accelerators in Electron. No conflict in production.
- **Ctrl+1-4 in text inputs** — Native accelerators fire even in text inputs. This matches existing behavior and is acceptable.
- **Existing composables to reuse:**
  - `useDarkMode()` at `src/renderer/src/composables/useDarkMode.js` — provides `isDark` ref and `toggleDarkMode()`
  - `useSettings()` at `src/renderer/src/composables/useSettings.js` — provides persisted `settings.value.language`

## Design Considerations

- With header and tabs removed, the app content area starts directly below the native menu bar
- The content wrapper in `App.vue` (white/dark card with shadow and rounded corners) remains
- `<AppFooter />` remains at the bottom
- All modal overlays (ErrorModal, CommandPalette, WelcomeDialog, OnboardingTour, OperationMonitor, Toaster) remain unchanged

## Success Metrics

- All 4 navigation items work via menu clicks and Ctrl+1-4 shortcuts
- Dark mode toggles correctly via menu and Ctrl+D, checkbox state stays in sync
- Language switches correctly via menu, radio state stays in sync
- No in-app header or tab bar renders
- `npm run lint` passes with no errors
- App launches without console errors

## Open Questions

- Should Ctrl+, (open settings) be kept as an additional accelerator on the Settings menu item? (Currently it exists in useKeyboardShortcuts but is redundant with Ctrl+4)
