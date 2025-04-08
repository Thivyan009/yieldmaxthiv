"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowUpDown,
  DollarSign,
  ChevronDown,
  Menu,
  TrendingUp,
  Wallet,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Star,
  StarOff,
  Info,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Percent,
  Bookmark,
  ChevronUp,
  Download,
  Layers,
  LogIn,
  UserPlus,
  Loader2,
  Shield,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { StatsCard } from "@/components/stats-card"
import { MobileDataCard } from "@/components/mobile-data-card"
import { useState, useEffect } from "react"
import { fetchYieldData, formatAPY, formatTVL, getChainInfo, type YieldPool } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useWatchlist } from "@/contexts/watchlist-context"
import { UserMenu } from "@/components/user-menu"
import { useRouter } from "next/navigation"
import { StablecoinButton } from "@/components/stablecoin-button"
import { cn } from "@/lib/utils"
import { PlatformLogo } from "@/components/platform-logo"
import { ChainLogo } from "@/components/chain-logo"
import { AssetLogo } from "@/components/asset-logo"
import { trackEvent } from "@/lib/analytics"

export default function Home() {
  const { user } = useAuth()
  const { watchlist, isInWatchlist, toggleWatchlist } = useWatchlist()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yieldData, setYieldData] = useState<YieldPool[]>([])
  const [sortColumn, setSortColumn] = useState("tvlUsd")
  const [sortDirection, setSortDirection] = useState("desc")
  const [platformFilters, setPlatformFilters] = useState<string[]>([])
  const [chainFilters, setChainFilters] = useState<string[]>([])
  const [stablecoinFilters, setStablecoinFilters] = useState<string[]>([])
  const [tvlRange, setTvlRange] = useState<[number, number]>([500000000, Number.POSITIVE_INFINITY]) // Default $500M+
  const [apyRange, setApyRange] = useState<[number, number]>([0, Number.POSITIVE_INFINITY])
  const [filteredData, setFilteredData] = useState<YieldPool[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Get unique platforms for filter
  const platforms = Array.from(new Set(yieldData.map((item) => item.project)))
  const uniqueChains = Array.from(new Set(yieldData.map((item) => item.chain.toLowerCase())))

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchYieldData()
        setYieldData(data)
        setFilteredData(data)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sortColumn, sortDirection, platformFilters, chainFilters, stablecoinFilters, tvlRange, apyRange, searchTerm, yieldData])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const togglePlatformFilter = (platform: string) => {
    setPlatformFilters((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const toggleChainFilter = (chain: string) => {
    setChainFilters((prev) => (prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]))
  }

  const toggleStablecoinFilter = (coin: string) => {
    setStablecoinFilters(prev => 
      prev.includes(coin) 
        ? prev.filter(c => c !== coin)
        : [...prev, coin]
    )
  }

  const applyFilters = () => {
    let result = [...yieldData]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.project.toLowerCase().includes(term) ||
          item.symbol.toLowerCase().includes(term) ||
          item.chain.toLowerCase().includes(term),
      )
    }

    // Apply platform filters
    if (platformFilters.length > 0) {
      result = result.filter((item) => platformFilters.includes(item.project))
    }

    // Apply chain filters
    if (chainFilters.length > 0) {
      result = result.filter((item) => chainFilters.includes(item.chain.toLowerCase()))
    }

    // Apply stablecoin filters
    if (stablecoinFilters.length > 0) {
      result = result.filter((item) => stablecoinFilters.includes(item.symbol))
    }

    // Apply TVL range filter
    result = result.filter((item) => item.tvlUsd >= tvlRange[0] && item.tvlUsd <= tvlRange[1])

    // Apply APY range filter
    result = result.filter((item) => item.apy >= apyRange[0] && item.apy <= apyRange[1])

    // Sort the filtered data
    result.sort((a, b) => {
      const aValue = a[sortColumn as keyof YieldPool]
      const bValue = b[sortColumn as keyof YieldPool]

      if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1
      if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    setFilteredData(result)
    setCurrentPage(1)
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Calculate stats
  const totalTVL = yieldData.reduce((sum, item) => sum + (item.tvlUsd || 0), 0)
  const validApyValues = yieldData.filter((item) => item.apy !== null && item.apy !== undefined)
  const averageAPY =
    validApyValues.length > 0
      ? validApyValues.reduce((sum, item) => sum + (item.apy || 0), 0) / validApyValues.length
      : 0
  const topAPY = validApyValues.length > 0 ? Math.max(...validApyValues.map((item) => item.apy || 0)) : 0
  const topAPYPool = yieldData.find((item) => item.apy === topAPY)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const exportToCSV = () => {
    const headers = ["Project", "Chain", "Symbol", "APY", "TVL", "Pool"]
    const csvData = filteredData.map((item) => [
      item.project,
      item.chain,
      item.symbol,
      item.apy.toString(),
      item.tvlUsd.toString(),
      item.pool,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "defi_yields.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleWatchlistToggle = (poolId: string) => {
    if (!user) {
      // Redirect to sign in if not logged in
      router.push("/signin")
    } else {
      toggleWatchlist(poolId)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] dark:bg-[#0f172a]">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[#1e293b] shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                  <SheetDescription>Navigate DeFi yield opportunities</SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="mb-4">
                    <Input
                      placeholder="Search protocols, assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="dashboard">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6">
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Overview
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Analytics
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start h-8 px-2"
                            onClick={() => (user ? router.push("/watchlist") : router.push("/signin"))}
                          >
                            Watchlist
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="networks">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          <span>Networks</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6">
                          {uniqueChains.slice(0, 8).map((chain) => (
                            <Button
                              key={chain}
                              variant="ghost"
                              className="justify-start h-8 px-2"
                              onClick={() => toggleChainFilter(chain)}
                            >
                              {getChainInfo(chain).name}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="protocols">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Protocols</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6 max-h-[200px] overflow-y-auto">
                          {platforms.slice(0, 10).map((platform) => (
                            <Button
                              key={platform}
                              variant="ghost"
                              className="justify-start h-8 px-2"
                              onClick={() => togglePlatformFilter(platform)}
                            >
                              {platform}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  {!user ? (
                    <>
                      <Button className="w-full" variant="outline" onClick={() => router.push("/signin")}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Button className="w-full" onClick={() => router.push("/signup")}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => router.push("/watchlist")}>
                      <Star className="h-4 w-4 mr-2" />
                      View Watchlist
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Light</DropdownMenuItem>
                <DropdownMenuItem>Dark</DropdownMenuItem>
                <DropdownMenuItem>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:flex">
              <UserMenu />
            </div>
            <Button
              className="md:hidden"
              size="icon"
              variant="outline"
              onClick={() => router.push(user ? "/watchlist" : "/signin")}
            >
              {user ? <Star className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="hidden md:block w-[240px] shrink-0">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Asset Type</div>
                      <div className="flex flex-wrap gap-2">
                        {['USDT', 'USDC', 'USDS', 'USDG'].map((coin) => (
                          <StablecoinButton
                            key={coin}
                            symbol={coin}
                            isSelected={stablecoinFilters.includes(coin)}
                            onClick={() => toggleStablecoinFilter(coin)}
                          />
                        ))}
                        <Badge
                          variant={searchTerm === "ETH" ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSearchTerm(searchTerm === "ETH" ? "" : "ETH")}
                        >
                          ETH
                        </Badge>
                        <Badge
                          variant={searchTerm === "BTC" ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSearchTerm(searchTerm === "BTC" ? "" : "BTC")}
                        >
                          BTC
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Network</div>
                      <div className="flex flex-col space-y-2 max-h-[150px] overflow-y-auto">
                        {uniqueChains.slice(0, 10).map((chain) => {
                          const chainInfo = getChainInfo(chain)
                          return (
                            <div key={chain} className="flex items-center space-x-2">
                              <div className="relative flex items-center">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={chainFilters.includes(chain)}
                                  className={cn(
                                    "w-4 h-4 border rounded",
                                    chainFilters.includes(chain) ? "bg-primary border-primary" : "border-input"
                                  )}
                                  onClick={() => toggleChainFilter(chain)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      toggleChainFilter(chain)
                                    }
                                  }}
                                >
                                  {chainFilters.includes(chain) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-sm" />
                                    </div>
                                  )}
                                </button>
                              </div>
                              <button
                                type="button"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer text-left"
                                onClick={() => toggleChainFilter(chain)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    toggleChainFilter(chain)
                                  }
                                }}
                              >
                                <div className={`h-4 w-4 rounded-full ${chainInfo.color}`} />
                                {chainInfo.name}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Platforms</div>
                      <div className="flex flex-col space-y-2 max-h-[150px] overflow-y-auto pr-2">
                        {platforms.slice(0, 15).map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <div className="relative flex items-center">
                              <button
                                type="button"
                                role="checkbox"
                                aria-checked={platformFilters.includes(platform)}
                                className={cn(
                                  "w-4 h-4 border rounded",
                                  platformFilters.includes(platform) ? "bg-primary border-primary" : "border-input"
                                )}
                                onClick={() => togglePlatformFilter(platform)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    togglePlatformFilter(platform)
                                  }
                                }}
                              >
                                {platformFilters.includes(platform) && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                  </div>
                                )}
                              </button>
                            </div>
                            <button
                              type="button"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-left"
                              onClick={() => togglePlatformFilter(platform)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  togglePlatformFilter(platform)
                                }
                              }}
                            >
                              {platform}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">TVL Range</div>
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <Input
                            type="number"
                            placeholder="Min TVL"
                            value={tvlRange[0]}
                            onChange={(e) => setTvlRange([Number(e.target.value), tvlRange[1]])}
                            className="h-8"
                          />
                          <Input
                            type="number"
                            placeholder="Max TVL"
                            value={tvlRange[1] === Number.POSITIVE_INFINITY ? "" : tvlRange[1]}
                            onChange={(e) => setTvlRange([tvlRange[0], Number(e.target.value) || Number.POSITIVE_INFINITY])}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">APY Range</div>
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <Input
                            type="number"
                            placeholder="Min APY"
                            value={apyRange[0]}
                            onChange={(e) => setApyRange([Number(e.target.value), apyRange[1]])}
                            className="h-8"
                          />
                          <Input
                            type="number"
                            placeholder="Max APY"
                            value={apyRange[1] === Number.POSITIVE_INFINITY ? "" : apyRange[1]}
                            onChange={(e) => setApyRange([apyRange[0], Number(e.target.value) || Number.POSITIVE_INFINITY])}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{user ? "Your Watchlist" : "Top Protocols"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user && watchlist.length > 0 ? (
                      // Show user's watchlist
                      <>
                        {yieldData
                          .filter((item) => watchlist.includes(item.pool))
                          .slice(0, 3)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{item.project}</div>
                                  <div className="text-xs text-muted-foreground">{formatAPY(item.apy)}</div>
                                </div>
                              </div>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          ))}
                        <Separator />
                        <div className="text-center">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs"
                            onClick={() => router.push("/watchlist")}
                          >
                            View All Watchlist Items
                          </Button>
                        </div>
                      </>
                    ) : (
                      // Show top protocols for non-logged in users or empty watchlist
                      <>
                        {yieldData.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <DollarSign className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{item.project}</div>
                                <div className="text-xs text-muted-foreground">{formatAPY(item.apy)}</div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleWatchlistToggle(item.pool)}
                            >
                              <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                            </Button>
                          </div>
                        ))}
                        <Separator />
                        <div className="text-center">
                          {!user ? (
                            <Button variant="link" size="sm" className="text-xs" onClick={() => router.push("/signin")}>
                              <LogIn className="h-3 w-3 mr-1" />
                              Sign in to save your watchlist
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Add items to your watchlist by clicking the star icon
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">DeFi Yield Tracker</h1>
                <p className="text-muted-foreground">
                  Track the base performance of DeFi products with transparent, data-driven insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatsCard
                  title="Top APY"
                  value={formatAPY(topAPY)}
                  description={topAPYPool ? `${topAPYPool.project} - ${topAPYPool.symbol}` : "Loading..."}
                  icon={TrendingUp}
                  trend="up"
                  trendValue="+1.2%"
                />
                <StatsCard
                  title="Total Value Locked"
                  value={formatTVL(totalTVL)}
                  description="Across all tracked protocols"
                  icon={Wallet}
                  trend="up"
                  trendValue="+$12.4M"
                />
                <StatsCard
                  title="Average APY"
                  value={formatAPY(averageAPY)}
                  description="Average across all pools"
                  icon={Percent}
                  trend="neutral"
                  trendValue="0.0%"
                />
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Yield Opportunities</CardTitle>
                      <CardDescription>
                        {isLoading
                          ? "Loading yield data..."
                          : error
                            ? "Error loading data"
                            : `Showing ${filteredData.length.toLocaleString()} opportunities`}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2">
                        {['USDT', 'USDC', 'USDS', 'USDG'].map((coin) => (
                          <StablecoinButton
                            key={coin}
                            symbol={coin}
                            isSelected={stablecoinFilters.includes(coin)}
                            onClick={() => toggleStablecoinFilter(coin)}
                          />
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="h-8" onClick={exportToCSV}>
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading yield data...</span>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center py-20 text-destructive">
                      <AlertTriangle className="h-8 w-8 mr-2" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader className="bg-muted/50">
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
                              <TableHead className="cursor-pointer" onClick={() => handleSort("tvlUsd")}>
                                <div className="flex items-center gap-1">
                                  TVL
                                  {sortColumn === "tvlUsd" &&
                                    (sortDirection === "asc" ? (
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ))}
                                </div>
                              </TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentItems.map((item, index) => {
                              const chainInfo = getChainInfo(item.chain.toLowerCase())
                              const inWatchlist = user && isInWatchlist(item.pool)

                              return (
                                <TableRow key={index} className="hover:bg-muted/50">
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleWatchlistToggle(item.pool)}
                                      title={
                                        user
                                          ? inWatchlist
                                            ? "Remove from watchlist"
                                            : "Add to watchlist"
                                          : "Sign in to add to watchlist"
                                      }
                                    >
                                      {inWatchlist ? (
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      ) : (
                                        <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                                      )}
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <AssetLogo symbol={item.symbol} />
                                      <span className="font-medium">{item.symbol}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <PlatformLogo platform={item.project} />
                                      <span>{item.project}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <ChainLogo chain={item.chain} />
                                      <span>{getChainInfo(item.chain).name}</span>
                                    </div>
                                  </TableCell>
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
                                  <TableCell className="font-medium">{formatTVL(item.tvlUsd)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8"
                                      onClick={() => {
                                        trackEvent('protocol_click', {
                                          protocol: item.project,
                                          chain: item.chain,
                                          pool: item.pool,
                                          symbol: item.symbol
                                        });
                                        // Construct URL to the specific coin's page
                                        const protocolSlug = item.project.toLowerCase().replace(/\s+/g, '-');
                                        const coinSlug = item.symbol.toLowerCase().replace(/\s+/g, '-');
                                        const defaultUrl = `https://defillama.com/yields/protocol/${protocolSlug}?token=${coinSlug}`;
                                        window.open(defaultUrl, '_blank');
                                      }}
                                    >
                                      <span>Details</span>
                                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="md:hidden">
                        <div className="divide-y">
                          {currentItems.map((item, index) => {
                            const chainInfo = getChainInfo(item.chain.toLowerCase())
                            const inWatchlist = user && isInWatchlist(item.pool)

                            return (
                              <MobileDataCard
                                key={index}
                                platform={item.project}
                                description={item.poolMeta || item.symbol}
                                apy24h={formatAPY(item.apy)}
                                apy30d={formatAPY(item.apyPct7D)}
                                apyLifetime={formatAPY(item.apyPct30D)}
                                baseApy={formatAPY(item.apyBase)}
                                rewardApy={formatAPY(item.apyReward)}
                                tvl={formatTVL(item.tvlUsd)}
                                days={item.count || 0}
                                chain={item.chain.toLowerCase()}
                                chainData={chainInfo}
                                inWatchlist={inWatchlist}
                                onWatchlistToggle={() => handleWatchlistToggle(item.pool)}
                                url={item.url}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredData.length}</span> opportunities
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="icon"
                          className={`h-8 w-8 ${currentPage === pageNumber ? "bg-primary/10" : ""}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          <span className="text-xs">{pageNumber}</span>
                        </Button>
                      )
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-white dark:bg-[#1e293b]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo size="small" />
              <p className="text-sm text-muted-foreground">Transparent DeFi yield tracking</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="ghost" size="sm">
                About
              </Button>
              <Button variant="ghost" size="sm">
                API
              </Button>
              <Button variant="ghost" size="sm">
                Terms
              </Button>
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 6v12" />
                  <path d="M6 12h12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
