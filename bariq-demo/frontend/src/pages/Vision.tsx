import { useState } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Vision() {
  const [singleResult, setSingleResult] = useState<any>(null)
  const [batchResults, setBatchResults] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [mode, setMode] = useState<'single' | 'batch'>('single')
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const analyzeDemoBottle = async () => {
    setAnalyzing(true)
    setBatchResults(null)
    await new Promise(resolve => setTimeout(resolve, 1200))
    const res = await fetch('/api/vision/analyze', { method: 'POST' })
    const data = await res.json()
    setSingleResult(data)
    setAnalyzing(false)
  }

  const analyzeUploadedFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return
    setAnalyzing(true)
    setSingleResult(null)
    setBatchResults(null)

    await new Promise(resolve => setTimeout(resolve, 800 + selectedFiles.length * 400))

    const formData = new FormData()
    if (selectedFiles.length === 1) {
      formData.append('image', selectedFiles[0])
      const res = await fetch('/api/vision/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      setSingleResult(data)
    } else {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i])
      }
      const res = await fetch('/api/vision/analyze-batch', { method: 'POST', body: formData })
      const data = await res.json()
      setBatchResults(data)
    }

    setAnalyzing(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
    setSingleResult(null)
    setBatchResults(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vision Analysis</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-slate-400">BARIQ Computer Vision — Bottle Recognition & Fill Detection</p>
          <InfoTooltip term="Fill Level" definition="" />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setMode('single'); setBatchResults(null) }}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors ${mode === 'single' ? 'bg-bariq-purple text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Single Bottle
        </button>
        <button
          onClick={() => { setMode('batch'); setSingleResult(null) }}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors ${mode === 'batch' ? 'bg-bariq-purple text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Multiple Bottles
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Upload & Trigger */}
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold mb-4">{mode === 'single' ? 'Single Bottle Analysis' : 'Batch Bottle Analysis'}</h3>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block w-full cursor-pointer">
              <div className="bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-slate-600 hover:border-bariq-purple/50 transition-colors relative overflow-hidden">
                {selectedFiles && selectedFiles.length > 0 ? (
                  <div className="text-center">
                    <p className="text-3xl mb-2">📸</p>
                    <p className="text-sm text-slate-300 font-medium">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                    </p>
                    <div className="mt-2 max-h-16 overflow-auto">
                      {Array.from(selectedFiles).map((f, i) => (
                        <p key={i} className="text-xs text-slate-400">{f.name}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl mb-2">{mode === 'single' ? '🥃' : '🍾🥃🍸'}</p>
                    <p className="text-sm text-slate-300">
                      {mode === 'single' ? 'Click to upload bottle image' : 'Click to upload multiple bottle images'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, or any image file</p>
                  </div>
                )}
                {analyzing && (
                  <div className="absolute inset-0 bg-bariq-purple/10 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 border-2 border-bariq-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-bariq-purple">Analyzing{mode === 'batch' ? ` ${selectedFiles?.length || 0} bottles` : ''}...</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple={mode === 'batch'}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {selectedFiles && selectedFiles.length > 0 && (
              <button
                onClick={analyzeUploadedFiles}
                disabled={analyzing}
                className="w-full py-3 bg-bariq-purple rounded-lg font-medium hover:bg-bariq-purple/80 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {analyzing ? '🔍 Analyzing...' : `👁️ Analyze ${selectedFiles.length} Bottle${selectedFiles.length > 1 ? 's' : ''}`}
              </button>
            )}
            <button
              onClick={analyzeDemoBottle}
              disabled={analyzing}
              className="w-full py-3 bg-slate-700 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
            >
              {analyzing && !selectedFiles ? '🔍 Analyzing...' : '🥃 Use Demo Bottle (Don Julio 1942)'}
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-3">
            💡 Tip: Name files with bottle names for best recognition (e.g., "grey-goose.jpg", "patron-silver.png")
          </p>
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          {/* Single Result */}
          {singleResult && <SingleBottleResult result={singleResult} />}

          {/* Batch Results */}
          {batchResults && <BatchBottleResults data={batchResults} />}

          {/* Empty State */}
          {!singleResult && !batchResults && !analyzing && (
            <div className="bg-navy-800 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
              <p className="text-5xl mb-3">👁️</p>
              <p className="text-sm font-medium">Upload images or use demo bottle to start</p>
              <p className="text-xs text-slate-500 mt-2">
                BARIQ identifies bottles, measures fill level, and compares against inventory and POS records
              </p>
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg text-left">
                <p className="text-xs font-medium text-slate-400 mb-1">Recognized bottles:</p>
                <p className="text-xs text-slate-500">
                  Don Julio 1942 • Patron Silver • Tito's Vodka • Grey Goose • Jameson • Woodford Reserve • Hendrick's Gin • Jack Daniel's • Tanqueray • Bacardi
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SingleBottleResult({ result }: { result: any }) {
  return (
    <>
      {/* Recognition */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-1 mb-3">
          <h4 className="text-sm font-medium text-slate-400">Bottle Detected</h4>
          <InfoTooltip term="Confidence Score" definition="" />
        </div>
        {result.filename && <p className="text-xs text-slate-500 mb-2">📄 {result.filename}</p>}
        <p className="text-xl font-bold">{result.bottle.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${result.bottle.confidence * 100}%` }} />
          </div>
          <p className="text-sm text-green-400">{Math.round(result.bottle.confidence * 100)}%</p>
        </div>
      </div>

      {/* Fill Level */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-1 mb-3">
          <h4 className="text-sm font-medium text-slate-400">Fill Level</h4>
          <InfoTooltip term="Fill Level" definition="" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-32 bg-slate-700 rounded-lg relative overflow-hidden border border-slate-600">
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-bariq-blue to-bariq-blue/60 rounded-b-lg transition-all duration-1000"
              style={{ height: `${result.fill_level.percentage}%` }}
            />
          </div>
          <div>
            <p className="text-3xl font-bold">{result.fill_level.percentage}%</p>
            <p className="text-sm text-slate-400">remaining</p>
            <p className="text-xs text-slate-500 mt-1">Confidence: {Math.round(result.fill_level.confidence * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Measurements</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-lg font-bold">{result.measurements.bottle_size_ml}ml</p>
            <p className="text-xs text-slate-400">Bottle Size</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-lg font-bold">{result.measurements.estimated_remaining_ml}ml</p>
            <p className="text-xs text-slate-400">Remaining</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-lg font-bold">{result.measurements.standard_pour_ml}ml</p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-slate-400">Standard Pour</p>
              <InfoTooltip term="Standard Pour" definition="" />
            </div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-lg font-bold text-bariq-blue">≈{result.measurements.estimated_servings}</p>
            <p className="text-xs text-slate-400">Servings Left</p>
          </div>
        </div>
      </div>

      {/* Three-Way Reconciliation */}
      <div className="bg-bariq-purple/5 border border-bariq-purple/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-bariq-purple">✨</span>
          <h4 className="text-sm font-medium text-bariq-purple">BARIQ Reconciliation</h4>
          <InfoTooltip term="Three-Way Reconciliation" definition="" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <p className="text-2xl font-bold">{result.comparison.vision_servings}</p>
            <p className="text-xs text-slate-400">👁️ Vision</p>
          </div>
          <div className="text-center bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <p className="text-2xl font-bold">{result.comparison.inventory_servings}</p>
            <p className="text-xs text-slate-400">📦 Inventory</p>
          </div>
          <div className="text-center bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <p className="text-2xl font-bold">{result.comparison.pos_servings}</p>
            <p className="text-xs text-slate-400">🧾 POS</p>
          </div>
        </div>
        {result.comparison.variance_detected ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-300 font-medium">⚠️ Potential variance detected</p>
            <p className="text-xs text-slate-400 mt-1">{result.comparison.recommendation}</p>
            <p className="text-xs text-slate-500 mt-1">Confidence: {Math.round(result.comparison.confidence * 100)}%</p>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-300 font-medium">✅ No significant variance</p>
            <p className="text-xs text-slate-400 mt-1">Bottle is within expected parameters.</p>
          </div>
        )}
      </div>
    </>
  )
}

function BatchBottleResults({ data }: { data: any }) {
  return (
    <>
      {/* Summary */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <h4 className="font-semibold mb-3">Batch Analysis — {data.total_bottles_analyzed} Bottles</h4>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">{data.summary.bottles_ok}</p>
            <p className="text-xs text-slate-400">OK</p>
          </div>
          <div className="text-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-yellow-400">{data.summary.bottles_with_variance}</p>
            <p className="text-xs text-slate-400">Variance</p>
          </div>
          <div className="text-center bg-slate-700/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-red-400">${data.total_variance_revenue_impact}</p>
            <p className="text-xs text-slate-400">Impact</p>
          </div>
        </div>
        <p className="text-xs text-slate-400">{data.summary.recommendation}</p>
      </div>

      {/* Individual Results */}
      <div className="space-y-2">
        {data.results.map((result: any, i: number) => (
          <div key={i} className={`bg-navy-800 rounded-xl border p-4 ${
            result.comparison.variance_detected ? 'border-yellow-500/30' : 'border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-lg">
                  🥃
                </div>
                <div>
                  <p className="text-sm font-medium">{result.bottle.name}</p>
                  <p className="text-xs text-slate-400">{result.filename}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{result.fill_level.percentage}%</span>
                  <span className="text-xs text-slate-400">fill</span>
                </div>
                <p className="text-xs text-slate-500">≈{result.measurements.estimated_servings} servings</p>
              </div>
              <div className="text-right ml-4">
                {result.comparison.variance_detected ? (
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">⚠️ Variance</span>
                ) : (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">✓ OK</span>
                )}
                {result.financials.variance_revenue_impact > 0 && (
                  <p className="text-xs text-red-400 mt-0.5">-${result.financials.variance_revenue_impact}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
