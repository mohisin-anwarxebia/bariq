import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import BariqAgent from './BariqAgent'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/inventory', label: 'Inventory', icon: '📦' },
  { path: '/vision', label: 'Vision', icon: '👁️' },
  { path: '/experience', label: 'Experience', icon: '⭐' },
  { path: '/forecast', label: 'Forecast', icon: '📈' },
  { path: '/recommendations', label: 'Actions', icon: '✅' },
  { path: '/audit', label: 'Audit', icon: '📋' },
]

export default function Layout() {
  const [agentOpen, setAgentOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white">Urban Pour</h1>
          <p className="text-xs text-slate-400">Operations Platform</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-bariq-purple flex items-center justify-center text-xs font-bold">AM</div>
            <div>
              <p className="text-sm font-medium">Alex Morgan</p>
              <p className="text-xs text-slate-400">Regional Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="h-14 bg-navy-800 border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">DEMO MODE</span>
            <span className="text-xs text-slate-400">Demo Data — Not connected to production systems</span>
          </div>
          <button
            onClick={() => setAgentOpen(!agentOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-bariq-purple/20 border border-bariq-purple/40 rounded-lg text-bariq-purple hover:bg-bariq-purple/30 transition-colors"
          >
            <span className="text-sm">✨</span>
            <span className="text-sm font-medium">Ask BARIQ</span>
          </button>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* BARIQ Agent Panel */}
      {agentOpen && <BariqAgent onClose={() => setAgentOpen(false)} />}
    </div>
  )
}
