/* eslint-disable no-console */
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const { registerProjectHandlers } = require('./handlers/projectHandlers')
const { registerNginxHandlers } = require('./handlers/nginxHandlers')
const { registerToolsHandlers } = require('./handlers/toolsHandlers')
const { registerSystemHandlers } = require('./handlers/systemHandlers')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../renderer/src/assets/icons/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
    },
    autoHideMenuBar: true,
    fullscreen: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'))
  }
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdates()
  }

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update-not-available', info)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('download-progress', progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-downloaded', info)
  })

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update-error', err)
  })
}

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()

  registerProjectHandlers(mainWindow)
  registerNginxHandlers()
  registerToolsHandlers()
  registerSystemHandlers(mainWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
