import { useState } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Vision() {
  const [result, setResult] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const analyzeImage = async (file?: File) => {
    setAnalyzing(true)
    setResult(null)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const formData = new FormData()
    if (file) {
      formData.append('image', file)
    }

    const res = await fetch('/api/vision/analyze', {
      method: 'POST',
      body: file ? formData : undefined
    })
    const data = await res.json()
    setResult(data)
    setAnalyzing(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
    }
  }

  const isMultiBottle = result?.bottles_detected > 1

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vision Analysis</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-slate-400">Upload one image — BARIQ detects and analyzes all bottles in the frame</p>
          <InfoTooltip term="Fill Level" definition="" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Upload */}
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold mb-2">Upload Image</h3>
          <p className="text-xs text-slate-400 mb-4">
            Upload a photo of a single bottle or an entire shelf — BARIQ automatically detects how many bottles are in the image and analyzes each one.
          </p>

          {/* File Upload Area */}
          <label className="block w-full cursor-pointer mb-4">
            <div className="bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-lg h-52 flex items-center justify-center border-2 border-dashed border-slate-600 hover:border-bariq-purple/50 transition-colors relative overflow-hidden">
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-3xl mb-2">📸</p>
                  <p className="text-sm text-slate-300 font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-5xl mb-2">📷</p>
                  <p className="text-sm text-slate-300">Click to upload a bottle image</p>
                  <p className="text-xs text-slate-500 mt-1">Single bottle or full shelf — AI detects all bottles</p>
                </div>
              )}
              {analyzing && (
                <div className="absolute inset-0 bg-bariq-purple/10 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-bariq-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-bariq-purple">Scanning for bottles...</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {/* Buttons */}
          <div className="space-y-2">
            {selectedFile && (
              <button
                onClick={() => analyzeImage(selectedFile)}
                disabled={analyzing}
                className="w-full py-3 bg-bariq-purple rounded-lg font-medium hover:bg-bariq-purple/80 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {analyzing ? '🔍 Scanning image...' : '👁️ Analyze Image'}
              </button>
            )}
            <button
              onClick={() => analyzeImage()}
              disabled={analyzing}
              className="w-full py-2.5 bg-slate-700 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
            >
              🥃 Demo: Single Bottle (Don Julio 1942)
            </button>
            <button
              onClick={() => {
                setSelectedFile(new File([""], "bar-shelf-lineup.jpg", { type: "image/jpeg" }))
                setTimeout(() => analyzeImage(new File([""], "bar-shelf-lineup.jpg", { type: "image/jpeg" })), 100)
              }}
              disabled={analyzing}
              className="w-full py-2.5 bg-slate-700 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
            >
              🍾 Demo: Multiple Bottles (Shelf Photo)
            </button>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
            <p className="text-xs font-medium text-slate-400 mb-1">How it works:</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Upload any photo containing bottles</li>
              <li>• AI detects number of bottles in the image</li>
              <li>• Each bottle: ID → fill level → servings → reconciliation</li>
              <li>• Works with 1 bottle or 10 bottles in one shot</li>
            </ul>
          </div>
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          {result && !isMultiBottle && <SingleBottleResult result={result} />}
          {result && isMultiBottle && <MultiBottleResult data={result} />}

          {!result && !analyzing && (
            <div className="bg-navy-800 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
              <p className="text-5xl mb-3">👁️</p>
              <p className="text-sm font-medium">Upload an image to start analysis</p>
              <p className="text-xs text-slate-500 mt-2">
                The vision system detects all bottles in the frame — whether it's a closeup of one bottle or a photo of your entire bar shelf.
              </p>
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg text-left">
                <p className="text-xs font-medium text-slate-400 mb-1">Recognizes 10 brands:</p>
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
      {/* Detection */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-bariq-blue/20 text-bariq-blue px-2 py-0.5 rounded">1 bottle detected</span>
          {result.filename && <span className="text-xs text-slate-500">📄 {result.filename}</span>}
        </div>
      </div>

      {/* Recognition */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-1 mb-3">
          <h4 className="text-sm font-medium text-slate-400">Bottle Identified</h4>
          <InfoTooltip term="Confidence Score" definition="" />
        </div>
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
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-bariq-blue to-bariq-blue/60 rounded-b-lg transition-all duration-1000" style={{ height: `${result.fill_level.percentage}%` }} />
          </div>
          <div>
            <p className="text-3xl font-bold">{result.fill_level.percentage}%</p>
            <p className="text-sm text-slate-400">remaining</p>
            <p className="text-xs text-slate-500 mt-1">{result.measurements.estimated_remaining_ml}ml of {result.measurements.bottle_size_ml}ml</p>
            <p className="text-xs text-bariq-blue mt-1">≈ {result.measurements.estimated_servings} servings @ {result.measurements.standard_pour_ml}ml pour</p>
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
          </div>
        )}
      </div>
    </>
  )
}

function MultiBottleResult({ data }: { data: any }) {
  const summary = data.detection_summary
  return (
    <>
      {/* Detection Summary */}
      <div className="bg-navy-800 rounded-xl border border-bariq-purple/30 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-bariq-purple">✨</span>
          <h4 className="font-semibold">BARIQ detected {data.bottles_detected} bottles in this image</h4>
        </div>
        {data.filename && <p className="text-xs text-slate-500 mb-3">📄 {data.filename}</p>}

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">{summary.bottles_ok}</p>
            <p className="text-xs text-slate-400">OK</p>
          </div>
          <div className="text-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-yellow-400">{summary.bottles_with_variance}</p>
            <p className="text-xs text-slate-400">Variance</p>
          </div>
          <div className="text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-red-400">${summary.total_variance_revenue_impact}</p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-xs text-slate-400">Impact</p>
              <InfoTooltip term="Revenue Impact" definition="" />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">{summary.recommendation}</p>
      </div>

      {/* Simulated Image Detection View */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-4">
        <p className="text-xs text-slate-400 mb-2">Detection Map</p>
        <div className="h-20 bg-slate-700/50 rounded-lg flex items-end gap-1 px-2 py-2 relative">
          {data.bottles.map((bottle: any, i: number) => (
            <div
              key={i}
              className={`flex-1 rounded-t-md flex items-center justify-center text-lg border-2 ${
                bottle.comparison.variance_detected
                  ? 'border-yellow-500/60 bg-yellow-500/10'
                  : 'border-green-500/60 bg-green-500/10'
              }`}
              style={{ height: `${bottle.fill_level.percentage}%` }}
              title={`${bottle.bottle.name} — ${bottle.fill_level.percentage}% fill`}
            >
              <span className="text-xs">🥃</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1 px-2">
          {data.bottles.map((bottle: any, i: number) => (
            <p key={i} className="flex-1 text-center text-[9px] text-slate-500 truncate">{bottle.bottle.name.split(' ')[0]}</p>
          ))}
        </div>
      </div>

      {/* Per-Bottle Detail */}
      <div className="space-y-2">
        {data.bottles.map((bottle: any, i: number) => (
          <div key={i} className={`bg-navy-800 rounded-xl border p-4 ${
            bottle.comparison.variance_detected ? 'border-yellow-500/30' : 'border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-14 bg-slate-700 rounded relative overflow-hidden border border-slate-600">
                  <div className="absolute bottom-0 w-full bg-bariq-blue/50" style={{ height: `${bottle.fill_level.percentage}%` }} />
                </div>
                <div>
                  <p className="text-sm font-medium">{bottle.bottle.name}</p>
                  <p className="text-xs text-slate-400">
                    {bottle.fill_level.percentage}% fill • {bottle.measurements.estimated_remaining_ml}ml • ≈{bottle.measurements.estimated_servings} servings
                  </p>
                </div>
              </div>
              <div className="text-right">
                {bottle.comparison.variance_detected ? (
                  <>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">⚠️ Variance</span>
                    <p className="text-xs text-red-400 mt-0.5">-${bottle.financials.variance_revenue_impact}</p>
                  </>
                ) : (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">✓ OK</span>
                )}
              </div>
            </div>
            {/* Mini reconciliation */}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span>Vision: {bottle.comparison.vision_servings}</span>
              <span>Inventory: {bottle.comparison.inventory_servings}</span>
              <span>POS: {bottle.comparison.pos_servings}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
