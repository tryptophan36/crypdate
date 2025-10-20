"use client"

import { ChevronRight, X } from "lucide-react"
import { Evidence, Token } from "@/lib/types"

export default function EvidenceModal({ token, evidenceItems, onClose }: { token: Token | null; evidenceItems: Evidence[]; onClose: () => void }) {
  if (!token) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-card/80 backdrop-blur-md border-t border-white/10 w-full rounded-t-3xl p-6 space-y-5 max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{token.symbol} Evidence</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          {evidenceItems.map((item, idx) => (
            <div key={idx} className="bg-muted/40 border border-white/10 rounded-xl p-4 space-y-2">
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


