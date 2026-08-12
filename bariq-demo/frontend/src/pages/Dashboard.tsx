import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  const { summary, alerts, greeting, agent_message } = data

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold">{greeting}</h2>
        <p className="text-slate-400 text-sm mt-1">Urban Pour Operations — Regional Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard label="Revenue" value={`$${(summary.total_revenue).toLocaleString()}`} change={`+${summary.revenue_change}%`} positive onClick={() => navigate('/recommendations')} />
        <KPICard label="Beverage" value={`$${(summary.beverage_revenue).toLocaleString()}`} change={`+${summary.beverage_change}%`} positive onClick={() => navigate('/inventory')} />
        <KPICard label="Food" value={`$${(summary.food_revenue).toLocaleString()}`} change={`+${summary.food_change}%`} positive onClick={() => navigate('/experience')} />
        <KPICard label="Gross Margin" value={`${summary.gross_margin}%`} change={`${summary.margin_change}%`} positive={false} tooltip="Gross Margin" onClick={() => navigate('/recommendations')} />
        <KPICard label="Inv. Variance" value={`$${(summary.inventory_variance).toLocaleString()}`} change={`↑ ${summary.variance_change}%`} positive={false} tooltip="Unexplained Inventory Variance" onClick={() => navigate('/inventory')} />
        <KPICard label="Experience" value={`${summary.experience_score}/100`} change={`+${summary.experience_change}%`} positive tooltip="Health Score" onClick={() => navigate('/experience')} />
      </div>

      {/* BARIQ Intelligence Section */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-bariq-purple">✨</span>
          <h3 className="font-semibold">BARIQ Intelligence</h3>
          <span className="text-xs bg-bariq-purple/20 text-bariq-purple px-2 py-0.5 rounded">AI</span>
          <InfoTooltip term="Embedded Intelligence" definition="" />
        </div>
        <p className="text-sm text-slate-300 mb-4">{agent_message}</p>

        <div className="space-y-3">
          {alerts.map((alert: any, i: number) => (
            <div
              key={i}
              onClick={() => {
                if (alert.level === 'red') navigate('/inventory')
                else if (alert.message.includes('Saturday')) navigate('/forecast')
                else if (alert.message.includes('Chicken')) navigate('/inventory')
                else navigate('/forecast')
              }}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01] ${
                alert.level === 'red' ? 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/15' :
                alert.level === 'orange' ? 'bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15' :
                'bg-green-500/10 border border-green-500/20 hover:bg-green-500/15'
              }`}
            >
              <span className="text-lg">
                {alert.level === 'red' ? '🔴' : alert.level === 'orange' ? '🟠' : '🟢'}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{alert.detail}</p>
              </div>
              <span className="text-xs text-slate-500 hover:text-bariq-blue">Investigate →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5 cursor-pointer hover:border-slate-600 transition-colors" onClick={() => navigate('/recommendations')}>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Revenue Trend (7 Days)</h4>
          <div className="h-32 flex items-end gap-1">
            {[65, 58, 72, 68, 82, 94, 88].map((v, i) => (
              <div key={i} className="flex-1 bg-bariq-blue/60 rounded-t hover:bg-bariq-blue transition-colors" style={{ height: `${v}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button onClick={() => navigate('/inventory')} className="w-full text-left px-3 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/60 transition-colors text-sm flex items-center justify-between">
              <span>📦 View Inventory Variances</span>
              <span className="text-xs text-red-400">$2,140</span>
            </button>
            <button onClick={() => navigate('/vision')} className="w-full text-left px-3 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/60 transition-colors text-sm flex items-center justify-between">
              <span>👁️ Analyze a Bottle</span>
              <span className="text-xs text-slate-500">Vision</span>
            </button>
            <button onClick={() => navigate('/forecast')} className="w-full text-left px-3 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/60 transition-colors text-sm flex items-center justify-between">
              <span>📈 Saturday Forecast</span>
              <span className="text-xs text-bariq-blue">+24%</span>
            </button>
            <button onClick={() => navigate('/experience')} className="w-full text-left px-3 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/60 transition-colors text-sm flex items-center justify-between">
              <span>⭐ Customer Experience</span>
              <span className="text-xs text-yellow-400">71/100</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ label, value, change, positive, tooltip, onClick }: { label: string; value: string; change: string; positive: boolean; tooltip?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-navy-800 rounded-xl border border-slate-700 p-4 cursor-pointer hover:border-slate-600 hover:bg-navy-700 transition-all"
    >
      <div className="flex items-center gap-1">
        <p className="text-xs text-slate-400">{label}</p>
        {tooltip && <InfoTooltip term={tooltip} definition="" />}
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className={`text-xs mt-1 ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
    </div>
  )
}
