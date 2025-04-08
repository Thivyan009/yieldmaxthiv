import { cn } from "@/lib/utils"
import { DollarSign } from "lucide-react"

interface AssetLogoProps {
  symbol: string
  className?: string
}

export function AssetLogo({ symbol, className }: AssetLogoProps) {
  // Check if the symbol is a stablecoin
  const isStablecoin = ['USDT', 'USDC', 'USDS', 'USDG'].includes(symbol)
  
  // Check if the symbol is a common asset
  const isCommonAsset = ['ETH', 'BTC'].includes(symbol)
  
  // Determine the background color based on the asset type
  const getBgColor = () => {
    if (isStablecoin) return 'bg-green-500'
    if (symbol === 'ETH') return 'bg-blue-500'
    if (symbol === 'BTC') return 'bg-yellow-500'
    return 'bg-gray-500'
  }
  
  // Get the first letter of the symbol for the fallback
  const firstLetter = symbol.charAt(0)
  
  return (
    <div className={cn("h-8 w-8 rounded-full overflow-hidden flex items-center justify-center", getBgColor(), className)}>
      {isStablecoin || isCommonAsset ? (
        <span className="text-white font-bold text-xs">{symbol}</span>
      ) : (
        <DollarSign className="h-4 w-4 text-white" />
      )}
    </div>
  )
} 