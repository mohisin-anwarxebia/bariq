import { useState } from 'react'

export default function Vision() {
  const [result, setResult] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const analyzeBottle = async () => {
    setAnalyzing(true)
    const res = await fetch('/api/vision/analyze', { method: 'POST' })
    const data = await res.json()
    setResult(data)
    setAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vision Analysis</h2>
        <p className="text-sm text-slate-400">BARIQ Computer Vision — Bottle Recognition & Fill Detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Image & Analysis Trigger */}
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold mb-4">Bottle Analysis</h3>
          
          {/* Demo bottle placeholder */}
          <div className="bg-slate-700/50 rounded-lg h-64 flex items-center justify-center mb-4 border-2 border-dashed border-slate-600">
            <div className="text-center">
              <p className="text-4xl mb-2">🥃</p>
              <p className="text-sm text-slate-400">Don Julio 1942</p>
              <p className="text-xs text-slate-500">Demo Bottle Image</p>
            </div>
          </div>

          <button
            onClick={analyzeBottle}
            disabled={analyzing}
            className="w-full py-3 bg-bariq-purple rounded-lg font-medium hover:bg-bariq-purple/80 transition-colors disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : '👁️ Analyze Bottle'}
          </button>
        </div>

        {/* Right - Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Recognition */}
              <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Bottle Detected</h4>
                <p className="text-xl font-bold">{result.bottle.name}</p>
                <p className="text-sm text-slate-400">Confidence: {Math.round(result.bottle.confidence * 100)}%</p>
              </div>

              {/* Fill Level */}
              <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Fill Level</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-32 bg-slate-700 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-bariq-blue/60 rounded-b-lg transition-all"
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
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-400">Bottle:</span> {result.measurements.bottle_size_ml}ml</div>
                  <div><span className="text-slate-400">Remaining:</span> {result.measurements.estimated_remaining_ml}ml</div>
                  <div><span className="text-slate-400">Pour:</span> {result.measurements.standard_pour_ml}ml</div>
                  <div><span className="text-slate-400">Servings:</span> ≈{result.measurements.estimated_servings}</div>
                </div>
              </div>

              {/* Comparison */}
              <div className="bg-bariq-purple/5 border border-bariq-purple/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-bariq-purple">✨</span>
                  <h4 className="text-sm font-medium text-bariq-purple">BARIQ Reconciliation</h4>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center bg-slate-700/30 rounded-lg p-2">
                    <p className="text-lg font-bold">{result.comparison.vision_servings}</p>
                    <p className="text-xs text-slate-400">Vision</p>
                  </div>
                  <div className="text-center bg-slate-700/30 rounded-lg p-2">
                    <p className="text-lg font-bold">{result.comparison.inventory_servings}</p>
                    <p className="text-xs text-slate-400">Inventory</p>
                  </div>
                  <div className="text-center bg-slate-700/30 rounded-lg p-2">
                    <p className="text-lg font-bold">{result.comparison.pos_servings}</p>
                    <p className="text-xs text-slate-400">POS</p>
                  </div>
                </div>
                {result.comparison.variance_detected && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-sm text-yellow-300">⚠️ Potential variance detected</p>
                    <p className="text-xs text-slate-400 mt-1">{result.comparison.recommendation}</p>
                    <p className="text-xs text-slate-500 mt-1">Confidence: {Math.round(result.comparison.confidence * 100)}%</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 text-center text-slate-400">
              <p className="text-4xl mb-3">👁️</p>
              <p className="text-sm">Click "Analyze Bottle" to start vision analysis</p>
              <p className="text-xs text-slate-500 mt-1">Uses MockVisionProvider for demo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
