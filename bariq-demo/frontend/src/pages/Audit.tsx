import { useState, useEffect } from 'react'

export default function Audit() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/audit').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-sm text-slate-400">Complete decision history and BARIQ interaction log</p>
        </div>
        <button
          onClick={async () => {
            await fetch('/api/demo/reset', { method: 'POST' })
            window.location.reload()
          }}
          className="text-xs px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/30 rounded-md hover:bg-red-500/20"
        >
          Reset Demo
        </button>
      </div>

      <div className="bg-navy-800 rounded-xl border border-slate-700 overflow-hidden">
        {data.events.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-sm">No audit events yet. Interact with BARIQ to generate audit trail.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-400">
                <th className="px-4 py-3 text-left">Timestamp</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.events.map((event: any) => (
                <tr key={event.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-4 py-3 text-xs text-slate-400">{event.timestamp}</td>
                  <td className="px-4 py-3 text-sm">{event.user}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      event.action.includes('approved') ? 'bg-green-500/20 text-green-300' :
                      event.action.includes('query') ? 'bg-bariq-purple/20 text-bariq-purple' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      {event.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-md truncate">{event.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
