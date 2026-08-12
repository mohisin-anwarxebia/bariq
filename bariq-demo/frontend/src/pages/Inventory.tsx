import { useState, useEffect } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Inventory() {
  const [data, setData] = useState<any>(null)
  const [variance, setVariance] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(d => {
      setData(d)
      // Auto-select Don Julio for demo
      const dj = d.items.find((i: any) => i.product_id === 'don-julio-1942' && i.location_id === 'downtown')
      if (dj) setSelectedProduct(dj)
    })
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
            <div className="flex items-center gap-1">
              <p className="text-xs text-red-300">Total Variance</p>
              <InfoTooltip term="Inventory Variance Value" definition="" />
            </div>
            <p className="text-lg font-bold text-red-400">${variance.total_variance_value.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* BARIQ Insight */}
      <div className="bg-bariq-purple/5 border border-bariq-purple/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-bariq-purple">✨</span>
          <span className="text-sm font-medium text-bariq-purple">BARIQ Inventory Insight</span>
          <InfoTooltip term="Unexplained Inventory Variance" definition="" />
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
              <th className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-1">Variance <InfoTooltip term="Unexplained Inventory Variance" definition="" /></span>
              </th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any) => (
              <tr
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                  selectedProduct?.id === item.id ? 'bg-bariq-purple/10' : 'hover:bg-slate-700/20'
                }`}
              >
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

      {/* Selected Product Detail */}
      {selectedProduct && selectedProduct.bottle_size_ml && (
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold">Pour Intelligence — {selectedProduct.product_name}</h3>
            <InfoTooltip term="Pour Variance" definition="" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold text-bariq-blue">{selectedProduct.remaining_ml}ml</p>
              <p className="text-xs text-slate-400">Remaining Volume</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold">{selectedProduct.standard_pour_ml}ml</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <p className="text-xs text-slate-400">Standard Pour</p>
                <InfoTooltip term="Standard Pour" definition="" />
              </div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{selectedProduct.servings_remaining}</p>
              <p className="text-xs text-slate-400">Servings Left</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold">{selectedProduct.expected_servings}</p>
              <p className="text-xs text-slate-400">Expected Servings</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold text-red-400">${selectedProduct.revenue_impact}</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <p className="text-xs text-slate-400">Revenue Impact</p>
                <InfoTooltip term="Revenue Impact" definition="" />
              </div>
            </div>
          </div>

          {/* Possible Causes */}
          {selectedProduct.status === 'red' && (
            <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
                Possible Causes
                <InfoTooltip term="Contributing Factors" definition="" />
              </p>
              <div className="flex flex-wrap gap-2">
                {["Over-pouring", "Breakage", "Receiving error", "Counting error", "POS mapping issue", "Operational variance"].map(cause => (
                  <span key={cause} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{cause}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
