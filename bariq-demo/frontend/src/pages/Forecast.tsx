import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Forecast() {
  const [data, setData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/forecast').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Demand Forecast</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-slate-400">BARIQ predictive intelligence — {data.day} {data.forecast_date}</p>
          <InfoTooltip term="Demand Forecast" definition="" />
        </div>
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
                {factor.type === 'weather' ? '🌡️' : factor.type === 'event' ? '🎵' : '📊'}
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
    </div>
  )
}
