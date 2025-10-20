import { Verdict } from "@/lib/types"

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const colors = {
    BUY: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30",
    HOLD: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-300/30",
    REDUCE: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-400/30",
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm ${colors[verdict]}`}
    >
      {verdict}
    </span>
  )
}


