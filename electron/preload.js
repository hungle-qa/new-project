const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('integrator', {
  browse: () => ipcRenderer.invoke('dialog:browse'),
  scan: (targetPath) => ipcRenderer.invoke('integrate:scan', { targetPath }),
  run: (targetPath, overwriteList) => ipcRenderer.invoke('integrate:run', { targetPath, overwriteList }),
  pullScan: (sourcePath) => ipcRenderer.invoke('pull:scan', { sourcePath }),
  pullRun: (sourcePath, selectedFiles) => ipcRenderer.invoke('pull:run', { sourcePath, selectedFiles }),
})
