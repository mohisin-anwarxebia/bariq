import { useState } from 'react'

interface TooltipProps {
  term: string
  definition: string
  children?: React.ReactNode
}

const DEFINITIONS: Record<string, string> = {
  "Verified Experience": "Customer feedback that is cryptographically linked to an actual transaction. The customer must have a confirmed visit and purchase to leave feedback — eliminating fake or anonymous reviews.",
  "Unexplained Inventory Variance": "The difference between what the system expects to be on hand (based on purchases minus sales minus known waste) and what is actually counted. We never label this as theft — possible causes include over-pouring, breakage, receiving errors, counting mistakes, or POS mapping issues.",
  "Pour Variance": "The difference between the standard (expected) pour amount for a spirit and the estimated actual pour. A standard pour is typically 30ml or 45ml. Variance indicates potential over-pouring or under-pouring.",
  "Standard Pour": "The pre-defined amount of liquid that should be dispensed for one serving of a spirit. Typically 30ml (1 oz) for premium spirits or 45ml (1.5 oz) for standard spirits.",
  "Fill Level": "The estimated percentage of liquid remaining in a bottle, determined by computer vision analysis of the bottle image. Used to calculate remaining servings and compare against inventory records.",
  "Three-Way Reconciliation": "Comparing three independent data sources — Vision (camera estimate), Inventory System (database records), and POS (sales records) — to detect discrepancies that a single source might miss.",
  "Health Score": "A composite score (0–100) measuring customer satisfaction across food quality, beverage quality, service quality, and wait time. Calculated from verified experience responses, not public reviews.",
  "Root Cause Analysis": "BARIQ's correlation engine that connects declining customer experience scores to operational data (order volume, wait times, pour variance, staffing levels) to identify potential contributing factors.",
  "Demand Forecast": "A prediction of future demand based on weighted combination of historical sales patterns, day-of-week trends, weather conditions, and local event proximity. Expressed as percentage change from baseline.",
  "Confidence Score": "A percentage (0–100%) indicating how certain BARIQ is about a finding or recommendation. Based on data quality, sample size, and correlation strength. BARIQ always shows confidence so managers can weigh decisions appropriately.",
  "Gross Margin": "Revenue minus Cost of Goods Sold (COGS), expressed as a percentage of revenue. For beverages, typical healthy margin is 75–85%. For food, typical is 65–72%.",
  "Revenue Impact": "The estimated dollar value at risk or opportunity identified by BARIQ. Calculated by multiplying variance quantities by selling price.",
  "Inventory Variance Value": "The dollar cost of unexplained inventory loss, calculated by multiplying the variance quantity by the product's purchase cost (not selling price).",
  "Contributing Factors": "Operational conditions that correlate with a detected issue. BARIQ uses 'potential contributing factors' rather than claiming proven causation, because correlation does not equal causation.",
  "Embedded Intelligence": "BARIQ operates inside an existing hospitality application rather than as a separate tool. Staff use their familiar interface while BARIQ adds AI-powered insights, predictions, and actions within that same experience.",
  "Action Workflow": "The process by which BARIQ surfaces a recommendation, a manager reviews evidence and approves/modifies/rejects it, and the system creates an operational action (purchase order, staffing change, process review) with full audit trail.",
  "Audit Trail": "A tamper-evident log of every AI query, tool invocation, recommendation, approval decision, and resulting action. Provides accountability and compliance evidence for operational decisions.",
}

export function InfoTooltip({ term, definition }: TooltipProps) {
  const [show, setShow] = useState(false)
  const def = definition || DEFINITIONS[term] || `Definition for "${term}" not available.`

  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-1 w-4 h-4 rounded-full bg-slate-600 text-[10px] text-slate-300 flex items-center justify-center hover:bg-bariq-purple hover:text-white transition-colors cursor-help"
        aria-label={`Info: ${term}`}
      >
        i
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-navy-900 border border-slate-600 rounded-lg shadow-xl z-50">
          <p className="text-xs font-semibold text-bariq-purple mb-1">{term}</p>
          <p className="text-xs text-slate-300 leading-relaxed">{def}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-900 border-r border-b border-slate-600 rotate-45 -mt-1" />
        </div>
      )}
    </span>
  )
}

export function DefinitionBadge({ term }: { term: string }) {
  const [show, setShow] = useState(false)
  const def = DEFINITIONS[term] || `Definition for "${term}" not available.`

  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded border border-slate-600 hover:border-bariq-purple hover:text-bariq-purple transition-colors cursor-help flex items-center gap-1"
      >
        <span className="w-3 h-3 rounded-full bg-slate-600 text-[9px] flex items-center justify-center">i</span>
        {term}
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-navy-900 border border-slate-600 rounded-lg shadow-xl z-50">
          <p className="text-xs font-semibold text-bariq-purple mb-1">{term}</p>
          <p className="text-xs text-slate-300 leading-relaxed">{def}</p>
        </div>
      )}
    </span>
  )
}

export { DEFINITIONS }
export default InfoTooltip
