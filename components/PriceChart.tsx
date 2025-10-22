"use client"

import { useEffect, useRef } from "react"

interface PriceChartProps {
  data: number[]
  symbol: string
  price: number
  change24h: number
}

export default function PriceChart({ data, symbol, price, change24h }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = 20
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find min and max values
    const minValue = Math.min(...data)
    const maxValue = Math.max(...data)
    const valueRange = maxValue - minValue

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding)
    const isPositive = change24h >= 0
    gradient.addColorStop(0, isPositive ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)")
    gradient.addColorStop(1, isPositive ? "rgba(34, 197, 94, 0.05)" : "rgba(239, 68, 68, 0.05)")

    // Draw area under curve
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = rect.height - padding - ((value - minValue) / valueRange) * chartHeight
      ctx.lineTo(x, y)
    })

    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw line
    ctx.strokeStyle = isPositive ? "#22c55e" : "#ef4444"
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = rect.height - padding - ((value - minValue) / valueRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw dots
    ctx.fillStyle = isPositive ? "#22c55e" : "#ef4444"
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = rect.height - padding - ((value - minValue) / valueRange) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

  }, [data, change24h])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ height: "200px" }}
      />
      
      {/* Chart overlay info */}
      <div className="absolute top-4 left-4">
        <div className="text-sm font-semibold">{symbol}</div>
        <div className="text-xs text-muted-foreground">24h Performance</div>
      </div>
      
      <div className="absolute top-4 right-4 text-right">
        <div className="text-sm font-semibold">${price.toLocaleString()}</div>
        <div className={`text-xs ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
