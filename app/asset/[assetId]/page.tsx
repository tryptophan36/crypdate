"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Newspaper, Brain, RefreshCw } from "lucide-react"
import { Token } from "@/lib/types"
import PriceChart from "@/components/PriceChart"

// Mock data for BTC and ETH
const mockAssetData: Record<string, Token & { price: number; change24h: number; volume24h: number; marketCap: number }> = {
  "btc": {
    id: "btc",
    symbol: "BTC",
    verdict: "BUY",
    confidence: 82,
    tldr: "Strong bullish momentum with institutional accumulation signals. Technical breakout confirmed.",
    sparkline: [45, 52, 48, 61, 55, 68, 72, 65, 78, 85],
    price: 42850.50,
    change24h: 2.4,
    volume24h: 28500000000,
    marketCap: 840000000000
  },
  "eth": {
    id: "eth",
    symbol: "ETH",
    verdict: "HOLD",
    confidence: 65,
    tldr: "Mixed signals from on-chain data. Awaiting clarity on network upgrades.",
    sparkline: [40, 42, 38, 45, 43, 50, 48, 52, 55, 58],
    price: 2650.30,
    change24h: -1.2,
    volume24h: 12000000000,
    marketCap: 320000000000
  }
}

// Mock news data
const mockNews = [
  {
    id: 1,
    title: "Bitcoin ETF Approval Boosts Institutional Adoption",
    source: "CoinDesk",
    time: "2 hours ago",
    sentiment: "positive",
    impact: "high"
  },
  {
    id: 2,
    title: "Ethereum Network Upgrade Shows Promising Results",
    source: "CryptoNews",
    time: "4 hours ago",
    sentiment: "positive",
    impact: "medium"
  },
  {
    id: 3,
    title: "Regulatory Concerns Loom Over Crypto Markets",
    source: "Reuters",
    time: "6 hours ago",
    sentiment: "negative",
    impact: "high"
  }
]

// Mock AI analysis
const mockAIAnalysis = {
  technical: "Strong bullish momentum with RSI at 68. Price action shows clear breakout above resistance at $42,000. MACD shows bullish divergence.",
  fundamental: "Institutional adoption continues to grow with recent ETF approvals. Network activity remains high with increasing transaction volume.",
  sentiment: "Social sentiment is bullish with 73% positive mentions. Fear & Greed index at 65 (Greed), indicating strong market confidence.",
  recommendation: "BUY - Strong technical and fundamental signals support continued upward momentum. Consider scaling in positions."
}

export default function AssetAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const assetId = params.assetId as string
  const [asset, setAsset] = useState<typeof mockAssetData[string] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const assetData = mockAssetData[assetId.toLowerCase()]
      if (assetData) {
        setAsset(assetData)
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [assetId])

  const handleRefreshAnalysis = () => {
    setAiAnalysisLoading(true)
    // Simulate AI analysis refresh
    setTimeout(() => {
      setAiAnalysisLoading(false)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading asset analysis...</p>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested asset could not be found.</p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/70 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{asset.symbol}</h1>
              <p className="text-sm text-muted-foreground">Asset Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Price Overview */}
        <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div>
              <h2 className="text-3xl font-bold">${asset.price.toLocaleString()}</h2>
              <div className={`flex items-center gap-2 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {asset.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="text-sm font-semibold">{asset.change24h >= 0 ? '+' : ''}{asset.change24h}%</span>
                <span className="text-xs text-muted-foreground">24h</span>
              </div>
            </div>
            <div className="text-left sm:text-right text-sm text-muted-foreground">
              <p>Volume: ${(asset.volume24h / 1000000000).toFixed(1)}B</p>
              <p>Market Cap: ${(asset.marketCap / 1000000000).toFixed(0)}B</p>
            </div>
          </div>
          
          {/* Price Chart */}
        
        </div>

        {/* News Section */}
        <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper size={20} />
            <h2 className="text-xl font-bold">Recent News</h2>
          </div>
          
          <div className="space-y-3">
            {mockNews.map((news) => (
              <div key={news.id} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm leading-tight">{news.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    news.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                    news.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {news.sentiment}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                  <span>•</span>
                  <span className="capitalize">{news.impact} impact</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={20} />
              <h2 className="text-xl font-bold">AI Analysis</h2>
            </div>
            <button
              onClick={handleRefreshAnalysis}
              disabled={aiAnalysisLoading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={aiAnalysisLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* AI Analysis Screen */}
          <div className="bg-black/40 border border-white/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground ml-2">AI Analysis Terminal</span>
            </div>

            {aiAnalysisLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span className="text-muted-foreground">Analyzing market data...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-green-400 mb-2">Technical Analysis:</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{mockAIAnalysis.technical}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Fundamental Analysis:</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{mockAIAnalysis.fundamental}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-purple-400 mb-2">Sentiment Analysis:</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{mockAIAnalysis.sentiment}</p>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-sm font-semibold text-yellow-400 mb-2">Recommendation:</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-semibold">{mockAIAnalysis.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
