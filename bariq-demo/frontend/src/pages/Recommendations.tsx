import { useState, useEffect } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Recommendations() {
  const [data, setData] = useState<any>(null)
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())
  const [poResult, setPOResult] = useState<any>(null)

  useEffect(() => {
    fetch('/api/recommendations').then(r => r.json()).then(setData)
  }, [])

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/recommendations/${id}/approve`, { method: 'POST' })
    const result = await res.json()
    setApprovedIds(prev => new Set([...prev, id]))
    if (result.purchase_order) {
      setPOResult(result.purchase_order)
    }
  }

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">BARIQ Recommendations</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-slate-400">AI-powered operational actions with approval workflow</p>
          <InfoTooltip term="Action Workflow" definition="" />
        </div>
      </div>

      {/* PO Success Banner */}
      {poResult && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-[fadeIn_0.3s_ease-in]">
          <p className="text-sm font-medium text-green-300">✅ Action completed successfully</p>
          <p className="text-xs text-slate-400 mt-1">
            Purchase Order <strong className="text-green-300">{poResult.po_number}</strong> created — ${poResult.amount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">Logged in audit trail for compliance.</p>
        </div>
      )}

      <div className="space-y-4">
        {data.recommendations.map((rec: any, i: number) => {
          const isApproved = approvedIds.has(rec.id) || rec.status === 'approved'
          return (
            <div key={rec.id} className={`bg-navy-800 rounded-xl border p-5 transition-all ${
              isApproved ? 'border-green-500/20' : 'border-slate-700'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-bariq-purple/20 text-bariq-purple px-2 py-0.5 rounded capitalize">{rec.category}</span>
                    <span className="text-xs text-slate-500">#{i + 1}</span>
                    {isApproved && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Approved</span>}
                  </div>
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-green-400">Impact: ${rec.impact_value.toLocaleString()}</span>
                      <InfoTooltip term="Revenue Impact" definition="" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">Confidence: {Math.round(rec.confidence * 100)}%</span>
                      <InfoTooltip term="Confidence Score" definition="" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {isApproved ? (
                    <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-md">✓ Done</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(rec.id)}
                        className="text-xs px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-md hover:bg-green-500/30 active:scale-95 transition-all font-medium"
                      >
                        Approve
                      </button>
                      <button className="text-xs px-3 py-2 bg-slate-600/50 text-slate-300 border border-slate-500/30 rounded-md hover:bg-slate-600 transition-colors">
                        Modify
                      </button>
                      <button className="text-xs px-3 py-2 bg-red-500/10 text-red-300 border border-red-500/30 rounded-md hover:bg-red-500/20 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
