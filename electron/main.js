const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const SOURCE_DIR = path.join(__dirname, '..', '.claude')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: '.claude Integrator',
  })
  win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })

// --- IPC Handlers ---

ipcMain.handle('dialog:browse', async () => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: 'Select target project folder',
  })
  return filePaths[0] ?? null
})

ipcMain.handle('integrate:scan', async (_event, { targetPath }) => {
  try {
    if (!fs.existsSync(targetPath)) {
      return { error: `Path does not exist: ${targetPath}` }
    }
    const targetClaudeDir = path.join(targetPath, '.claude')
    const sourceFiles = walkDir(SOURCE_DIR, SOURCE_DIR)
    const newFiles = []
    const conflictFiles = []
    for (const rel of sourceFiles) {
      const targetFile = path.join(targetClaudeDir, rel)
      if (fs.existsSync(targetFile)) {
        conflictFiles.push(rel)
      } else {
        newFiles.push(rel)
      }
    }
    return { newFiles, conflictFiles }
  } catch (err) {
    return { error: err.message }
  }
})

ipcMain.handle('integrate:run', async (_event, { targetPath, overwriteList }) => {
  try {
    const targetClaudeDir = path.join(targetPath, '.claude')
    let backup = null

    // Backup existing .claude if present
    if (fs.existsSync(targetClaudeDir)) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
      backup = path.join(targetPath, `.claude.bak.${ts}`)
      fs.cpSync(targetClaudeDir, backup, { recursive: true })
    }

    const sourceFiles = walkDir(SOURCE_DIR, SOURCE_DIR)
    let copied = 0
    let skipped = 0
    const overwriteSet = new Set(overwriteList)

    for (const rel of sourceFiles) {
      const srcFile = path.join(SOURCE_DIR, rel)
      const destFile = path.join(targetClaudeDir, rel)
      const exists = fs.existsSync(destFile)

      if (!exists || overwriteSet.has(rel)) {
        fs.mkdirSync(path.dirname(destFile), { recursive: true })
        fs.copyFileSync(srcFile, destFile)
        copied++
      } else {
        skipped++
      }
    }

    return { copied, skipped, backup }
  } catch (err) {
    return { error: err.message }
  }
})

// --- Helpers ---

function walkDir(dir, base) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, base))
    } else {
      results.push(path.relative(base, fullPath))
    }
  }
  return results
}
