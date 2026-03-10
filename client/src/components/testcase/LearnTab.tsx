import { useState, useRef, DragEvent } from 'react'
import { Upload, Loader2, ChevronDown, ChevronUp, ArrowLeft, Save, CheckCircle, AlertCircle, Info, Copy, Check } from 'lucide-react'
import { useAISettings } from '../../hooks/useAISettings'
import { AISettingsModal } from '../AISettingsModal'

interface ColumnAnalysis {
  name: string
  detectedWidth: string
  detectedStyle: string
  detectedRules: string
  reasoning: string
}

interface RulesAnalysis {
  columnFormat: string
  orderOfCase: string
  scope: string
  priorityMapping: string
  constraints: string
  businessRules: string
}

interface Analysis {
  columns: ColumnAnalysis[]
  rules: RulesAnalysis
  metadata: { rowCount: number; columnCount: number; sampleRows: string[][] }
}

type WizardStep = 'upload' | 'review' | 'save'

export function LearnTab() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [step, setStep] = useState<WizardStep>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [specText, setSpecText] = useState('')
  const [specSource, setSpecSource] = useState<'paste' | 'feature'>('paste')
  const [featureName, setFeatureName] = useState('')
  const [features, setFeaturesState] = useState<string[]>([])
  const [featuresLoaded, setFeaturesLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [expandedCol, setExpandedCol] = useState<number | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [ruleName, setRuleName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [savingSession, setSavingSession] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { settings, isConfigured, refreshSettings } = useAISettings()

  const loadFeatures = async () => {
    if (featuresLoaded) return
    try {
      const res = await fetch('/api/testcase')
      const data = await res.json()
      setFeaturesState(data.map((f: { name: string }) => f.name))
    } catch { /* ignore */ }
    setFeaturesLoaded(true)
  }

  const handleFileSelect = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are supported')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB')
      return
    }
    setFile(f)
    setError('')
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }

  const handleAnalyze = async () => {
    if (!file || !isConfigured) return
    setAnalyzing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (specSource === 'paste' && specText.trim()) {
        formData.append('spec', specText.trim())
      } else if (specSource === 'feature' && featureName) {
        formData.append('feature', featureName)
      }

      const res = await fetch('/api/testcase/learn/analyze', {
        method: 'POST',
        headers: {
          'X-AI-API-Key': settings.apiKey,
          'X-AI-Model': settings.model,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')

      setAnalysis(data)
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      setTemplateName(`learned-${today}`)
      setRuleName(`learned-${today}`)
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = async () => {
    if (!analysis || !templateName.trim() || !ruleName.trim()) return
    setSaving(true)
    setSaveError('')

    try {
      const columns = analysis.columns.map((col, i) => ({
        id: `col_${Date.now()}_${i}`,
        name: col.name,
        width: col.detectedWidth || '200px',
        style: col.detectedStyle || 'normal',
        columnRules: col.detectedRules,
      }))

      const rulesContent = buildRulesMarkdown(analysis.rules)

      const res = await fetch('/api/testcase/learn/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName, ruleName, columns, rulesContent }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      setSaved(true)
      setStep('save')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const updateColumnRules = (index: number, rules: string) => {
    if (!analysis) return
    const updated = { ...analysis }
    updated.columns = [...updated.columns]
    updated.columns[index] = { ...updated.columns[index], detectedRules: rules }
    setAnalysis(updated)
  }

  const updateRuleSection = (key: keyof RulesAnalysis, value: string) => {
    if (!analysis) return
    setAnalysis({ ...analysis, rules: { ...analysis.rules, [key]: value } })
  }

  const resetWizard = () => {
    setStep('upload')
    setFile(null)
    setSpecText('')
    setFeatureName('')
    setAnalysis(null)
    setError('')
    setSaved(false)
    setSaveError('')
    setExpandedCol(null)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Step indicator */}
        <div className="flex border-b border-gray-200 px-4 py-3 bg-gray-50">
          <StepIndicator label="1. Upload" active={step === 'upload'} done={step !== 'upload'} />
          <StepIndicator label="2. Review" active={step === 'review'} done={step === 'save'} />
          <StepIndicator label="3. Save" active={step === 'save'} done={saved} />
        </div>

        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Testcase CSV</h3>
                <div
                  onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-purple-400 bg-purple-50' :
                    file ? 'border-green-300 bg-green-50' :
                    'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                  {file ? (
                    <p className="text-sm text-green-700 font-medium">{file.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Drop CSV file here or click to browse</p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Spec (optional)</h3>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setSpecSource('paste')}
                    className={`px-3 py-1 text-xs rounded-full ${specSource === 'paste' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Paste text
                  </button>
                  <button
                    onClick={() => { setSpecSource('feature'); loadFeatures() }}
                    className={`px-3 py-1 text-xs rounded-full ${specSource === 'feature' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    From feature
                  </button>
                </div>
                {specSource === 'paste' ? (
                  <textarea
                    value={specText}
                    onChange={(e) => setSpecText(e.target.value)}
                    placeholder="Paste spec markdown here (optional — improves analysis quality)"
                    className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  />
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a feature...</option>
                      {features.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    {featureName && (
                      <button
                        disabled={savingSession}
                        onClick={async () => {
                          if (!file) {
                            navigator.clipboard.writeText(`/testcase learn ${featureName}`)
                            setCopiedCmd(true)
                            setTimeout(() => setCopiedCmd(false), 2000)
                            return
                          }
                          setSavingSession(true)
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            formData.append('feature', featureName)
                            if (specText.trim()) formData.append('spec', specText.trim())
                            const res = await fetch('/api/testcase/learn/session', {
                              method: 'POST',
                              body: formData,
                            })
                            if (!res.ok) {
                              const data = await res.json()
                              setError(data.error || 'Failed to save session')
                              return
                            }
                            navigator.clipboard.writeText(`/testcase learn ${featureName}`)
                            setCopiedCmd(true)
                            setTimeout(() => setCopiedCmd(false), 2000)
                          } catch {
                            setError('Failed to save learn session')
                          } finally {
                            setSavingSession(false)
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                          copiedCmd
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                        title={file ? `Save session + copy: /testcase learn ${featureName}` : `Copy: /testcase learn ${featureName}`}
                      >
                        {savingSession ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {savingSession ? 'Saving...' : copiedCmd ? 'Copied!' : file ? 'Save & Copy CLI' : 'Copy CLI'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* How it works - collapsible */}
              <div className="border border-gray-200 rounded-md">
                <button
                  onClick={() => setShowHowItWorks(!showHowItWorks)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Info className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">How does Analyze work?</span>
                  {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
                </button>
                {showHowItWorks && (
                  <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-600 space-y-2 bg-gray-50">
                    <p><span className="font-semibold text-gray-700">AI Provider:</span> Google Gemini API (same provider used for spec import).</p>
                    <p><span className="font-semibold text-gray-700">API Key:</span> Your Google AI Studio API key from AI Settings (stored in browser localStorage, never sent to our server for storage).</p>
                    <p><span className="font-semibold text-gray-700">Model:</span> <span className="font-mono bg-white px-1 py-0.5 rounded border">{settings.model || 'gemini-2.0-flash'}</span> (configurable in AI Settings).</p>
                    <p><span className="font-semibold text-gray-700">What happens:</span></p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>CSV file is uploaded to the Express server (<span className="font-mono">POST /api/testcase/learn/analyze</span>).</li>
                      <li>Server parses CSV headers + rows using <span className="font-mono">csv-parse</span> library.</li>
                      <li>If CSV has &gt;30 rows, server samples 30 representative rows (first 10 + middle 10 + last 10).</li>
                      <li>Server builds an analysis prompt with the CSV data + optional spec text.</li>
                      <li>Server calls <span className="font-semibold">Google Gemini API</span> with your API key (passed via request header, not stored on server).</li>
                      <li>Gemini returns structured JSON: per-column rules (formatting, style, constraints) + overall QA rules (ordering, coverage, priority).</li>
                      <li>Server returns the analysis to the browser for your review.</li>
                    </ol>
                    <p><span className="font-semibold text-gray-700">Cost:</span> Single API call per analysis. ~5K-20K input tokens depending on CSV size. Gemini Flash pricing applies.</p>
                    <p><span className="font-semibold text-gray-700">Privacy:</span> API key is sent per-request via HTTP header. CSV content is sent to Google Gemini for analysis. No data is stored on the server beyond the request lifecycle.</p>
                  </div>
                )}
              </div>

              {!isConfigured && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-amber-700">AI settings not configured.</span>
                  <button onClick={() => setIsSettingsOpen(true)} className="text-sm text-amber-700 underline">Configure</button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!file || !isConfigured || analyzing}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {analyzing ? 'Analyzing...' : 'Analyze Testcase'}
                </button>
                {isConfigured && (
                  <span className="text-xs text-gray-400">
                    via Gemini <span className="font-mono">{settings.model || 'gemini-2.0-flash'}</span>
                    {' '}<button onClick={() => setIsSettingsOpen(true)} className="text-purple-500 hover:underline">change</button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 'review' && analysis && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('upload')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <span className="text-xs text-gray-400">
                  {analysis.metadata.rowCount} rows, {analysis.metadata.columnCount} columns analyzed
                </span>
              </div>

              {/* Column Analysis */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Column Rules (editable)</h3>
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {analysis.columns.map((col, i) => (
                    <div key={i} className="p-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedCol(expandedCol === i ? null : i)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{col.name}</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{col.detectedStyle}</span>
                          <span className="text-xs text-gray-400">{col.detectedWidth}</span>
                        </div>
                        {expandedCol === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                      {expandedCol === i && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={col.detectedRules}
                            onChange={(e) => updateColumnRules(i, e.target.value)}
                            className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                          />
                          <p className="text-xs text-gray-400 italic">Reasoning: {col.reasoning}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules Analysis */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Rules (editable)</h3>
                <div className="space-y-4">
                  {([
                    ['orderOfCase', 'Order of Case'],
                    ['scope', 'Scope & Coverage'],
                    ['priorityMapping', 'Priority Mapping'],
                    ['columnFormat', 'Column Format'],
                    ['constraints', 'Constraints'],
                    ['businessRules', 'Business Rules'],
                  ] as [keyof RulesAnalysis, string][]).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <textarea
                        value={analysis.rules[key]}
                        onChange={(e) => updateRuleSection(key, e.target.value)}
                        className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Preview */}
              {analysis.metadata.sampleRows.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Sample Rows</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-md">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          {analysis.columns.map((col, i) => (
                            <th key={i} className="px-2 py-1.5 text-left font-medium text-gray-600 border-b">{col.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.metadata.sampleRows.map((row, ri) => (
                          <tr key={ri} className="border-b last:border-0">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-2 py-1.5 text-gray-700 max-w-[200px] truncate">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Name inputs + Save */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Template name</label>
                    <input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Rule name</label>
                    <input
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{saveError}</div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving || !templateName.trim() || !ruleName.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Template & Rules'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Saved */}
          {step === 'save' && saved && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Saved successfully</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Template <span className="font-mono text-purple-600">{templateName}</span> and
                  rule <span className="font-mono text-purple-600">{ruleName}</span> are now available in your global settings.
                </p>
              </div>
              <button
                onClick={resetWizard}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
              >
                Learn from another testcase
              </button>
            </div>
          )}
        </div>
      </div>

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => { setIsSettingsOpen(false); refreshSettings() }}
      />
    </>
  )
}

function buildRulesMarkdown(rules: RulesAnalysis): string {
  const sections: string[] = ['# Learned Rules\n', '_Auto-generated by analyzing existing testcases._\n']
  // columnFormat omitted — column-specific rules go only in template columnRules
  const map: [keyof RulesAnalysis, string][] = [
    ['orderOfCase', 'Order of Case'],
    ['scope', 'Scope'],
    ['priorityMapping', 'Priority Mapping'],
    ['constraints', 'Constraints'],
    ['businessRules', 'Business Rules'],
  ]
  for (const [key, label] of map) {
    if (rules[key]) sections.push(`## ${label}\n\n${rules[key]}\n`)
  }
  return sections.join('\n')
}

function StepIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full mr-2 ${
      active ? 'bg-purple-100 text-purple-700' :
      done ? 'bg-green-100 text-green-700' :
      'bg-gray-100 text-gray-400'
    }`}>
      {done && !active ? <CheckCircle className="w-3 h-3" /> : null}
      {label}
    </div>
  )
}
