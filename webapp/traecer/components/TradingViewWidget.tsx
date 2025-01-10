'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
  autosize?: boolean
  interval?: string
  style?: string
  hide_side_toolbar?: boolean
}

export function TradingViewWidget({ 
  symbol, 
  theme = 'dark', 
  autosize = true, 
  interval = 'D',
  style = '1',
  hide_side_toolbar = false
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          autosize,
          symbol,
          interval,
          timezone: 'Etc/UTC',
          theme,
          style,
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_side_toolbar,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [symbol, theme, autosize, interval, style, hide_side_toolbar])

  return <div id={`tradingview_${symbol}`} ref={containerRef} style={{ height: '100%', width: '100%' }} />
}

