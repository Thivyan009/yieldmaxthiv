"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Star, StarOff, Info } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileDataCardProps {
  platform: string
  description: string
  apy24h: string
  apy30d: string
  apyLifetime: string
  tvl: string
  days: number
  chain?: string
  chainData?: {
    name: string
    logo: string
    color: string
  }
}

export function MobileDataCard({
  platform,
  description,
  apy24h,
  apy30d,
  apyLifetime,
  tvl,
  days,
  chain,
  chainData,
}: MobileDataCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => setIsWatchlisted(!isWatchlisted)}>
            {isWatchlisted ? (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
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
                  className="h-3 w-3 text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="font-medium">USDC</span>
              {chain && chainData && (
                <div className="flex items-center gap-1">
                  <div className={`h-4 w-4 rounded-full ${chainData.color} flex items-center justify-center`}>
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={chainData.logo} />
                      <AvatarFallback>{chainData.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs">{chainData.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <h3 className="font-medium">{platform}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{platform} is a DeFi protocol offering yield opportunities.</p>
                    <p className="text-xs mt-1">Risk: Medium</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-green-600">{apy24h}</div>
          <div className="text-xs text-muted-foreground">24h APY</div>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-between items-center mt-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto font-normal text-primary flex items-center gap-1">
              {isOpen ? "Hide details" : "Show details"}
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <Button variant="outline" size="sm" className="h-8">
            <span>Details</span>
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t">
            <div>
              <div className="text-xs text-muted-foreground">30d APY</div>
              <div className="font-medium">{apy30d}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Lifetime APY</div>
              <div className="font-medium">{apyLifetime}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">TVL</div>
              <div className="font-medium">{tvl}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Operating</div>
              <div className="font-medium">{days} days</div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

