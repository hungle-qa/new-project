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
