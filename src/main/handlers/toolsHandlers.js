const { ipcMain } = require('electron')
const { exec } = require('child_process')
const {
  installPhp,
  installPhpExtensions,
  getPhpIniPath,
  readPhpIni,
  writePhpIni,
  listPhpExtensions,
  getInstalledPhpExtensions,
  installNode,
  setDefaultNode,
  uninstallNode,
  installNginx,
  installComposer,
  installPostgreSQL,
  installMySQL,
  checkInstalledTools,
} = require('../services/toolsService')

function registerToolsHandlers() {
  ipcMain.handle('check-requirements', async () => {
    const checks = {
      composer: false,
      node: false,
      nginx: false,
      mkcert: false,
      nvm: false,
      php: false,
    }

    const checkCommand = (cmd, key) => {
      return new Promise((res) => {
        exec(`which ${cmd}`, (error) => {
          checks[key] = !error
          res()
        })
      })
    }

    await Promise.all([
      checkCommand('composer', 'composer'),
      checkCommand('node', 'node'),
      checkCommand('nginx', 'nginx'),
      checkCommand('mkcert', 'mkcert'),
      checkCommand('nvm', 'nvm'),
      checkCommand('php', 'php'),
    ])

    return checks
  })

  ipcMain.handle('install-php', async (_event, { version }) => {
    return installPhp(version)
  })

  ipcMain.handle('install-php-extensions', async (_event, { version, extensions }) => {
    return installPhpExtensions(version, extensions)
  })

  ipcMain.handle('get-php-ini-path', async (_event, { version, type = 'cli' }) => {
    return getPhpIniPath(version, type)
  })

  ipcMain.handle('read-php-ini', async (_event, { filePath }) => {
    return readPhpIni(filePath)
  })

  ipcMain.handle('write-php-ini', async (_event, { filePath, content }) => {
    return writePhpIni(filePath, content)
  })

  ipcMain.handle('list-php-extensions', async (_event, { version }) => {
    return listPhpExtensions(version)
  })

  ipcMain.handle('get-installed-php-extensions', async (_event, { version }) => {
    return getInstalledPhpExtensions(version)
  })

  ipcMain.handle('install-node', async (event, { version }) => {
    return installNode(version, event)
  })

  ipcMain.handle('set-default-node', async (_event, { version }) => {
    return setDefaultNode(version)
  })

  ipcMain.handle('uninstall-node', async (_event, { version }) => {
    return uninstallNode(version)
  })

  ipcMain.handle('install-nginx', async () => {
    return installNginx()
  })

  ipcMain.handle('install-composer', async () => {
    return installComposer()
  })

  ipcMain.handle('install-postgresql', async (_event, { version }) => {
    return installPostgreSQL(version)
  })

  ipcMain.handle('install-mysql', async () => {
    return installMySQL()
  })

  ipcMain.handle('check-installed-tools', async () => {
    return checkInstalledTools()
  })
}

module.exports = { registerToolsHandlers }
