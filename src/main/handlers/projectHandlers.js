const { ipcMain, dialog } = require('electron')
const { buildProjectCommand, executeProject, cancelOperation } = require('../services/projectService')
const fs = require('fs')

function registerProjectHandlers(mainWindow) {
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    return result.filePaths[0]
  })

  ipcMain.handle('create-project', async (event, params) => {
    const normalizedParams = {
      ...params,
      projectPath: params.path,
    }
    const { command, fullPath } = buildProjectCommand(normalizedParams)
    return executeProject({
      command,
      fullPath,
      type: params.type,
      operationId: params.operationId,
      event,
    })
  })

  ipcMain.handle('cancel-operation', async (_event, { operationId }) => {
    return cancelOperation(operationId)
  })

  ipcMain.handle('check-directory-exists', async (_event, { dirPath }) => {
    return fs.existsSync(dirPath)
  })
}

module.exports = { registerProjectHandlers }
