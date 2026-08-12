import { useState, useEffect } from 'react'

export default function Inventory() {
  const [data, setData] = useState<any>(null)
  const [variance, setVariance] = useState<any>(null)

  useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(setData)
    fetch('/api/inventory/variance').then(r => r.json()).then(setVariance)
  }, [])

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-sm text-slate-400">Real-time inventory with BARIQ variance detection</p>
        </div>
        {variance && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            <p className="text-xs text-red-300">Total Variance</p>
            <p className="text-lg font-bold text-red-400">${variance.total_variance_value.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* BARIQ Insight */}
      <div className="bg-bariq-purple/5 border border-bariq-purple/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-bariq-purple">✨</span>
          <span className="text-sm font-medium text-bariq-purple">BARIQ Inventory Insight</span>
        </div>
        <p className="text-sm text-slate-300">
          Don Julio 1942 shows unexplained inventory variance of 1.7 bottles (estimated $425). 
          Possible contributing factors: over-pouring during peak periods, POS mapping discrepancy.
        </p>
      </div>

      {/* Table */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-xs text-slate-400">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">On Hand</th>
              <th className="px-4 py-3 text-right">Expected</th>
              <th className="px-4 py-3 text-right">Variance</th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any) => (
              <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-4 py-3 text-sm font-medium">{item.product_name}</td>
                <td className="px-4 py-3 text-sm text-slate-400 capitalize">{item.subcategory}</td>
                <td className="px-4 py-3 text-sm text-right">{item.on_hand}</td>
                <td className="px-4 py-3 text-sm text-right">{item.expected}</td>
                <td className="px-4 py-3 text-sm text-right">{item.variance > 0 ? `-${item.variance}` : item.variance}</td>
                <td className="px-4 py-3 text-sm text-right">${item.variance_value}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    item.status === 'red' ? 'bg-red-500' :
                    item.status === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pour Analytics for spirits */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <h3 className="font-semibold mb-4">Pour Intelligence — Don Julio 1942</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-bariq-blue">487ml</p>
            <p className="text-xs text-slate-400">Estimated Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">30ml</p>
            <p className="text-xs text-slate-400">Standard Pour</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">16</p>
            <p className="text-xs text-slate-400">Servings Left</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">$86</p>
            <p className="text-xs text-slate-400">Revenue Impact</p>
          </div>
        </div>
      </div>
    </div>
  )
}
