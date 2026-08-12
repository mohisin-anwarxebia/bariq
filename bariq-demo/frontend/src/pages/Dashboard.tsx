import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)

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
        <KPICard label="Revenue" value={`$${(summary.total_revenue).toLocaleString()}`} change={`+${summary.revenue_change}%`} positive />
        <KPICard label="Beverage" value={`$${(summary.beverage_revenue).toLocaleString()}`} change={`+${summary.beverage_change}%`} positive />
        <KPICard label="Food" value={`$${(summary.food_revenue).toLocaleString()}`} change={`+${summary.food_change}%`} positive />
        <KPICard label="Gross Margin" value={`${summary.gross_margin}%`} change={`${summary.margin_change}%`} positive={false} />
        <KPICard label="Inv. Variance" value={`$${(summary.inventory_variance).toLocaleString()}`} change={`↑ ${summary.variance_change}%`} positive={false} />
        <KPICard label="Experience" value={`${summary.experience_score}/100`} change={`+${summary.experience_change}%`} positive />
      </div>

      {/* BARIQ Intelligence Section */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-bariq-purple">✨</span>
          <h3 className="font-semibold">BARIQ Intelligence</h3>
          <span className="text-xs bg-bariq-purple/20 text-bariq-purple px-2 py-0.5 rounded">AI</span>
        </div>
        <p className="text-sm text-slate-300 mb-4">{agent_message}</p>

        <div className="space-y-3">
          {alerts.map((alert: any, i: number) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
              alert.level === 'red' ? 'bg-red-500/10 border border-red-500/20' :
              alert.level === 'orange' ? 'bg-orange-500/10 border border-orange-500/20' :
              'bg-green-500/10 border border-green-500/20'
            }`}>
              <span className="text-lg">
                {alert.level === 'red' ? '🔴' : alert.level === 'orange' ? '🟠' : '🟢'}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{alert.detail}</p>
              </div>
              <button className="text-xs text-bariq-blue hover:underline">Investigate</button>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Revenue Trend (7 Days)</h4>
          <div className="h-32 flex items-end gap-1">
            {[65, 58, 72, 68, 82, 94, 88].map((v, i) => (
              <div key={i} className="flex-1 bg-bariq-blue/60 rounded-t" style={{ height: `${v}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Beverage vs Food Split</h4>
          <div className="flex items-center gap-4 h-32">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Beverage</span>
                <span className="text-xs font-medium text-bariq-blue">56%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-bariq-blue rounded-full" style={{ width: '56%' }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Food</span>
                <span className="text-xs font-medium text-green-400">44%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '44%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="bg-navy-800 rounded-xl border border-slate-700 p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className={`text-xs mt-1 ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
    </div>
  )
}
