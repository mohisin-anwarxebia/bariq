import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  evidence?: string[]
  recommendation?: string
  confidence?: number
  actions?: any[]
}

export default function BariqAgent({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Good morning, Alex.\n\nI found 3 things needing your attention today.",
      evidence: [
        "🔴 Tequila variance detected — $425 estimated impact",
        "🟠 Chicken stock-out risk — Saturday demand +21%",
        "🟢 Saturday beverage opportunity — +24% forecast"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickQuestions = [
    "Why is tequila variance high?",
    "What should I order?",
    "What are customers saying?",
    "What should I prepare for Saturday?"
  ]

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agent/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: {} })
      })
      const data = await res.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer,
        evidence: data.evidence,
        recommendation: data.recommendation,
        confidence: data.confidence,
        actions: data.actions
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  const handleApprove = async (action: any) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ Action approved: ${action.label}\n\nPurchase order created successfully.`,
      confidence: 1.0
    }])
  }

  return (
    <div className="w-96 bg-navy-800 border-l border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-bariq-purple text-lg">✨</span>
          <span className="font-semibold">BARIQ</span>
          <span className="text-xs bg-bariq-purple/20 text-bariq-purple px-1.5 py-0.5 rounded">AI</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
            {msg.role === 'user' ? (
              <div className="bg-bariq-blue/20 border border-bariq-blue/30 rounded-lg px-3 py-2 max-w-[80%]">
                <p className="text-sm">{msg.content}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-slate-400 font-medium uppercase">Evidence</p>
                    {msg.evidence.map((e, j) => (
                      <p key={j} className="text-xs text-slate-300">• {e}</p>
                    ))}
                  </div>
                )}
                {msg.recommendation && (
                  <div className="bg-bariq-purple/10 border border-bariq-purple/20 rounded-lg p-3">
                    <p className="text-xs text-bariq-purple font-medium">Recommendation</p>
                    <p className="text-xs text-slate-300 mt-1">{msg.recommendation}</p>
                  </div>
                )}
                {msg.confidence && msg.confidence < 1 && (
                  <p className="text-xs text-slate-500">Confidence: {Math.round(msg.confidence * 100)}%</p>
                )}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.actions.map((action: any, j: number) => (
                      <button
                        key={j}
                        onClick={() => handleApprove(action)}
                        className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                          action.type === 'approve'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-slate-600/50 text-slate-300 border border-slate-500/30 hover:bg-slate-600'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="animate-pulse">●●●</div>
            <span className="text-xs">BARIQ is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 space-y-1">
          <p className="text-xs text-slate-500">Suggested questions:</p>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="block w-full text-left text-xs px-3 py-1.5 bg-slate-700/30 rounded hover:bg-slate-700/60 text-slate-300 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask BARIQ..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-bariq-purple"
          />
          <button
            onClick={() => sendMessage(input)}
            className="px-3 py-2 bg-bariq-purple rounded-lg text-sm hover:bg-bariq-purple/80 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
