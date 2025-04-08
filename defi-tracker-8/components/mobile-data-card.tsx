"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ChainInfo } from "@/lib/api"
import { ArrowRight, Star, StarOff } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface MobileDataCardProps {
  platform: string
  description: string
  apy24h: string
  apy30d: string
  apyLifetime: string
  baseApy: string
  rewardApy: string
  tvl: string
  days: number
  chain: string
  chainData: ChainInfo
  inWatchlist?: boolean
  onWatchlistToggle?: () => void
  symbol: string
}

export function MobileDataCard({
  platform,
  description,
  apy24h,
  apy30d,
  apyLifetime,
  baseApy,
  rewardApy,
  tvl,
  days,
  chain,
  chainData,
  inWatchlist = false,
  onWatchlistToggle,
  symbol,
}: MobileDataCardProps) {
  return (
    <Card className="mb-2 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{platform}</h3>
              <Badge variant="outline" className="text-xs">
                {chainData.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                trackEvent('protocol_click', {
                  protocol: platform,
                  chain: chain,
                  view: 'mobile',
                  symbol: symbol
                });
                // Construct URL to the specific coin's page
                const protocolSlug = platform.toLowerCase().replace(/\s+/g, '-');
                const coinSlug = symbol.toLowerCase().replace(/\s+/g, '-');
                const defaultUrl = `https://defillama.com/yields/protocol/${protocolSlug}?token=${coinSlug}`;
                window.open(defaultUrl, '_blank');
              }}
            >
              <span>Details</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onWatchlistToggle}
            >
              {inWatchlist ? (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">Total APY</div>
              <div className="text-xs text-muted-foreground">Base + Reward</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                {apy24h}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="text-sm text-muted-foreground">
                  Base: <span className={baseApy.startsWith('-') ? 'text-red-600' : 'text-green-600'}>{baseApy}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Reward: <span className={rewardApy.startsWith('-') ? 'text-red-600' : 'text-green-600'}>{rewardApy}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">7d APY</div>
            <div className="text-sm text-muted-foreground">
              7d APY: <span className={apy30d.startsWith('-') ? 'text-red-600' : 'text-green-600'}>{apy30d}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">30d APY</div>
            <div className="text-sm text-muted-foreground">
              30d APY: <span className={apyLifetime.startsWith('-') ? 'text-red-600' : 'text-green-600'}>{apyLifetime}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">TVL</div>
            <div className="font-medium">{tvl}</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">{days} days of data</div>
        </div>
      </CardContent>
    </Card>
  )
}
