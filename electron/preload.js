const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('integrator', {
  browse: () => ipcRenderer.invoke('dialog:browse'),
  scan: (targetPath) => ipcRenderer.invoke('integrate:scan', { targetPath }),
  run: (targetPath, selectedFiles) => ipcRenderer.invoke('integrate:run', { targetPath, selectedFiles }),
  pullScan: (sourcePath) => ipcRenderer.invoke('pull:scan', { sourcePath }),
  pullRun: (sourcePath, selectedFiles) => ipcRenderer.invoke('pull:run', { sourcePath, selectedFiles }),
})
