import { fetchYieldData, formatAPY, formatTVL } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TrendingUp, Wallet, Percent } from 'lucide-react'

export async function StatsCards() {
  const data = await fetchYieldData()
  
  // Calculate stats
  const totalTVL = data.reduce((sum, item) => sum + (item.tvlUsd || 0), 0)
  const validApyValues = data.filter((item) => item.apy != null)
  const averageAPY = validApyValues.length > 0
    ? validApyValues.reduce((sum, item) => sum + (item.apy || 0), 0) / validApyValues.length
    : 0
  const topAPY = validApyValues.length > 0
    ? Math.max(...validApyValues.map((item) => item.apy || 0))
    : 0
  const topAPYPool = data.find((item) => item.apy === topAPY)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top APY</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAPY(topAPY)}</div>
          <p className="text-xs text-muted-foreground">
            {topAPYPool ? `${topAPYPool.project} - ${topAPYPool.symbol}` : 'No data'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTVL(totalTVL)}</div>
          <p className="text-xs text-muted-foreground">
            Across all tracked protocols
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average APY</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAPY(averageAPY)}</div>
          <p className="text-xs text-muted-foreground">
            Average across all pools
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 