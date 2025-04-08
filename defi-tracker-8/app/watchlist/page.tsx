"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useWatchlist } from "@/contexts/watchlist-context"
import { fetchYieldData, formatAPY, formatTVL, getChainInfo, type YieldPool } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Star, ChevronUp, ChevronDown } from "lucide-react"
import { Logo } from "@/components/logo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function WatchlistPage() {
  const { user } = useAuth()
  const { watchlist, toggleWatchlist } = useWatchlist()
  const [isLoading, setIsLoading] = useState(true)
  const [watchlistItems, setWatchlistItems] = useState<YieldPool[]>([])
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState("tvlUsd")
  const [sortDirection, setSortDirection] = useState("desc")

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    }
  }, [user, router])

  useEffect(() => {
    const loadWatchlistData = async () => {
      if (watchlist.length === 0) {
        setWatchlistItems([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const allData = await fetchYieldData()
        const filteredData = allData.filter((item) => watchlist.includes(item.pool))
        setWatchlistItems(filteredData)
      } catch (error) {
        console.error("Error loading watchlist data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWatchlistData()
  }, [watchlist])

  if (!user) {
    return null // Will redirect in useEffect
  }

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] dark:bg-[#0f172a]">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[#1e293b] shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Watchlist</CardTitle>
            <CardDescription>Track your favorite DeFi opportunities in one place</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading watchlist data...</span>
              </div>
            ) : watchlistItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                <Button onClick={() => router.push("/")}>Browse Opportunities</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("apy")}>
                      <div className="flex items-center gap-1">
                        APY
                        {sortColumn === "apy" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("apyPct7D")}>
                      <div className="flex items-center gap-1">
                        7d APY
                        {sortColumn === "apyPct7D" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("apyPct30D")}>
                      <div className="flex items-center gap-1">
                        30d APY
                        {sortColumn === "apyPct30D" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("apyBase")}>
                      Base APY
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("apyReward")}>
                      Reward APY
                    </TableHead>
                    <TableHead>TVL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlistItems.map((item) => {
                    const chainInfo = getChainInfo(item.chain.toLowerCase())
                    return (
                      <TableRow key={item.pool}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleWatchlist(item.pool)}
                          >
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.symbol}</TableCell>
                        <TableCell>{item.project}</TableCell>
                        <TableCell>{chainInfo.name}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={`font-medium ${item.apy < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {formatAPY(item.apy)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Total APY (Base + Rewards)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${item.apyPct7D < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatAPY(item.apyPct7D)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${item.apyPct30D < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatAPY(item.apyPct30D)}
                          </div>
                        </TableCell>
                        <TableCell className={`font-medium ${item.apyBase < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatAPY(item.apyBase)}
                        </TableCell>
                        <TableCell className={`font-medium ${item.apyReward < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatAPY(item.apyReward)}
                        </TableCell>
                        <TableCell>{formatTVL(item.tvlUsd)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
