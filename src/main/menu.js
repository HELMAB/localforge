const { Menu } = require('electron')

let language = 'km'

const translations = {
  km: {
    file: 'ឯកសារ',
    projects: 'គម្រោង',
    newProject: 'គម្រោងថ្មី',
    listProjects: 'បង្ហាញគម្រោង',
    importProject: 'នាំចូលគម្រោង',
    virtualHosts: 'Virtual Host',
    newVirtualHost: 'Virtual Host ថ្មី',
    manageSites: 'គ្រប់គ្រងតំបន់',
    services: 'សេវាកម្ម',
    php: 'PHP',
    composer: 'Composer',
    nodejs: 'Node.js',
    nginx: 'Nginx',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    preferences: 'ចំណូលចន្រ',
    window: 'បង្អួច',
    minimize: 'បង្រួម',
    about: 'អំពី',
    help: 'ជំនួយ',
    restartApp: 'ចាប់ផ្ដើមឡើងវិញ',
    checkUpdates: 'ពិនិត្យបច្ចេកទេស',
    close: 'បិទ',
    quit: 'ចេញ',
  },
  en: {
    file: 'File',
    projects: 'Projects',
    newProject: 'New Project',
    listProjects: 'List Projects',
    importProject: 'Import Project',
    virtualHosts: 'Virtual Hosts',
    newVirtualHost: 'New Virtual Host',
    manageSites: 'Manage Sites',
    services: 'Services',
    php: 'PHP',
    composer: 'Composer',
    nodejs: 'Node.js',
    nginx: 'Nginx',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    preferences: 'Preferences',
    window: 'Window',
    minimize: 'Minimize',
    about: 'About',
    help: 'Help',
    restartApp: 'Restart App',
    checkUpdates: 'Check for Updates',
    close: 'Close',
    quit: 'Quit',
  },
}

function t(key) {
  return translations[language][key] || key
}

function buildMenu(mainWindow) {
  const isMac = process.platform === 'darwin'
  const tr = t

  const template = [
    // File menu
    {
      label: tr('file'),
      submenu: [
        {
          label: tr('projects'),
          submenu: [
            {
              label: tr('newProject'),
              accelerator: 'CmdOrCtrl+N',
              click: () => mainWindow.webContents.send('navigate', '/projects', 'new'),
            },
            {
              label: tr('listProjects'),
              accelerator: 'CmdOrCtrl+Shift+P',
              click: () => mainWindow.webContents.send('navigate', '/projects', 'recent'),
            },
            {
              label: tr('importProject'),
              accelerator: 'CmdOrCtrl+I',
              click: () => mainWindow.webContents.send('navigate', '/projects', 'import'),
            },
          ],
        },
        {
          label: tr('virtualHosts'),
          submenu: [
            {
              label: tr('newVirtualHost'),
              accelerator: 'CmdOrCtrl+H',
              click: () => mainWindow.webContents.send('navigate', '/virtual-hosts', 'new'),
            },
            {
              label: tr('manageSites'),
              accelerator: 'CmdOrCtrl+Shift+H',
              click: () => mainWindow.webContents.send('navigate', '/virtual-hosts', 'manage'),
            },
          ],
        },
        {
          label: tr('services'),
          submenu: [
            {
              label: tr('php'),
              click: () => mainWindow.webContents.send('navigate', '/services', 'php'),
            },
            {
              label: tr('composer'),
              click: () => mainWindow.webContents.send('navigate', '/services', 'composer'),
            },
            {
              label: tr('nodejs'),
              click: () => mainWindow.webContents.send('navigate', '/services', 'node'),
            },
            {
              label: tr('nginx'),
              click: () => mainWindow.webContents.send('navigate', '/services', 'nginx'),
            },
            {
              label: tr('postgresql'),
              click: () => mainWindow.webContents.send('navigate', '/services', 'postgresql'),
            },
            {
              label: tr('mysql'),
              click: () => mainWindow.webContents.send('navigate', '/services', 'mysql'),
            },
          ],
        },
        { type: 'separator' },
        {
          label: tr('preferences'),
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow.webContents.send('navigate', '/settings'),
        },
        { type: 'separator' },
        isMac ? { label: tr('close'), role: 'close' } : { label: tr('quit'), role: 'quit' },
      ],
    },
    // Window menu
    {
      label: tr('window'),
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'minimize' },
        { type: 'separator' },
        {
          label: tr('about'),
          click: () => mainWindow.webContents.send('show-about'),
        },
      ],
    },
    // Help menu
    {
      label: tr('help'),
      submenu: [
        {
          label: tr('restartApp'),
          click: () => {
            mainWindow.webContents.send('restart-app')
          },
        },
        {
          label: tr('checkUpdates'),
          click: () => {
            mainWindow.webContents.send('check-updates')
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function rebuildMenu(mainWindow, state) {
  if (state.language !== undefined) {
    language = state.language
  }
  buildMenu(mainWindow)
}

module.exports = { buildMenu, rebuildMenu }
