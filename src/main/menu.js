const { Menu } = require('electron')

let isDark = false
let language = 'km'

function buildMenu(mainWindow) {
  const isMac = process.platform === 'darwin'

  const template = [
    // File menu
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    // Edit menu (role-based)
    { role: 'editMenu' },
    // Navigation menu
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Projects',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('navigate', '/projects'),
        },
        {
          label: 'Virtual Hosts',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('navigate', '/virtual-hosts'),
        },
        {
          label: 'Services',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('navigate', '/services'),
        },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow.webContents.send('navigate', '/settings'),
        },
      ],
    },
    // View menu
    {
      label: 'View',
      submenu: [
        {
          label: 'Dark Mode',
          type: 'checkbox',
          checked: isDark,
          click: () => mainWindow.webContents.send('menu-toggle-dark-mode'),
        },
        { type: 'separator' },
        {
          label: 'Language',
          submenu: [
            {
              label: 'ខ្មែរ (Khmer)',
              type: 'radio',
              checked: language === 'km',
              click: () => mainWindow.webContents.send('menu-set-language', 'km'),
            },
            {
              label: 'English',
              type: 'radio',
              checked: language === 'en',
              click: () => mainWindow.webContents.send('menu-set-language', 'en'),
            },
          ],
        },
      ],
    },
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'minimize' },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function rebuildMenu(mainWindow, state) {
  if (state.isDark !== undefined) {
    isDark = state.isDark
  }
  if (state.language !== undefined) {
    language = state.language
  }
  buildMenu(mainWindow)
}

module.exports = { buildMenu, rebuildMenu }
