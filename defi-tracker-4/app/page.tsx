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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  Clock,
  Percent,
  Bookmark,
  ChevronUp,
  Download,
  Layers,
  LogIn,
  UserPlus,
} from "lucide-react"
import { DeFiData } from "@/lib/data"
import { Logo } from "@/components/logo"
import { StatsCard } from "@/components/stats-card"
import { MobileDataCard } from "@/components/mobile-data-card"
import { useState } from "react"

// Add chain data
const chainData = {
  ethereum: {
    name: "Ethereum",
    logo: "/placeholder.svg?height=24&width=24",
    color: "bg-blue-500",
  },
  arbitrum: {
    name: "Arbitrum",
    logo: "/placeholder.svg?height=24&width=24",
    color: "bg-blue-700",
  },
  optimism: {
    name: "Optimism",
    logo: "/placeholder.svg?height=24&width=24",
    color: "bg-red-500",
  },
  base: {
    name: "Base",
    logo: "/placeholder.svg?height=24&width=24",
    color: "bg-blue-400",
  },
}

// Add chain information to each DeFi data item
const enhancedDeFiData = DeFiData.map((item) => {
  // Assign a random chain for demonstration
  const chains = Object.keys(chainData)
  const randomChain = chains[Math.floor(Math.random() * chains.length)]

  return {
    ...item,
    chain: randomChain,
  }
})

export default function Home() {
  const [sortColumn, setSortColumn] = useState("apy24h")
  const [sortDirection, setSortDirection] = useState("desc")
  const [platformFilters, setPlatformFilters] = useState<string[]>([])
  const [chainFilters, setChainFilters] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState(enhancedDeFiData)

  // Get unique platforms for filter
  const platforms = Array.from(new Set(enhancedDeFiData.map((item) => item.platform)))

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

  const applyFilters = () => {
    let result = [...enhancedDeFiData]

    if (platformFilters.length > 0) {
      result = result.filter((item) => platformFilters.includes(item.platform))
    }

    if (chainFilters.length > 0) {
      result = result.filter((item) => chainFilters.includes(item.chain))
    }

    // Sort the filtered data
    result.sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a]
      const bValue = b[sortColumn as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        // Remove % and $ signs for comparison
        const aNum = Number.parseFloat(aValue.replace(/[%$]/g, ""))
        const bNum = Number.parseFloat(bValue.replace(/[%$]/g, ""))

        return sortDirection === "asc" ? aNum - bNum : bNum - aNum
      }

      return 0
    })

    setFilteredData(result)
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
                    <Input placeholder="Search protocols, assets..." />
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
                          <Button variant="ghost" className="justify-start h-8 px-2">
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
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Ethereum
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Arbitrum
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Optimism
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Base
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="assets">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Assets</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-1 pl-6">
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            USDC
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            ETH
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            WBTC
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            DAI
                          </Button>
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
                        <div className="flex flex-col space-y-1 pl-6">
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Morpho
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            IPOR
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Euler
                          </Button>
                          <Button variant="ghost" className="justify-start h-8 px-2">
                            Fluid
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Logo />
            <div className="hidden md:flex items-center gap-6 ml-8">{/* Navigation links removed */}</div>
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
            <div className="hidden md:flex gap-2">
              <Button variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </div>
            <Button className="md:hidden" size="icon" variant="outline">
              <LogIn className="h-5 w-5" />
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
                        <Badge variant="outline" className="cursor-pointer bg-primary/10 text-primary">
                          Stablecoins
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          ETH
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          BTC
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Network</div>
                      <div className="flex flex-col space-y-2">
                        {Object.entries(chainData).map(([key, chain]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`chain-${key}`}
                              checked={chainFilters.includes(key)}
                              onCheckedChange={() => toggleChainFilter(key)}
                            />
                            <label
                              htmlFor={`chain-${key}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                              <div className={`h-4 w-4 rounded-full ${chain.color}`}></div>
                              {chain.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Platforms</div>
                      <div className="flex flex-col space-y-2 max-h-[150px] overflow-y-auto pr-2">
                        {platforms.map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={`platform-${platform}`}
                              checked={platformFilters.includes(platform)}
                              onCheckedChange={() => togglePlatformFilter(platform)}
                            />
                            <label
                              htmlFor={`platform-${platform}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {platform}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Min APY</div>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="5%" className="h-8" />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Min TVL</div>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="1M" className="h-8" />
                        <span className="text-sm">$</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Morpho USDC</div>
                          <div className="text-xs text-muted-foreground">7.52%</div>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Euler USDC</div>
                          <div className="text-xs text-muted-foreground">10.40%</div>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">IPOR USDC</div>
                          <div className="text-xs text-muted-foreground">8.05%</div>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <Separator />
                    <div className="text-center">
                      <Button variant="link" size="sm" className="text-xs">
                        <LogIn className="h-3 w-3 mr-1" />
                        Sign in to save your watchlist
                      </Button>
                    </div>
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
                  value="14.24%"
                  description="Euler - Resolv USDC"
                  icon={TrendingUp}
                  trend="up"
                  trendValue="+1.2%"
                />
                <StatsCard
                  title="Total Value Locked"
                  value="$584.25M"
                  description="Across all tracked protocols"
                  icon={Wallet}
                  trend="up"
                  trendValue="+$12.4M"
                />
                <StatsCard
                  title="Average APY"
                  value="8.42%"
                  description="24-hour average across all vaults"
                  icon={Percent}
                  trend="down"
                  trendValue="-0.3%"
                />
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Yield Opportunities</CardTitle>
                      <CardDescription>Sorted by highest 24h APY</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Sliders className="h-3.5 w-3.5 mr-2" />
                            Filters
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <div className="p-2">
                            <div className="mb-2 text-sm font-medium">Asset Type</div>
                            <div className="flex flex-wrap gap-1 mb-4">
                              <Badge variant="outline" className="cursor-pointer">
                                All
                              </Badge>
                              <Badge variant="outline" className="cursor-pointer">
                                Stablecoins
                              </Badge>
                              <Badge variant="outline" className="cursor-pointer">
                                ETH
                              </Badge>
                            </div>
                            <div className="mb-2 text-sm font-medium">Platforms</div>
                            <div className="flex flex-col space-y-1 mb-4 max-h-[150px] overflow-y-auto">
                              {platforms.map((platform) => (
                                <div key={platform} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`dropdown-platform-${platform}`}
                                    checked={platformFilters.includes(platform)}
                                    onCheckedChange={() => togglePlatformFilter(platform)}
                                  />
                                  <label
                                    htmlFor={`dropdown-platform-${platform}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {platform}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <div className="mb-2 text-sm font-medium">Min APY</div>
                            <Input type="number" placeholder="5%" className="h-8 mb-4" />
                            <Button size="sm" className="w-full" onClick={applyFilters}>
                              Apply
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                            Sort
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("apy24h")
                              setSortDirection("desc")
                            }}
                          >
                            24h APY (High to Low)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("apy24h")
                              setSortDirection("asc")
                            }}
                          >
                            24h APY (Low to High)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("tvl")
                              setSortDirection("desc")
                            }}
                          >
                            TVL (High to Low)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSortColumn("days")
                              setSortDirection("desc")
                            }}
                          >
                            Operating Time (Longest)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" size="sm" className="h-8">
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Asset</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Chain</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("apy24h")}>
                            <div className="flex items-center gap-1">
                              24h APY
                              {sortColumn === "apy24h" &&
                                (sortDirection === "asc" ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ))}
                            </div>
                          </TableHead>
                          <TableHead>30d APY</TableHead>
                          <TableHead>Lifetime APY</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("tvl")}>
                            <div className="flex items-center gap-1">
                              TVL
                              {sortColumn === "tvl" &&
                                (sortDirection === "asc" ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ))}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("days")}>
                            <div className="flex items-center gap-1">
                              Operating
                              {sortColumn === "days" &&
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
                        {filteredData.map((item, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">USDC</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="cursor-help flex items-center gap-1">
                                    <div className="font-medium">{item.platform}</div>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="flex justify-between space-x-4">
                                    <Avatar>
                                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                      <AvatarFallback>{item.platform.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-semibold">{item.platform}</h4>
                                      <p className="text-sm">{item.description}</p>
                                      <div className="flex items-center pt-2">
                                        <Badge variant="outline" className="text-xs">
                                          Risk: Medium
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-6 w-6 rounded-full ${chainData[item.chain].color} flex items-center justify-center`}
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={chainData[item.chain].logo} />
                                    <AvatarFallback>{chainData[item.chain].name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                </div>
                                <span className="text-sm">{chainData[item.chain].name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="font-medium text-green-600">{item.apy24h}</div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>24-hour average APY</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="font-medium">{item.apy30d}</TableCell>
                            <TableCell className="font-medium">{item.apyLifetime}</TableCell>
                            <TableCell className="font-medium">{item.tvl}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{item.days} days</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" className="h-8">
                                <span>Details</span>
                                <ArrowRight className="h-3.5 w-3.5 ml-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden">
                    <div className="divide-y">
                      {filteredData.map((item, index) => (
                        <MobileDataCard
                          key={index}
                          platform={item.platform}
                          description={item.description}
                          apy24h={item.apy24h}
                          apy30d={item.apy30d}
                          apyLifetime={item.apyLifetime}
                          tvl={item.tvl}
                          days={item.days}
                          chain={item.chain}
                          chainData={chainData[item.chain]}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{filteredData.length}</span> of{" "}
                    <span className="font-medium">{enhancedDeFiData.length}</span> opportunities
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-primary/10">
                      <span className="text-xs">1</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <span className="text-xs">2</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <span className="text-xs">3</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Updates</CardTitle>
                  <CardDescription>Latest changes in DeFi yields</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">Euler APY Increased</h4>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-800"
                          >
                            +1.2%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Euler's Resolv USDC vault APY increased from 9.2% to 10.4% in the last 24 hours.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">New Protocol Added</h4>
                          <Badge>New</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Beefy Finance's Morpho Smokehouse strategy has been added to the tracker.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">Risk Assessment Update</h4>
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800"
                          >
                            Medium
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          IPOR protocol risk assessment has been updated from Low to Medium.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
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

function Shield(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}

