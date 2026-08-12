import { useState, useEffect } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Inventory() {
  const [data, setData] = useState<any>(null)
  const [variance, setVariance] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(d => {
      setData(d)
      const dj = d.items.find((i: any) => i.product_id === 'don-julio-1942' && i.location_id === 'downtown')
      if (dj) setSelectedProduct(dj)
    })
    fetch('/api/inventory/variance').then(r => r.json()).then(setVariance)
  }, [])

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  // Group items by category
  const categories = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'spirits', label: 'Spirits', icon: '🥃' },
    { key: 'beer', label: 'Beer', icon: '🍺' },
    { key: 'wine', label: 'Wine', icon: '🍷' },
    { key: 'cocktail', label: 'Cocktails', icon: '🍸' },
    { key: 'food', label: 'Food', icon: '🍗' },
  ]

  const spiritSubcats = ['tequila', 'vodka', 'whiskey', 'gin', 'rum']

  const filteredItems = data.items.filter((item: any) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'spirits') return item.category === 'beverage' && spiritSubcats.includes(item.subcategory)
    if (activeCategory === 'beer') return item.subcategory === 'beer'
    if (activeCategory === 'wine') return item.subcategory === 'wine'
    if (activeCategory === 'cocktail') return item.category === 'cocktail'
    if (activeCategory === 'food') return item.category === 'food'
    return true
  })

  // Category stats
  const getCategoryStats = (key: string) => {
    const items = data.items.filter((item: any) => {
      if (key === 'all') return true
      if (key === 'spirits') return item.category === 'beverage' && spiritSubcats.includes(item.subcategory)
      if (key === 'beer') return item.subcategory === 'beer'
      if (key === 'wine') return item.subcategory === 'wine'
      if (key === 'cocktail') return item.category === 'cocktail'
      if (key === 'food') return item.category === 'food'
      return true
    })
    const totalVariance = items.reduce((sum: number, i: any) => sum + i.variance_value, 0)
    const redCount = items.filter((i: any) => i.status === 'red').length
    const yellowCount = items.filter((i: any) => i.status === 'yellow').length
    return { count: items.length, variance: totalVariance, red: redCount, yellow: yellowCount }
  }

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

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const stats = getCategoryStats(cat.key)
          const isActive = activeCategory === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-bariq-purple/20 border border-bariq-purple/40 text-white'
                  : 'bg-slate-700/30 border border-slate-700 text-slate-400 hover:bg-slate-700/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-medium">{cat.label}</span>
              <span className="text-xs opacity-60">({stats.count})</span>
              {stats.red > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
              {stats.red === 0 && stats.yellow > 0 && (
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Category Summary */}
      {activeCategory !== 'all' && (
        <div className="grid grid-cols-4 gap-3">
          {(() => {
            const stats = getCategoryStats(activeCategory)
            const cat = categories.find(c => c.key === activeCategory)
            return (
              <>
                <div className="bg-navy-800 rounded-lg border border-slate-700 p-3 text-center">
                  <p className="text-lg font-bold">{stats.count}</p>
                  <p className="text-xs text-slate-400">Items</p>
                </div>
                <div className="bg-navy-800 rounded-lg border border-slate-700 p-3 text-center">
                  <p className="text-lg font-bold text-red-400">${stats.variance.toFixed(0)}</p>
                  <p className="text-xs text-slate-400">Variance</p>
                </div>
                <div className="bg-navy-800 rounded-lg border border-slate-700 p-3 text-center">
                  <p className="text-lg font-bold text-red-400">{stats.red}</p>
                  <p className="text-xs text-slate-400">Critical</p>
                </div>
                <div className="bg-navy-800 rounded-lg border border-slate-700 p-3 text-center">
                  <p className="text-lg font-bold text-yellow-400">{stats.yellow}</p>
                  <p className="text-xs text-slate-400">Warning</p>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* BARIQ Insight */}
      {activeCategory === 'all' || activeCategory === 'spirits' ? (
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
      ) : activeCategory === 'food' ? (
        <div className="bg-bariq-purple/5 border border-bariq-purple/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-bariq-purple">✨</span>
            <span className="text-sm font-medium text-bariq-purple">BARIQ Food Insight</span>
          </div>
          <p className="text-sm text-slate-300">
            Chicken stock is 25 lbs below target (85 vs 110 lbs). With Saturday demand forecast of +21%, 
            recommend ordering 180 lbs to avoid stock-out risk during peak weekend service.
          </p>
        </div>
      ) : null}

      {/* Table */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-xs text-slate-400">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-1">On Hand <InfoTooltip term="On Hand" definition="The actual counted quantity currently in stock at the location. Determined by physical count or vision estimate." /></span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-1">Expected <InfoTooltip term="Expected" definition="The theoretical quantity that should be in stock based on: Beginning Inventory + Purchases - Sales - Known Waste. This is what the system calculates should remain." /></span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-1">Variance <InfoTooltip term="Unexplained Inventory Variance" definition="" /></span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-1">Value <InfoTooltip term="Inventory Variance Value" definition="" /></span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="flex items-center justify-center gap-1">Status <InfoTooltip term="Status" definition="GREEN = variance under 3% or less than 0.5 units. YELLOW = variance between 3-8% or 0.5-1.5 units. RED (Critical) = variance over 8% or more than 1.5 units. Thresholds are configurable per product category." /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: any) => (
              <tr
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                  selectedProduct?.id === item.id ? 'bg-bariq-purple/10' : 'hover:bg-slate-700/20'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {item.category === 'food' ? '🍗' :
                       item.subcategory === 'beer' ? '🍺' :
                       item.subcategory === 'wine' ? '🍷' :
                       item.category === 'cocktail' ? '🍸' : '🥃'}
                    </span>
                    <span className="text-sm font-medium">{item.product_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400 capitalize">{item.subcategory}</td>
                <td className="px-4 py-3 text-sm text-right">{item.on_hand}</td>
                <td className="px-4 py-3 text-sm text-right">{item.expected}</td>
                <td className={`px-4 py-3 text-sm text-right ${item.variance > 0.5 ? 'text-red-400' : 'text-slate-300'}`}>
                  {item.variance > 0 ? `-${item.variance}` : item.variance}
                </td>
                <td className="px-4 py-3 text-sm text-right">${item.variance_value}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
                    item.status === 'red' ? 'bg-red-500/20 text-red-300' :
                    item.status === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'red' ? 'bg-red-500' :
                      item.status === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    {item.status === 'red' ? 'Critical' : item.status === 'yellow' ? 'Warning' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">No items in this category</div>
        )}
      </div>

      {/* Selected Product Detail — Pour Intelligence for beverages */}
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
              <p className="text-2xl font-bold">{selectedProduct.standard_pour_ml}ml</p>
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

      {/* Selected Product Detail — Food item */}
      {selectedProduct && selectedProduct.category === 'food' && (
        <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold">Food Intelligence — {selectedProduct.product_name}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold">{selectedProduct.on_hand}</p>
              <p className="text-xs text-slate-400">Current Stock</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold">{selectedProduct.expected}</p>
              <p className="text-xs text-slate-400">Target Level</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className={`text-2xl font-bold ${selectedProduct.variance > 5 ? 'text-red-400' : 'text-yellow-400'}`}>
                -{selectedProduct.variance}
              </p>
              <p className="text-xs text-slate-400">Below Target</p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold text-red-400">${selectedProduct.variance_value}</p>
              <p className="text-xs text-slate-400">Variance Cost</p>
            </div>
          </div>
          {selectedProduct.status !== 'green' && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-xs text-orange-300 font-medium">⚠️ Stock-out risk for upcoming Saturday (+21% forecast demand)</p>
              <p className="text-xs text-slate-400 mt-1">Recommendation: Place order to bring stock to safety level before weekend.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
