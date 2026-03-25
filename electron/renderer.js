// --- Tab switching ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    document.getElementById('tab-push').classList.toggle('hidden', btn.dataset.tab !== 'push')
    document.getElementById('tab-pull').classList.toggle('hidden', btn.dataset.tab !== 'pull')
    statusBar.textContent = ''
  })
})

// --- Confirm dialog ---
const confirmOverlay = document.getElementById('confirmOverlay')
const confirmBody = document.getElementById('confirmBody')
const confirmOkBtn = document.getElementById('confirmOkBtn')
const confirmCancelBtn = document.getElementById('confirmCancelBtn')

function showConfirm(html) {
  return new Promise(resolve => {
    confirmBody.innerHTML = html
    confirmOverlay.classList.remove('hidden')
    const cleanup = () => {
      confirmOverlay.classList.add('hidden')
      confirmOkBtn.removeEventListener('click', onOk)
      confirmCancelBtn.removeEventListener('click', onCancel)
      window.removeEventListener('keydown', onKey)
    }
    const onOk = () => { cleanup(); resolve(true) }
    const onCancel = () => { cleanup(); resolve(false) }
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onOk()
    }
    confirmOkBtn.addEventListener('click', onOk)
    confirmCancelBtn.addEventListener('click', onCancel)
    window.addEventListener('keydown', onKey)
  })
}

function buildConfirmHtml(newFiles, updateFiles, targetLabel) {
  let html = `<p style="margin-bottom:12px">Push to <strong>${targetLabel}</strong></p>`
  if (newFiles.length > 0) {
    html += `<p><span class="badge">${newFiles.length}</span> new file(s)</p>`
    html += `<ul class="file-list">${newFiles.map(f => `<li>${f}</li>`).join('')}</ul>`
  }
  if (updateFiles.length > 0) {
    html += `<p><span class="badge warn">${updateFiles.length}</span> file(s) to overwrite</p>`
    html += `<ul class="file-list">${updateFiles.map(f => `<li>${f}</li>`).join('')}</ul>`
  }
  return html
}

function buildPullConfirmHtml(addFiles, updateFiles, sourceLabel) {
  let html = `<p style="margin-bottom:12px">Pull from <strong>${sourceLabel}</strong></p>`
  if (addFiles.length > 0) {
    html += `<p><span class="badge">${addFiles.length}</span> new file(s)</p>`
    html += `<ul class="file-list">${addFiles.map(f => `<li>${f}</li>`).join('')}</ul>`
  }
  if (updateFiles.length > 0) {
    html += `<p><span class="badge warn">${updateFiles.length}</span> file(s) to overwrite</p>`
    html += `<ul class="file-list">${updateFiles.map(f => `<li>${f}</li>`).join('')}</ul>`
  }
  return html
}

// --- Shared helpers ---
function toggleVisible(list, checked) {
  list.querySelectorAll('li').forEach(li => {
    if (!li.classList.contains('hidden-filter')) {
      const cb = li.querySelector('input[type=checkbox]')
      if (cb) cb.checked = checked
    }
  })
}

function makeCheckList(list, files) {
  list.innerHTML = ''
  files.forEach(f => {
    const li = document.createElement('li')
    const label = document.createElement('label')
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = true
    cb.dataset.file = f
    label.appendChild(cb)
    label.append(' ' + f)
    li.appendChild(label)
    list.appendChild(li)
  })
}

// --- Push tab ---
const targetPathInput = document.getElementById('targetPath')
const browseBtn = document.getElementById('browseBtn')
const scanBtn = document.getElementById('scanBtn')
const resultsSection = document.getElementById('resultsSection')
const newFilesSection = document.getElementById('newFilesSection')
const updatesSection = document.getElementById('updatesSection')
const newCount = document.getElementById('newCount')
const updateCount = document.getElementById('updateCount')
const newFilesList = document.getElementById('newFilesList')
const updatesList = document.getElementById('updatesList')
const pushSearchInput = document.getElementById('pushSearchInput')
const integrateBtn = document.getElementById('integrateBtn')
const summarySection = document.getElementById('summarySection')
const summaryContent = document.getElementById('summaryContent')
const resetBtn = document.getElementById('resetBtn')
const statusBar = document.getElementById('statusBar')

function setStatus(msg, isError = false) {
  statusBar.textContent = msg
  statusBar.className = 'status-bar' + (isError ? ' error' : '')
}

browseBtn.addEventListener('click', async () => {
  const selected = await window.integrator.browse()
  if (selected) targetPathInput.value = selected
})

pushSearchInput.addEventListener('input', () => {
  const q = pushSearchInput.value.toLowerCase()
  ;[newFilesList, updatesList].forEach(list => {
    list.querySelectorAll('li').forEach(li => {
      const text = li.textContent.toLowerCase()
      li.classList.toggle('hidden-filter', q.length > 0 && !text.includes(q))
    })
  })
})

scanBtn.addEventListener('click', async () => {
  const targetPath = targetPathInput.value.trim()
  if (!targetPath) { setStatus('Enter a target path first.', true); return }

  setStatus('Scanning…')
  scanBtn.disabled = true

  const result = await window.integrator.scan(targetPath)
  scanBtn.disabled = false

  if (result.error) { setStatus(result.error, true); return }

  // New files
  makeCheckList(newFilesList, result.newFiles)
  newCount.textContent = result.newFiles.length
  newFilesSection.style.display = result.newFiles.length ? '' : 'none'

  // Updates (conflicts)
  makeCheckList(updatesList, result.conflictFiles)
  updateCount.textContent = result.conflictFiles.length
  updatesSection.style.display = result.conflictFiles.length ? '' : 'none'

  if (result.newFiles.length === 0 && result.conflictFiles.length === 0) {
    setStatus('Already up to date.')
    resultsSection.classList.add('hidden')
    return
  }

  resultsSection.classList.remove('hidden')
  summarySection.classList.add('hidden')
  pushSearchInput.value = ''
  setStatus(`Found ${result.newFiles.length} new, ${result.conflictFiles.length} update(s).`)
})

document.getElementById('pushCheckAllNewBtn').addEventListener('click', () => toggleVisible(newFilesList, true))
document.getElementById('pushUncheckAllNewBtn').addEventListener('click', () => toggleVisible(newFilesList, false))
document.getElementById('pushCheckAllUpdatesBtn').addEventListener('click', () => toggleVisible(updatesList, true))
document.getElementById('pushUncheckAllUpdatesBtn').addEventListener('click', () => toggleVisible(updatesList, false))

integrateBtn.addEventListener('click', async () => {
  const targetPath = targetPathInput.value.trim()
  const newSelected = [...newFilesList.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.dataset.file)
  const updateSelected = [...updatesList.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.dataset.file)
  const selectedFiles = [...newSelected, ...updateSelected]

  if (selectedFiles.length === 0) { setStatus('No files selected.', true); return }

  const confirmed = await showConfirm(buildConfirmHtml(newSelected, updateSelected, targetPath))
  if (!confirmed) return

  setStatus('Integrating…')
  integrateBtn.disabled = true

  const result = await window.integrator.run(targetPath, selectedFiles)
  integrateBtn.disabled = false

  if (result.error) { setStatus(result.error, true); return }

  resultsSection.classList.add('hidden')
  summarySection.classList.remove('hidden')
  summaryContent.innerHTML = `
    <p><strong>Copied:</strong> ${result.copied} file(s)</p>
    <p><strong>Skipped:</strong> ${result.skipped} file(s)</p>
    ${result.backup ? `<p><strong>Backup:</strong> ${result.backup}</p>` : '<p>No backup needed (target had no .claude folder).</p>'}
  `
  setStatus('Integration complete.')
})

resetBtn.addEventListener('click', () => {
  summarySection.classList.add('hidden')
  resultsSection.classList.add('hidden')
  targetPathInput.value = ''
  pushSearchInput.value = ''
  setStatus('')
})

// --- Pull tab ---
const sourcePathInput = document.getElementById('sourcePath')
const pullBrowseBtn = document.getElementById('pullBrowseBtn')
const pullScanBtn = document.getElementById('pullScanBtn')
const pullResultsSection = document.getElementById('pullResultsSection')
const pullAddsSection = document.getElementById('pullAddsSection')
const pullUpdatesSection = document.getElementById('pullUpdatesSection')
const pullAddCount = document.getElementById('pullAddCount')
const pullUpdateCount = document.getElementById('pullUpdateCount')
const pullAddsList = document.getElementById('pullAddsList')
const pullUpdatesList = document.getElementById('pullUpdatesList')
const pullApplyBtn = document.getElementById('pullApplyBtn')
const pullSummarySection = document.getElementById('pullSummarySection')
const pullSummaryContent = document.getElementById('pullSummaryContent')
const pullResetBtn = document.getElementById('pullResetBtn')

const pullSearchInput = document.getElementById('pullSearchInput')

pullSearchInput.addEventListener('input', () => {
  const q = pullSearchInput.value.toLowerCase()
  ;[pullAddsList, pullUpdatesList].forEach(list => {
    list.querySelectorAll('li').forEach(li => {
      const text = li.textContent.toLowerCase()
      li.classList.toggle('hidden-filter', q.length > 0 && !text.includes(q))
    })
  })
})

document.getElementById('pullCheckAllAddsBtn').addEventListener('click', () => toggleVisible(pullAddsList, true))
document.getElementById('pullUncheckAllAddsBtn').addEventListener('click', () => toggleVisible(pullAddsList, false))
document.getElementById('pullCheckAllUpdatesBtn').addEventListener('click', () => toggleVisible(pullUpdatesList, true))
document.getElementById('pullUncheckAllUpdatesBtn').addEventListener('click', () => toggleVisible(pullUpdatesList, false))

pullBrowseBtn.addEventListener('click', async () => {
  const selected = await window.integrator.browse()
  if (selected) sourcePathInput.value = selected
})

pullScanBtn.addEventListener('click', async () => {
  const sourcePath = sourcePathInput.value.trim()
  if (!sourcePath) { setStatus('Enter a source path first.', true); return }

  setStatus('Scanning…')
  pullScanBtn.disabled = true

  let result
  try {
    result = await window.integrator.pullScan(sourcePath)
  } catch (err) {
    pullScanBtn.disabled = false
    setStatus(err.message, true)
    return
  }
  pullScanBtn.disabled = false

  if (result.error) { setStatus(result.error, true); return }

  makeCheckList(pullAddsList, result.adds)
  pullAddCount.textContent = result.adds.length
  pullAddsSection.style.display = result.adds.length ? '' : 'none'

  makeCheckList(pullUpdatesList, result.updates)
  pullUpdateCount.textContent = result.updates.length
  pullUpdatesSection.style.display = result.updates.length ? '' : 'none'

  if (result.adds.length === 0 && result.updates.length === 0) {
    setStatus('Already up to date.')
    pullResultsSection.classList.add('hidden')
    return
  }

  pullResultsSection.classList.remove('hidden')
  pullSummarySection.classList.add('hidden')
  setStatus(`Found ${result.adds.length} new, ${result.updates.length} update(s).`)
})

pullApplyBtn.addEventListener('click', async () => {
  const sourcePath = sourcePathInput.value.trim()
  const addSelected = [...pullAddsList.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.dataset.file)
  const updateSelected = [...pullUpdatesList.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.dataset.file)
  const selectedFiles = [...addSelected, ...updateSelected]

  if (selectedFiles.length === 0) { setStatus('No files selected.', true); return }

  const confirmed = await showConfirm(buildPullConfirmHtml(addSelected, updateSelected, sourcePath))
  if (!confirmed) return

  setStatus('Pulling…')
  pullApplyBtn.disabled = true

  let result
  try {
    result = await window.integrator.pullRun(sourcePath, selectedFiles)
  } catch (err) {
    pullApplyBtn.disabled = false
    setStatus(err.message, true)
    return
  }
  pullApplyBtn.disabled = false

  if (result.error) { setStatus(result.error, true); return }

  pullResultsSection.classList.add('hidden')
  pullSummarySection.classList.remove('hidden')
  pullSummaryContent.innerHTML = `
    <p><strong>Added:</strong> ${result.added} file(s)</p>
    <p><strong>Updated:</strong> ${result.updated} file(s)</p>
    <p><strong>Backup:</strong> ${result.backup}</p>
  `
  setStatus('Pull complete.')
})

pullResetBtn.addEventListener('click', () => {
  pullSummarySection.classList.add('hidden')
  pullResultsSection.classList.add('hidden')
  sourcePathInput.value = ''
  pullSearchInput.value = ''
  setStatus('')
})
