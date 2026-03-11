# PRD: Refactor Native Menu & Remove Sidebars

## Introduction

Refactor the Electron native menu to simplify the menu structure and remove sidebars from the main views. Currently, the app has separate File, Edit, Navigation, View, and Window menus with scattered functionality. This refactor consolidates all primary navigation and actions into a single File menu, adds a Help menu, and removes the sidebar navigation from all views.

## Goals

- Simplify menu structure: File, Window, Help only (remove Edit, Navigation, View menus)
- Consolidate all app navigation into File menu submenus
- Add localized menu labels (Khmer/English based on app language)
- Add Help menu with About option
- Add About page with basic app information
- Remove sidebar navigation from Projects, Virtual Hosts, Services, and Settings views
- Add App actions (Restart, Check for updates) to Help menu

## User Stories

### US-001: Restructure File menu with submenus

**Priority:** 1
**Description:** As a user, I want all primary actions accessible from a single File menu so the menu is easier to navigate.

**Acceptance Criteria:**

- [ ] File menu contains: Projects (submenu), Virtual Hosts (submenu), Services (submenu), Preferences
- [ ] Projects submenu has: New Project, List Projects, Import Project
- [ ] Virtual Hosts submenu has: New Virtual Host, Manage Sites
- [ ] Services submenu has: PHP, Composer, Node.js, Nginx, PostgreSQL, MySQL
- [ ] Preferences opens Settings view
- [ ] Menu labels update when app language changes

### US-002: Remove Edit, Navigation, View menus

**Priority:** 2
**Description:** As a user, I want a cleaner menu bar without redundant menus.

**Acceptance Criteria:**

- [ ] Edit menu (role-based) is removed
- [ ] Navigation menu is removed
- [ ] View menu (Dark Mode toggle, Language selector) is removed
- [ ] Dark Mode toggle available elsewhere (e.g., in Settings/Preferences)
- [ ] Language selector available elsewhere (e.g., in Settings/Preferences)

### US-003: Add Window menu items

**Priority:** 3
**Description:** As a user, I want access to window management and app info from the Window menu.

**Acceptance Criteria:**

- [ ] Window menu contains: Minimize (existing), About (new)
- [ ] About opens a modal or navigates to About page

### US-004: Add Help menu with App actions

**Priority:** 4
**Description:** As a user, I want access to app actions and help from a Help menu.

**Acceptance Criteria:**

- [ ] Help menu is added to menu bar
- [ ] Help menu contains: Restart App, Check for Updates
- [ ] Restart App restarts the Electron application
- [ ] Check for Updates shows available updates (or "No updates" message)

### US-005: Localize menu labels

**Priority:** 5
**Description:** As a Khmer-speaking user, I want menu labels displayed in my language when the app is set to Khmer.

**Acceptance Criteria:**

- [ ] When app language is Khmer, File menu shows "ឯកសារ" (File)
- [ ] When app language is Khmer, submenu labels appear in Khmer
- [ ] Menu labels update dynamically when user changes language
- [ ] All menu text is translatable via i18n system

### US-006: Create About page

**Priority:** 6
**Description:** As a user, I want to see basic app information when clicking About.

**Acceptance Criteria:**

- [ ] About page displays: App name, Version, Description
- [ ] About page accessible via Window > About or Help > About
- [ ] About page is a simple modal or dedicated view

### US-007: Remove sidebars from main views

**Priority:** 7
**Description:** As a user, I want a cleaner UI without sidebars in the main views.

**Acceptance Criteria:**

- [ ] Projects view has no sidebar (full-width content)
- [ ] Virtual Hosts view has no sidebar (full-width content)
- [ ] Services view has no sidebar (full-width content)
- [ ] Settings view has no sidebar (full-width content)
- [ ] Navigation happens via File menu or other UI elements

## Functional Requirements

- FR-1: File menu with submenus: Projects, Virtual Hosts, Services, Preferences
- FR-2: Projects submenu items: New Project, List Projects, Import Project (each triggers appropriate action)
- FR-3: Virtual Hosts submenu items: New Virtual Host, Manage Sites
- FR-4: Services submenu items: PHP, Composer, Node.js, Nginx, PostgreSQL, MySQL (each navigates to or focuses on service)
- FR-5: Preferences opens Settings view
- FR-6: Remove Edit, Navigation, View menus from menu bar
- FR-7: Window menu contains Minimize and About
- FR-8: Help menu contains Restart App, Check for Updates
- FR-9: All menu labels support localization (Khmer/English)
- FR-10: About page displays app name, version, description
- FR-11: Remove sidebar components from Projects, Virtual Hosts, Services, Settings views

## Non-Goals

- No changes to backend Electron IPC handlers
- No new features or functionality beyond navigation restructuring
- No changes to existing project creation, virtual host configuration, or service management logic
- No dark mode toggle in native menu (moved to Settings/Preferences)
- No language selector in native menu (moved to Settings/Preferences)

## Design Considerations

- Menu structure should follow platform conventions (macOS vs Linux)
- On macOS, app name appears before File menu (standard macOS pattern)
- Menu labels should use i18n keys and load translations dynamically
- About page can be a simple modal component to avoid adding new routes

## Technical Considerations

- Menu is built in `src/main/menu.js` using Electron's Menu API
- Existing navigation IPC handlers can be reused: `mainWindow.webContents.send('navigate', path)`
- i18n translations exist in `src/renderer/src/i18n/locales/km.js` and `en.js`
- New translations needed for menu labels
- Restart app: `app.relaunch()` + `app.exit(0)`
- Check for updates: can use electron-updater or show "No updates" placeholder
- Sidebar removal involves modifying view components in `src/renderer/src/views/`

## Success Metrics

- Menu has exactly 3 menus: File, Window, Help
- All navigation accessible from File menu
- Sidebars removed from all main views
- Menu labels update when language changes
- About page displays correctly

## Open Questions

- Should "Import Project" open a file dialog to import an existing project?
- Should each Services submenu item navigate to that specific service in the Services view, or open a section for that service?
- Should the About page be a modal or a full route/page?
- How should Restart App work - should it close and reopen, or just reload the window?
- Is electron-updater already set up, or should Check for Updates be a placeholder?
