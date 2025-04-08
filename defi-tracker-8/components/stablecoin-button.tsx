import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StablecoinButtonProps {
  symbol: string
  isSelected: boolean
  onClick: () => void
}

const stablecoinLogos: Record<string, string> = {
  USDT: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#26A17B"/>
    <path d="M12.0001 4.80005V7.20005H16.8001V4.80005H12.0001ZM12.0001 7.20005V9.60005H16.8001V7.20005H12.0001ZM12.0001 9.60005V12.0001H16.8001V9.60005H12.0001ZM12.0001 12.0001V14.4001H16.8001V12.0001H12.0001ZM12.0001 14.4001V16.8001H16.8001V14.4001H12.0001ZM12.0001 16.8001V19.2001H16.8001V16.8001H12.0001Z" fill="white"/>
  </svg>`,
  USDC: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2775CA"/>
    <path d="M12 4.80005C8.40005 4.80005 5.40005 7.80005 5.40005 11.4C5.40005 15 8.40005 18 12 18C15.6 18 18.6 15 18.6 11.4C18.6 7.80005 15.6 4.80005 12 4.80005ZM12 16.8C9.60005 16.8 7.80005 15 7.80005 12.6V10.2C7.80005 7.80005 9.60005 6 12 6C14.4 6 16.2 7.80005 16.2 10.2V12.6C16.2 15 14.4 16.8 12 16.8Z" fill="white"/>
  </svg>`,
  USDS: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#00A3FF"/>
    <path d="M12 4.80005C8.40005 4.80005 5.40005 7.80005 5.40005 11.4C5.40005 15 8.40005 18 12 18C15.6 18 18.6 15 18.6 11.4C18.6 7.80005 15.6 4.80005 12 4.80005ZM12 16.8C9.60005 16.8 7.80005 15 7.80005 12.6V10.2C7.80005 7.80005 9.60005 6 12 6C14.4 6 16.2 7.80005 16.2 10.2V12.6C16.2 15 14.4 16.8 12 16.8Z" fill="white"/>
  </svg>`,
  USDG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#00B8D9"/>
    <path d="M12 4.80005C8.40005 4.80005 5.40005 7.80005 5.40005 11.4C5.40005 15 8.40005 18 12 18C15.6 18 18.6 15 18.6 11.4C18.6 7.80005 15.6 4.80005 12 4.80005ZM12 16.8C9.60005 16.8 7.80005 15 7.80005 12.6V10.2C7.80005 7.80005 9.60005 6 12 6C14.4 6 16.2 7.80005 16.2 10.2V12.6C16.2 15 14.4 16.8 12 16.8Z" fill="white"/>
  </svg>`
}

export function StablecoinButton({ symbol, isSelected, onClick }: StablecoinButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-8 gap-2 transition-colors",
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
      )}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      <div
        className="h-4 w-4"
        dangerouslySetInnerHTML={{ __html: stablecoinLogos[symbol] }}
      />
      {symbol}
    </Button>
  )
} 