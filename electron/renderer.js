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

// --- Push tab ---
const targetPathInput = document.getElementById('targetPath')
const browseBtn = document.getElementById('browseBtn')
const scanBtn = document.getElementById('scanBtn')
const resultsSection = document.getElementById('resultsSection')
const newFilesSection = document.getElementById('newFilesSection')
const conflictsSection = document.getElementById('conflictsSection')
const newCount = document.getElementById('newCount')
const conflictCount = document.getElementById('conflictCount')
const newFilesList = document.getElementById('newFilesList')
const conflictsList = document.getElementById('conflictsList')
const checkAllBtn = document.getElementById('checkAllBtn')
const uncheckAllBtn = document.getElementById('uncheckAllBtn')
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

scanBtn.addEventListener('click', async () => {
  const targetPath = targetPathInput.value.trim()
  if (!targetPath) { setStatus('Enter a target path first.', true); return }

  setStatus('Scanning…')
  scanBtn.disabled = true

  const result = await window.integrator.scan(targetPath)
  scanBtn.disabled = false

  if (result.error) { setStatus(result.error, true); return }

  // New files
  newFilesList.innerHTML = ''
  result.newFiles.forEach(f => {
    const li = document.createElement('li')
    li.textContent = f
    newFilesList.appendChild(li)
  })
  newCount.textContent = result.newFiles.length
  newFilesSection.style.display = result.newFiles.length ? '' : 'none'

  // Conflicts
  conflictsList.innerHTML = ''
  result.conflictFiles.forEach(f => {
    const li = document.createElement('li')
    const label = document.createElement('label')
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = true
    cb.dataset.file = f
    label.appendChild(cb)
    label.append(' ' + f)
    li.appendChild(label)
    conflictsList.appendChild(li)
  })
  conflictCount.textContent = result.conflictFiles.length
  conflictsSection.style.display = result.conflictFiles.length ? '' : 'none'

  resultsSection.classList.remove('hidden')
  summarySection.classList.add('hidden')
  setStatus(`Found ${result.newFiles.length} new, ${result.conflictFiles.length} conflict(s).`)
})

checkAllBtn.addEventListener('click', () => {
  conflictsList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true)
})

uncheckAllBtn.addEventListener('click', () => {
  conflictsList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false)
})

integrateBtn.addEventListener('click', async () => {
  const targetPath = targetPathInput.value.trim()
  const overwriteList = [...conflictsList.querySelectorAll('input[type=checkbox]:checked')]
    .map(cb => cb.dataset.file)

  setStatus('Integrating…')
  integrateBtn.disabled = true

  const result = await window.integrator.run(targetPath, overwriteList)
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

document.getElementById('pullCheckAllAddsBtn').addEventListener('click', () => {
  pullAddsList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true)
})
document.getElementById('pullUncheckAllAddsBtn').addEventListener('click', () => {
  pullAddsList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false)
})
document.getElementById('pullCheckAllUpdatesBtn').addEventListener('click', () => {
  pullUpdatesList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true)
})
document.getElementById('pullUncheckAllUpdatesBtn').addEventListener('click', () => {
  pullUpdatesList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false)
})

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
  const selectedFiles = [
    ...pullAddsList.querySelectorAll('input[type=checkbox]:checked'),
    ...pullUpdatesList.querySelectorAll('input[type=checkbox]:checked'),
  ].map(cb => cb.dataset.file)

  if (selectedFiles.length === 0) { setStatus('No files selected.', true); return }

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
