"use client"

import { useState } from "react"
import { Plus, MessageCircle, Settings, LayoutDashboard } from "lucide-react"
import type { Token, Evidence } from "@/lib/types"
import TokenCard from "@/components/TokenCard"
import EvidenceModal from "@/components/EvidenceModal"

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
      <header className="sticky top-0 z-40 bg-card/70 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">CryptoAssistant</h1>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Follow token..."
              value={followInput}
              onChange={(e) => setFollowInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFollowToken()}
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={handleFollowToken}
              className="bg-gradient-to-tr from-primary to-emerald-500 text-primary-foreground rounded-lg px-3 py-2 font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Token List */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-3">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} onViewEvidence={setSelectedToken} />
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-3 left-3 right-3 bg-card/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
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
      <EvidenceModal token={selectedToken} evidenceItems={mockEvidence} onClose={() => setSelectedToken(null)} />
    </div>
  )
}
