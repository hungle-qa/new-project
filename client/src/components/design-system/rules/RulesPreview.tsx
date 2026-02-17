interface RulesPreviewProps {
  fontFamily: string
  getRuleValue: (token: string) => string
}

export function RulesPreview({ fontFamily, getRuleValue }: RulesPreviewProps) {
  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: getRuleValue('--color-bg-white') || '#FFFFFF',
          fontFamily: fontFamily
        }}
      >
        <p
          className="text-lg mb-4"
          style={{ color: getRuleValue('--color-text-primary') || '#141414' }}
        >
          Sample Text (Primary Color)
        </p>
        <p
          className="text-sm mb-6"
          style={{ color: getRuleValue('--color-text-primary') || '#141414' }}
        >
          This is how your primary text will appear with the current font family and color settings.
        </p>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: getRuleValue('--color-btn-action') || '#184EFF',
              color: getRuleValue('--color-text-white') || '#FFFFFF'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getRuleValue('--color-btn-action-hover') || '#1241CC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = getRuleValue('--color-btn-action') || '#184EFF'}
          >
            Action Button
          </button>
          <button
            className="px-4 py-2 rounded-md font-medium border border-gray-200 transition-colors"
            style={{
              backgroundColor: '#FFFFFF',
              color: getRuleValue('--color-text-primary') || '#141414'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getRuleValue('--color-btn-cancel-hover') || '#F5F7F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Cancel Button
          </button>
        </div>
      </div>
    </div>
  )
}
