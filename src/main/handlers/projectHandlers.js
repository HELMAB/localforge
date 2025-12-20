const { ipcMain, dialog, shell } = require('electron')
const { buildProjectCommand, executeProject, cancelOperation, detectProjectType } = require('../services/projectService')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)

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

  ipcMain.handle('detect-project', async (_event, { projectPath }) => {
    return detectProjectType(projectPath)
  })

  ipcMain.handle('open-in-browser', async (_event, { url }) => {
    await shell.openExternal(url)
    return { success: true }
  })

  ipcMain.handle('open-in-editor', async (_event, { path: projectPath, editor = 'code' }) => {
    try {
      const commands = {
        code: `code "${projectPath}"`,
        phpstorm: `phpstorm "${projectPath}"`,
        webstorm: `webstorm "${projectPath}"`,
        sublime: `subl "${projectPath}"`,
        atom: `atom "${projectPath}"`,
      }
      await execAsync(commands[editor] || commands.code)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to open editor: ${error.message}`)
    }
  })

  ipcMain.handle('open-in-file-manager', async (_event, { path: projectPath }) => {
    shell.showItemInFolder(projectPath)
    return { success: true }
  })

  ipcMain.handle('get-project-details', async (_event, { projectPath }) => {
    try {
      const stats = fs.statSync(projectPath)
      const packageJsonPath = path.join(projectPath, 'package.json')
      const composerJsonPath = path.join(projectPath, 'composer.json')
      
      const details = {
        path: projectPath,
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime,
      }

      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        details.dependencies = packageJson.dependencies
        details.devDependencies = packageJson.devDependencies
      }

      if (fs.existsSync(composerJsonPath)) {
        const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'))
        details.composerDependencies = composerJson.require
      }

      return details
    } catch (error) {
      throw new Error(`Failed to get project details: ${error.message}`)
    }
  })
}

module.exports = { registerProjectHandlers }
