const { ipcMain, dialog, app } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { exec } = require('child_process')
const sudo = require('sudo-prompt')
const operationRollback = require('../operationRollback')

function registerSystemHandlers(mainWindow) {
  ipcMain.handle('validate-system-state', async (_event, { checks }) => {
    const validationChecks = {}

    if (checks.portAvailable) {
      validationChecks.portAvailable = () => {
        return new Promise((resolve) => {
          const port = checks.portAvailable
          exec(`lsof -i :${port}`, (error) => {
            resolve({ valid: !!error, port, inUse: !error })
          })
        })
      }
    }

    if (checks.directoryExists) {
      validationChecks.directoryExists = () => {
        return new Promise((resolve) => {
          const dir = checks.directoryExists
          resolve({ valid: fs.existsSync(dir), path: dir })
        })
      }
    }

    if (checks.diskSpace) {
      validationChecks.diskSpace = () => {
        return new Promise((resolve) => {
          exec('df -h /', (error, stdout) => {
            if (error) {
              resolve({ valid: true })
              return
            }
            const lines = stdout.trim().split('\n')
            const data = lines[1].split(/\s+/)
            const usedPercent = parseInt(data[4])
            resolve({ valid: usedPercent < 90, usedPercent })
          })
        })
      }
    }

    if (checks.nginxRunning) {
      validationChecks.nginxRunning = () => {
        return new Promise((resolve) => {
          exec('systemctl is-active nginx', (error, stdout) => {
            const isRunning = stdout.trim() === 'active'
            resolve({ valid: isRunning, running: isRunning })
          })
        })
      }
    }

    return await operationRollback.validatePreConditions(validationChecks)
  })

  ipcMain.handle('backup-file', async (_event, { filePath }) => {
    try {
      return await operationRollback.backupFile(filePath)
    } catch (error) {
      throw new Error(`Backup failed: ${error.message}`)
    }
  })

  ipcMain.handle('restore-backup', async (_event, { backupPath, originalPath }) => {
    try {
      return await operationRollback.restoreFile(backupPath, originalPath)
    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`)
    }
  })

  ipcMain.handle('check-for-updates', async () => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        mainWindow.webContents.send('update-not-available', {
          version: app.getVersion(),
          isDevelopment: true,
        })
      }, 500)
      return { isDevelopment: true, message: 'Development mode - updates disabled' }
    }
    try {
      return await autoUpdater.checkForUpdates()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Update check failed:', error)
      throw error
    }
  })

  ipcMain.handle('download-update', async () => {
    return await autoUpdater.downloadUpdate()
  })

  ipcMain.handle('install-update', async () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.handle('export-backup', async () => {
    return new Promise((resolve, reject) => {
      dialog
        .showSaveDialog(mainWindow, {
          title: 'Export Backup',
          defaultPath: path.join(os.homedir(), `localforge-backup-${Date.now()}.tar.gz`),
          filters: [{ name: 'Backup Files', extensions: ['tar.gz'] }],
        })
        .then((result) => {
          if (result.canceled) {
            resolve({ success: false, canceled: true })
            return
          }

          const backupPath = result.filePath
          const tempDir = path.join(os.tmpdir(), `localforge-backup-${Date.now()}`)

          const nginxDir = path.join(tempDir, 'nginx')
          const sslDir = path.join(tempDir, 'ssl')

          fs.mkdirSync(tempDir, { recursive: true })
          fs.mkdirSync(nginxDir, { recursive: true })
          fs.mkdirSync(sslDir, { recursive: true })

          exec(`cp -r /etc/nginx/sites-available/* ${nginxDir}/ 2>/dev/null`, (nginxErr) => {
            exec(`cp -r /etc/nginx/ssl/* ${sslDir}/ 2>/dev/null`, (sslErr) => {
              const metadata = {
                timestamp: new Date().toISOString(),
                hostname: os.hostname(),
                version: app.getVersion(),
              }
              fs.writeFileSync(path.join(tempDir, 'metadata.json'), JSON.stringify(metadata, null, 2))

              exec(`tar -czf "${backupPath}" -C "${tempDir}" .`, { maxBuffer: 1024 * 1024 * 50 }, (tarErr) => {
                exec(`rm -rf "${tempDir}"`, () => {
                  if (tarErr) {
                    reject(new Error(`Failed to create backup: ${tarErr.message}`))
                  } else {
                    resolve({
                      success: true,
                      path: backupPath,
                      nginxCopied: !nginxErr,
                      sslCopied: !sslErr,
                    })
                  }
                })
              })
            })
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  })

  ipcMain.handle('import-backup', async () => {
    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog(mainWindow, {
          title: 'Import Backup',
          filters: [{ name: 'Backup Files', extensions: ['tar.gz'] }],
          properties: ['openFile'],
        })
        .then((result) => {
          if (result.canceled) {
            resolve({ success: false, canceled: true })
            return
          }

          const backupFile = result.filePaths[0]
          const tempDir = path.join(os.tmpdir(), `localforge-restore-${Date.now()}`)

          fs.mkdirSync(tempDir, { recursive: true })

          exec(`tar -xzf "${backupFile}" -C "${tempDir}"`, { maxBuffer: 1024 * 1024 * 50 }, (tarErr) => {
            if (tarErr) {
              exec(`rm -rf "${tempDir}"`, () => {})
              reject(new Error(`Failed to extract backup: ${tarErr.message}`))
              return
            }

            let metadata = null
            try {
              const metadataPath = path.join(tempDir, 'metadata.json')
              if (fs.existsSync(metadataPath)) {
                metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Could not read metadata:', e)
            }

            const nginxDir = path.join(tempDir, 'nginx')
            const sslDir = path.join(tempDir, 'ssl')

            const options = { name: 'LocalForge' }
            let restoreCommand = ''

            if (fs.existsSync(nginxDir)) {
              restoreCommand += `cp -r ${nginxDir}/* /etc/nginx/sites-available/ && `
            }

            if (fs.existsSync(sslDir)) {
              restoreCommand += `mkdir -p /etc/nginx/ssl && cp -r ${sslDir}/* /etc/nginx/ssl/ && `
            }

            if (fs.existsSync(nginxDir)) {
              const configs = fs.readdirSync(nginxDir).filter((f) => f !== 'default')
              configs.forEach((config) => {
                restoreCommand += `ln -sf /etc/nginx/sites-available/${config} /etc/nginx/sites-enabled/${config} && `
              })
            }

            restoreCommand += 'nginx -t && systemctl reload nginx'

            sudo.exec(restoreCommand, options, (restoreErr, _stdout, stderr) => {
              exec(`rm -rf "${tempDir}"`, () => {
                if (restoreErr) {
                  reject(new Error(stderr || restoreErr.message))
                } else {
                  resolve({
                    success: true,
                    metadata,
                    nginxRestored: fs.existsSync(nginxDir),
                    sslRestored: fs.existsSync(sslDir),
                  })
                }
              })
            })
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

module.exports = { registerSystemHandlers }
