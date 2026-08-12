import { useState, useEffect } from 'react'

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
        <p className="text-sm text-slate-400">AI-powered operational actions with approval workflow</p>
      </div>

      {/* PO Success Banner */}
      {poResult && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-sm font-medium text-green-300">✅ Action completed successfully</p>
          <p className="text-xs text-slate-400 mt-1">
            Purchase Order <strong>{poResult.po_number}</strong> created — ${poResult.amount.toLocaleString()}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {data.recommendations.map((rec: any, i: number) => {
          const isApproved = approvedIds.has(rec.id) || rec.status === 'approved'
          return (
            <div key={rec.id} className="bg-navy-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-bariq-purple/20 text-bariq-purple px-2 py-0.5 rounded capitalize">{rec.category}</span>
                    <span className="text-xs text-slate-500">#{i + 1}</span>
                  </div>
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className="text-green-400">Impact: ${rec.impact_value.toLocaleString()}</span>
                    <span className="text-slate-500">Confidence: {Math.round(rec.confidence * 100)}%</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {isApproved ? (
                    <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-md">✓ Approved</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(rec.id)}
                        className="text-xs px-3 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-md hover:bg-green-500/30"
                      >
                        Approve
                      </button>
                      <button className="text-xs px-3 py-1.5 bg-slate-600/50 text-slate-300 border border-slate-500/30 rounded-md hover:bg-slate-600">
                        Modify
                      </button>
                      <button className="text-xs px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/30 rounded-md hover:bg-red-500/20">
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
