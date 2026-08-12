import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Forecast() {
  const [data, setData] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>('demo_default')
  const navigate = useNavigate()

  const loadForecast = () => {
    fetch('/api/forecast').then(r => r.json()).then(setData)
    fetch('/api/data/forecast/status').then(r => r.json()).then(s => setDataSource(s.source))
  }

  useEffect(() => { loadForecast() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/data/forecast/upload', { method: 'POST', body: formData })
      const result = await res.json()
      if (result.status === 'success') {
        setUploadMessage(`✅ ${result.message}`)
        loadForecast()
      } else {
        setUploadMessage(`❌ ${result.error}`)
      }
    } catch {
      setUploadMessage('❌ Upload failed. Check that the backend is running.')
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleClearLiveData = async () => {
    await fetch('/api/data/forecast', { method: 'DELETE' })
    setUploadMessage('Reverted to demo defaults.')
    loadForecast()
  }

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Demand Forecast</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-400">BARIQ predictive intelligence — {data.day} {data.forecast_date}</p>
            <InfoTooltip term="Demand Forecast" definition="" />
          </div>
        </div>

        {/* Upload / Data Source Controls */}
        <div className="flex items-center gap-3">
          {dataSource === 'live_upload' && (
            <button
              onClick={handleClearLiveData}
              className="text-xs px-3 py-1.5 bg-slate-600/50 text-slate-300 border border-slate-500/30 rounded-md hover:bg-slate-600 transition-colors"
            >
              Revert to Demo
            </button>
          )}
          <label className="cursor-pointer text-xs px-4 py-2 bg-bariq-blue/20 text-bariq-blue border border-bariq-blue/30 rounded-lg hover:bg-bariq-blue/30 transition-colors font-medium">
            {uploading ? 'Uploading...' : '📊 Upload Excel'}
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Data Source Badge */}
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded ${
          dataSource === 'live_upload' ? 'bg-green-500/20 text-green-300' : 'bg-slate-600 text-slate-300'
        }`}>
          {dataSource === 'live_upload' ? '🟢 Live Data' : '⚪ Demo Data'}
        </span>
        {uploadMessage && (
          <span className="text-xs text-slate-400">{uploadMessage}</span>
        )}
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.forecasts.map((f: any) => (
          <div key={f.category} className="bg-navy-800 rounded-xl border border-slate-700 p-4 text-center hover:border-bariq-blue/30 transition-colors cursor-default">
            <p className="text-2xl font-bold text-bariq-blue">+{f.change_pct}%</p>
            <p className="text-xs text-slate-400 mt-1">{f.category}</p>
          </div>
        ))}
      </div>

      {/* Factors */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold">Contributing Factors</h3>
          <InfoTooltip term="Contributing Factors" definition="" />
        </div>
        <div className="space-y-3">
          {data.factors.map((factor: any, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              <span className="text-lg">
                {factor.type === 'weather' ? '🌡️' : factor.type === 'event' ? '🎵' : factor.type === 'uploaded' ? '📊' : '📈'}
              </span>
              <div>
                <p className="text-sm font-medium">{factor.description}</p>
                {factor.distance && <p className="text-xs text-slate-400">{factor.distance}</p>}
                <p className="text-xs text-bariq-blue mt-1">{factor.impact}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-3">
          <p className="text-xs text-slate-500">Forecast confidence: {Math.round(data.confidence * 100)}%</p>
          <InfoTooltip term="Confidence Score" definition="" />
        </div>
      </div>

      {/* Inventory Risks */}
      {data.inventory_risks && data.inventory_risks.length > 0 && (
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
          <h3 className="font-semibold mb-4">Inventory Risks Based on Forecast</h3>
          <div className="space-y-3">
            {data.inventory_risks.map((risk: any, i: number) => (
              <div
                key={i}
                onClick={() => navigate('/recommendations')}
                className="flex items-center justify-between p-3 border border-orange-500/20 bg-orange-500/5 rounded-lg cursor-pointer hover:bg-orange-500/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{risk.product}</p>
                  <p className="text-xs text-slate-400">Current: {risk.current_stock} → Forecast demand: {risk.forecast_demand}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-orange-300">{risk.risk}</p>
                  <p className="text-xs text-bariq-blue mt-0.5">{risk.recommendation} →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Info */}
      <div className="bg-slate-700/20 border border-slate-700 rounded-xl p-4">
        <p className="text-xs text-slate-500 mb-1">💡 Programmatic API:</p>
        <p className="text-xs text-slate-400 font-mono">POST /api/data/forecast/upload — Excel file (.xlsx)</p>
        <p className="text-xs text-slate-400 font-mono">POST /api/data/forecast/json — JSON payload</p>
        <p className="text-xs text-slate-400 font-mono">GET  /api/data/forecast/template — Format guide</p>
        <p className="text-xs text-slate-400 font-mono">DELETE /api/data/forecast — Revert to demo</p>
      </div>
    </div>
  )
}
