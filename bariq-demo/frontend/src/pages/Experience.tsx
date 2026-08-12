import { useState, useEffect } from 'react'
import { InfoTooltip } from '../components/InfoTooltip'

export default function Experience() {
  const [data, setData] = useState<any>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)

  useEffect(() => {
    fetch('/api/experience').then(r => r.json()).then(setData)
    fetch('/api/feedback').then(r => r.json()).then(setFeedback)
  }, [])

  if (!data) return <div className="animate-pulse text-slate-400">Loading...</div>

  const { health_score, root_cause_analysis } = data

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customer Experience</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-slate-400">BARIQ Verified Experience Engine</p>
          <InfoTooltip term="Verified Experience" definition="" />
        </div>
      </div>

      {/* Health Score */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard label="Overall" score={health_score.overall} tooltip="Health Score" />
        <ScoreCard label="Food" score={health_score.food} />
        <ScoreCard label="Beverage" score={health_score.beverage} />
        <ScoreCard label="Service" score={health_score.service} />
        <ScoreCard label="Wait Time" score={health_score.wait_time} />
      </div>

      {/* Root Cause Analysis */}
      {root_cause_analysis && (
        <div className="bg-bariq-purple/5 border border-bariq-purple/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-bariq-purple">✨</span>
            <span className="text-sm font-medium text-bariq-purple">BARIQ Root Cause Analysis</span>
            <InfoTooltip term="Root Cause Analysis" definition="" />
          </div>
          <p className="text-sm font-medium mb-2">{root_cause_analysis.finding}</p>
          <p className="text-xs text-slate-400 mb-3">Period: {root_cause_analysis.period}</p>
          <div className="space-y-1 mb-3">
            {root_cause_analysis.correlations.map((c: string, i: number) => (
              <p key={i} className="text-xs text-slate-300">• {c}</p>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs text-slate-400">
              <strong>Potential contributing factors:</strong> {root_cause_analysis.contributing_factors}
            </p>
            <InfoTooltip term="Contributing Factors" definition="" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <p className="text-xs text-slate-500">Confidence: {Math.round(root_cause_analysis.confidence * 100)}%</p>
            <InfoTooltip term="Confidence Score" definition="" />
          </div>
        </div>
      )}

      {/* Verified Feedback */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold">Verified Experiences</h3>
          <InfoTooltip term="Verified Experience" definition="" />
        </div>
        <div className="space-y-3">
          {feedback?.feedback?.slice(0, 6).map((fb: any) => (
            <div
              key={fb.id}
              onClick={() => setSelectedFeedback(selectedFeedback?.id === fb.id ? null : fb)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedFeedback?.id === fb.id
                  ? 'border-bariq-purple/40 bg-bariq-purple/5'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Verified ✓</span>
                  <span className="text-sm font-medium">{fb.customer_name}</span>
                </div>
                <span className="text-xs text-slate-500">{fb.location_id}</span>
              </div>
              {fb.products_ordered.length > 0 && (
                <p className="text-xs text-slate-400 mb-2">Ordered: {fb.products_ordered.join(', ')}</p>
              )}
              <div className="flex gap-3 flex-wrap">
                {fb.food_rating && <RatingBadge label="Food" rating={fb.food_rating} />}
                {fb.beverage_rating && <RatingBadge label="Beverage" rating={fb.beverage_rating} />}
                {fb.service_rating && <RatingBadge label="Service" rating={fb.service_rating} />}
                {fb.wait_rating && <RatingBadge label="Wait" rating={fb.wait_rating} />}
              </div>
              {fb.comment && <p className="text-xs text-slate-400 mt-2 italic">"{fb.comment}"</p>}

              {/* Expanded detail */}
              {selectedFeedback?.id === fb.id && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Transaction Details:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-700/30 rounded p-2">
                      <p className="text-slate-400">Location</p>
                      <p className="font-medium capitalize">{fb.location_id}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded p-2">
                      <p className="text-slate-400">Verified</p>
                      <p className="font-medium text-green-400">Yes — linked to transaction</p>
                    </div>
                    <div className="bg-slate-700/30 rounded p-2">
                      <p className="text-slate-400">Date</p>
                      <p className="font-medium">{fb.date?.split('T')[0] || 'Recent'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ label, score, tooltip }: { label: string; score: number; tooltip?: string }) {
  const color = score >= 85 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'
  const bgColor = score >= 85 ? 'border-green-500/20' : score >= 70 ? 'border-yellow-500/20' : 'border-red-500/20'
  return (
    <div className={`bg-navy-800 rounded-xl border ${bgColor} p-4 text-center`}>
      <p className={`text-3xl font-bold ${color}`}>{score}</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <p className="text-xs text-slate-400">{label}</p>
        {tooltip && <InfoTooltip term={tooltip} definition="" />}
      </div>
    </div>
  )
}

function RatingBadge({ label, rating }: { label: string; rating: string }) {
  const colors: Record<string, string> = {
    excellent: 'bg-green-500/20 text-green-300',
    good: 'bg-blue-500/20 text-blue-300',
    needs_improvement: 'bg-red-500/20 text-red-300',
    better: 'bg-green-500/20 text-green-300',
    expected: 'bg-blue-500/20 text-blue-300',
    worse: 'bg-red-500/20 text-red-300',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors[rating] || 'bg-slate-600 text-slate-300'}`}>
      {label}: {rating.replace('_', ' ')}
    </span>
  )
}
