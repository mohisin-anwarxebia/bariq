import { useState } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Vision() {
  const [result, setResult] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const analyzeBottle = async () => {
    setAnalyzing(true)
    // Simulate brief analysis time for demo effect
    await new Promise(resolve => setTimeout(resolve, 1200))
    const res = await fetch('/api/vision/analyze', { method: 'POST' })
    const data = await res.json()
    setResult(data)
    setAnalyzing(false)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Image & Analysis Trigger */}
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold mb-4">Bottle Analysis</h3>
          
          {/* Demo bottle placeholder */}
          <div className="bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-lg h-64 flex items-center justify-center mb-4 border-2 border-dashed border-slate-600 relative overflow-hidden">
            <div className="text-center">
              <p className="text-6xl mb-2">🥃</p>
              <p className="text-sm text-slate-300 font-medium">Don Julio 1942</p>
              <p className="text-xs text-slate-500 mt-1">750ml Tequila Añejo</p>
            </div>
            {analyzing && (
              <div className="absolute inset-0 bg-bariq-purple/10 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-bariq-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-bariq-purple">Analyzing...</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={analyzeBottle}
            disabled={analyzing}
            className="w-full py-3 bg-bariq-purple rounded-lg font-medium hover:bg-bariq-purple/80 transition-colors disabled:opacity-50 active:scale-[0.98]"
          >
            {analyzing ? '🔍 Analyzing...' : '👁️ Analyze Bottle'}
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">Uses MockVisionProvider — no camera required for demo</p>
        </div>

        {/* Right - Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Recognition */}
              <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
                <div className="flex items-center gap-1 mb-3">
                  <h4 className="text-sm font-medium text-slate-400">Bottle Detected</h4>
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
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-bold">{result.measurements.standard_pour_ml}ml</p>
                    </div>
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

              {/* Three-Way Comparison */}
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
                {result.comparison.variance_detected && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-sm text-yellow-300 font-medium">⚠️ Potential variance detected</p>
                    <p className="text-xs text-slate-400 mt-1">{result.comparison.recommendation}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-slate-500">Confidence: {Math.round(result.comparison.confidence * 100)}%</p>
                      <InfoTooltip term="Confidence Score" definition="" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-navy-800 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
              <p className="text-5xl mb-3">👁️</p>
              <p className="text-sm font-medium">Click "Analyze Bottle" to start</p>
              <p className="text-xs text-slate-500 mt-2">BARIQ will identify the bottle, measure fill level, and compare against inventory and POS records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
