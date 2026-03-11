## [2026-03-11 16:30] - US-001

- What was implemented
  - Restructured File menu with submenus (Projects, Virtual Hosts, Services)
  - Added Preferences menu item that opens Settings view
  - Added Window menu with About option
  - Added Help menu with Restart App and Check for Updates
  - Removed Edit, Navigation, View menus
  - Implemented menu label localization (Khmer/English) that updates when language changes
  - Created useMenuNavigation composable to handle menu-driven navigation with sub-views
- Files changed
  - src/main/menu.js - Complete restructure with translations
  - src/main/main.js - Removed dark-mode-changed listener
  - src/renderer/src/App.vue - Updated to handle new navigation events with sub-view parameters
  - src/renderer/src/views/ManageProjectView.vue - Added menu navigation support
  - src/renderer/src/views/ManageVirtualHostView.vue - Added menu navigation support
  - src/renderer/src/views/ManageServicesView.vue - Added menu navigation support
  - src/renderer/src/composables/useMenuNavigation.js - New composable for menu-driven navigation

- **Learnings for future iterations:**
  - Electron menus don't have direct access to Vue i18n - translations must be defined in the main process
  - Use IPC to communicate between main process and renderer for menu actions
  - Views with internal state (like activeView) need a shared composable to respond to menu navigation
  - The menu labels are updated by rebuilding the entire menu when language changes
  - Sub-menu item labels should match the internal state values used by view components for easy mapping

---

## [2026-03-11 17:15] - US-004

- What was implemented
  - Added IPC handlers in main.js for 'restart-app' and 'check-for-updates'
  - 'restart-app' uses app.relaunch() and app.exit(0) to restart Electron
  - 'check-for-updates' invokes autoUpdater.checkForUpdates() and shows toast message
  - Added IPC listeners in App.vue for menu events 'restart-app' and 'check-updates'
  - Added translation keys 'updateAvailable' and 'noUpdates' in both Khmer and English

- Files changed
  - src/main/main.js - Added IPC handlers for restart and check updates
  - src/renderer/src/App.vue - Added IPC listeners for menu events, added toast and t function
  - src/renderer/src/i18n/locales/en.js - Added translation keys
  - src/renderer/src/i18n/locales/km.js - Added translation keys

- **Learnings for future iterations:**
  - autoUpdater is already set up in main.js, but only checks for updates in production mode
  - IPC invoke is used for actions that need a response (check-for-updates)
  - IPC send/on is used for fire-and-forget actions (restart-app)
  - Use toast system to show feedback to user for menu actions

- What was implemented
  - Verified Edit, Navigation, View menus are removed (already done in US-001)
  - Verified Dark Mode toggle is available in Settings/Preferences
  - Verified Language selector is available in Settings/Preferences

- Files changed
  - No new files needed - functionality already exists in PreferenceSettings.vue

- **Learnings for future iterations:**
  - US-002 acceptance criteria were already satisfied during US-001 implementation
  - PreferenceSettings.vue already contains Dark Mode toggle and Language selector
  - Menu bar only contains File, Window, and Help menus

---

## [2026-03-11 17:00] - US-003

- What was implemented
  - Window menu already had Minimize and About items (added in US-001)
  - Created AboutModal component to display app info when About is clicked
  - Added IPC listener for 'show-about' event in App.vue
  - Added translation keys for "about.version" in both Khmer and English

- Files changed
  - src/renderer/src/components/common/AboutModal.vue - New modal component
  - src/renderer/src/App.vue - Added AboutModal and IPC listener
  - src/renderer/src/i18n/locales/en.js - Added translation key
  - src/renderer/src/i18n/locales/km.js - Added translation key

- **Learnings for future iterations:**
  - The Window menu already had About menu item sending 'show-about' IPC event
  - The renderer needs to listen for IPC events from main process
  - Modal components follow the same pattern as SuccessModal using Dialog and DialogContent from shadcn/ui

---

## [2026-03-11 17:30] - US-007

- What was implemented
  - Removed sidebar from Projects view (ManageProjectView.vue)
  - Removed sidebar from Virtual Hosts view (ManageVirtualHostView.vue)
  - Removed sidebar from Services view (ManageServicesView.vue)
  - Settings view already had full-width content (no changes needed)
  - Navigation now happens via File menu (already implemented in US-001)

- Files changed
  - src/renderer/src/views/ManageProjectView.vue - Removed ProjectSidebar component, made content full-width
  - src/renderer/src/views/ManageVirtualHostView.vue - Removed VirtualHostSidebar component, made content full-width
  - src/renderer/src/views/ManageServicesView.vue - Removed ToolsSidebar component, made content full-width

- **Learnings for future iterations:**
  - Sidebar components (ProjectSidebar, VirtualHostSidebar, ToolsSidebar) are now unused but can be kept for potential future use
  - File menu already provides complete navigation to all sub-views via submenus
  - The useMenuNavigation composable handles navigation from menu to views with sub-view parameters
