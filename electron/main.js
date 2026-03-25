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

ipcMain.handle('integrate:run', async (_event, { targetPath, selectedFiles }) => {
  try {
    const targetClaudeDir = path.join(targetPath, '.claude')
    let backup = null

    // Backup existing .claude if present
    if (fs.existsSync(targetClaudeDir)) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
      backup = path.join(targetPath, `.claude.bak.${ts}`)
      fs.cpSync(targetClaudeDir, backup, { recursive: true })
    }

    const selectedSet = new Set(selectedFiles)
    let copied = 0
    let skipped = 0

    const sourceFiles = walkDir(SOURCE_DIR, SOURCE_DIR)
    for (const rel of sourceFiles) {
      if (!selectedSet.has(rel)) { skipped++; continue }
      const srcFile = path.join(SOURCE_DIR, rel)
      const destFile = path.join(targetClaudeDir, rel)
      fs.mkdirSync(path.dirname(destFile), { recursive: true })
      fs.copyFileSync(srcFile, destFile)
      copied++
    }

    return { copied, skipped, backup }
  } catch (err) {
    return { error: err.message }
  }
})

const SCOPED_DIRS = ['agents', 'skills', 'commands', 'rules', 'code-rules', 'agent-rules', 'workflows']

ipcMain.handle('pull:scan', async (_event, { sourcePath }) => {
  try {
    const sourceClaudeDir = path.join(sourcePath, '.claude')
    if (!fs.existsSync(sourceClaudeDir)) {
      return { error: `.claude not found at: ${sourcePath}` }
    }
    const adds = []
    const updates = []
    for (const scope of SCOPED_DIRS) {
      const scopeDir = path.join(sourceClaudeDir, scope)
      if (!fs.existsSync(scopeDir)) continue
      for (const rel of walkDir(scopeDir, sourceClaudeDir)) {
        const destFile = path.join(SOURCE_DIR, rel)
        if (!fs.existsSync(destFile)) {
          adds.push(rel)
        } else {
          const srcContent = fs.readFileSync(path.join(sourceClaudeDir, rel))
          const dstContent = fs.readFileSync(destFile)
          if (!srcContent.equals(dstContent)) updates.push(rel)
        }
      }
    }
    return { adds, updates }
  } catch (err) {
    return { error: err.message }
  }
})

ipcMain.handle('pull:run', async (_event, { sourcePath, selectedFiles }) => {
  try {
    const sourceClaudeDir = path.join(sourcePath, '.claude')
    const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
    const backup = path.join(path.dirname(SOURCE_DIR), `.claude.bak.${ts}`)
    fs.cpSync(SOURCE_DIR, backup, { recursive: true })

    const selectedSet = new Set(selectedFiles)
    let added = 0, updated = 0
    for (const scope of SCOPED_DIRS) {
      const scopeDir = path.join(sourceClaudeDir, scope)
      if (!fs.existsSync(scopeDir)) continue
      for (const rel of walkDir(scopeDir, sourceClaudeDir)) {
        if (!selectedSet.has(rel)) continue
        const srcFile = path.join(sourceClaudeDir, rel)
        const destFile = path.join(SOURCE_DIR, rel)
        const isNew = !fs.existsSync(destFile)
        fs.mkdirSync(path.dirname(destFile), { recursive: true })
        fs.copyFileSync(srcFile, destFile)
        isNew ? added++ : updated++
      }
    }
    return { added, updated, backup }
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
