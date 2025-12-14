export function useIpc() {
  const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null

  if (!ipcRenderer) {
    throw new Error('Electron IPC not available')
  }

  async function invoke(channel, ...args) {
    return await ipcRenderer.invoke(channel, ...args)
  }

  return {
    invoke,
  }
}
