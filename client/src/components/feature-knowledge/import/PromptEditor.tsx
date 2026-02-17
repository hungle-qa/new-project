import { Save, Globe, RotateCcw } from 'lucide-react'

interface PromptEditorProps {
  customPrompt: string
  onPromptChange: (value: string) => void
  promptChanged: boolean
  effectiveDefault: string
  onSavePrompt: () => void
  onSaveAndSetDefault: () => void
  savingPrompt: boolean
  savingDefault: boolean
  promptSaved: boolean
  defaultSaved: boolean
}

export function PromptEditor({
  customPrompt,
  onPromptChange,
  promptChanged,
  effectiveDefault,
  onSavePrompt,
  onSaveAndSetDefault,
  savingPrompt,
  savingDefault,
  promptSaved,
  defaultSaved,
}: PromptEditorProps) {
  const handleReset = () => {
    onPromptChange(effectiveDefault)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="customPrompt" className="text-sm font-medium text-gray-700">
          Custom Prompt (optional)
        </label>
        <div className="flex items-center gap-2">
          {promptSaved && (
            <span className="text-xs text-green-600">Saved</span>
          )}
          {defaultSaved && (
            <span className="text-xs text-green-600">Default saved</span>
          )}
          <button
            onClick={handleReset}
            disabled={!promptChanged}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
          >
            <RotateCcw className="w-3 h-3" />
            Use Default
          </button>
          <button
            onClick={onSavePrompt}
            disabled={!promptChanged || savingPrompt}
            className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-default"
          >
            {savingPrompt ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save
          </button>
          <button
            onClick={onSaveAndSetDefault}
            disabled={!promptChanged || savingDefault}
            className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-40 disabled:cursor-default"
          >
            {savingDefault ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Globe className="w-3 h-3" />
            )}
            Save & Set Default
          </button>
        </div>
      </div>
      <textarea
        id="customPrompt"
        value={customPrompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <p className="text-xs text-gray-500 mt-1">
        Tells AI how to process the document. Edit above to customize.
      </p>
    </div>
  )
}
