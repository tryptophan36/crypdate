"use client"

import { ChevronRight } from "lucide-react"
import { Token } from "@/lib/types"
import VerdictBadge from "./VerdictBadge"
import Sparkline from "./Sparkline"

export default function TokenCard({ token, onViewEvidence }: { token: Token; onViewEvidence: (token: Token) => void }) {
  return (
    <div className="bg-card/60 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-4 space-y-3 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">{token.symbol}</h3>
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
        className="w-full bg-gradient-to-tr from-primary to-emerald-500 text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
      >
        View Evidence
        <ChevronRight size={16} />
      </button>
    </div>
  )
}


