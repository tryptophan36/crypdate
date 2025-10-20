"use client"

import { useState } from "react"
import { ChevronRight, Plus, MessageCircle, Settings, LayoutDashboard, X } from "lucide-react"

// Mock data types
interface Token {
  id: string
  symbol: string
  verdict: "BUY" | "HOLD" | "REDUCE"
  confidence: number
  tldr: string
  sparkline: number[]
}

interface Evidence {
  type: string
  label: string
  value: string
}

// Mock data
const mockTokens: Token[] = [
  {
    id: "1",
    symbol: "BTC",
    verdict: "BUY",
    confidence: 82,
    tldr: "Strong bullish momentum with institutional accumulation signals. Technical breakout confirmed.",
    sparkline: [45, 52, 48, 61, 55, 68, 72, 65, 78, 85],
  },
  {
    id: "2",
    symbol: "ETH",
    verdict: "HOLD",
    confidence: 65,
    tldr: "Mixed signals from on-chain data. Awaiting clarity on network upgrades.",
    sparkline: [40, 42, 38, 45, 43, 50, 48, 52, 55, 58],
  },
  {
    id: "3",
    symbol: "SOL",
    verdict: "REDUCE",
    confidence: 71,
    tldr: "Declining whale activity and negative sentiment. Consider taking profits.",
    sparkline: [60, 58, 55, 52, 48, 45, 42, 40, 38, 35],
  },
]

const mockEvidence: Evidence[] = [
  { type: "tx", label: "Transaction Hash", value: "0x7f3a...8c2e" },
  { type: "news", label: "News Source", value: "CryptoNews Daily" },
  { type: "price", label: "Pyth Price Snapshot", value: "$42,850.50" },
]

// Verdict badge component
function VerdictBadge({ verdict }: { verdict: "BUY" | "HOLD" | "REDUCE" }) {
  const colors = {
    BUY: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    HOLD: "bg-slate-500/20 text-slate-600 dark:text-slate-400",
    REDUCE: "bg-red-500/20 text-red-600 dark:text-red-400",
  }
  return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[verdict]}`}>{verdict}</span>
}

// Sparkline chart component
function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox="0 0 100 40" className="w-full h-12">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className="text-emerald-500"
      />
    </svg>
  )
}

// Token card component
function TokenCard({ token, onViewEvidence }: { token: Token; onViewEvidence: (token: Token) => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{token.symbol}</h3>
          <p className="text-xs text-muted-foreground mt-1">{token.confidence}% Confidence</p>
        </div>
        <VerdictBadge verdict={token.verdict} />
      </div>

      <p className="text-sm text-foreground/80 leading-snug">{token.tldr}</p>

      <div className="h-12 text-muted-foreground">
        <Sparkline data={token.sparkline} />
      </div>

      <button
        onClick={() => onViewEvidence(token)}
        className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        View Evidence
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// Evidence modal component
function EvidenceModal({ token, onClose }: { token: Token | null; onClose: () => void }) {
  if (!token) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-card w-full rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{token.symbol} Evidence</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          {mockEvidence.map((item, idx) => (
            <div key={idx} className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">{item.label}</p>
              <a href="#" className="text-sm text-primary font-semibold hover:underline flex items-center gap-2">
                {item.value}
                <ChevronRight size={14} />
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-muted text-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// Main dashboard component
export default function CryptoAssistant() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [followInput, setFollowInput] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleFollowToken = () => {
    if (followInput.trim()) {
      setFollowInput("")
      // Mock: In real app, this would add to watchlist
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="px-4 py-4 space-y-3">
          <h1 className="text-2xl font-bold text-foreground">CryptoAssistant</h1>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Follow token..."
              value={followInput}
              onChange={(e) => setFollowInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFollowToken()}
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleFollowToken}
              className="bg-primary text-primary-foreground rounded-lg px-3 py-2 font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Token List */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} onViewEvidence={setSelectedToken} />
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === "dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === "feedback" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircle size={24} />
            <span className="text-xs font-semibold">Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === "settings" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings size={24} />
            <span className="text-xs font-semibold">Settings</span>
          </button>
        </div>
      </nav>

      {/* Evidence Modal */}
      <EvidenceModal token={selectedToken} onClose={() => setSelectedToken(null)} />
    </div>
  )
}
