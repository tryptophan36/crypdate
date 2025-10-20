export type Verdict = "BUY" | "HOLD" | "REDUCE"

export interface Token {
  id: string
  symbol: string
  verdict: Verdict
  confidence: number
  tldr: string
  sparkline: number[]
}

export interface Evidence {
  type: string
  label: string
  value: string
}


