const { ipcMain } = require('electron')
const {
  configureNginx,
  generateSSL,
  listNginxConfigs,
  deleteNginxConfig,
  enableNginxConfig,
  disableNginxConfig,
  addSSLToConfig,
  removeSSLFromConfig,
  getNginxConfigDetails,
  deleteProjectAndConfigs,
} = require('../services/nginxService')

function registerNginxHandlers() {
  ipcMain.handle('configure-nginx', async (_event, params) => {
    return configureNginx(params)
  })

  ipcMain.handle('generate-ssl', async (_event, { domain }) => {
    const result = await generateSSL(domain)
    return {
      success: result.success,
      message: `SSL certificate generated for ${domain}`,
      path: `${result.sslPath}/${domain}.pem`,
    }
  })

  ipcMain.handle('list-nginx-configs', async () => {
    return listNginxConfigs()
  })

  ipcMain.handle('delete-nginx-config', async (_event, { configName }) => {
    return deleteNginxConfig(configName)
  })

  ipcMain.handle('enable-nginx-config', async (_event, { configName }) => {
    return enableNginxConfig(configName)
  })

  ipcMain.handle('disable-nginx-config', async (_event, { configName }) => {
    return disableNginxConfig(configName)
  })

  ipcMain.handle('add-ssl-to-config', async (_event, { configName }) => {
    return addSSLToConfig(configName)
  })

  ipcMain.handle('remove-ssl-from-config', async (_event, { configName }) => {
    return removeSSLFromConfig(configName)
  })

  ipcMain.handle('get-nginx-config-details', async (_event, { configName }) => {
    return getNginxConfigDetails(configName)
  })

  ipcMain.handle('delete-project-and-configs', async (_event, { projectPath }) => {
    return deleteProjectAndConfigs(projectPath)
  })
}

module.exports = { registerNginxHandlers }
