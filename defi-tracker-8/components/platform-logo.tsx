import Image from "next/image"

interface PlatformLogoProps {
  platform: string
  className?: string
}

const platformLogos: Record<string, string> = {
  // Lending Protocols
  "aave": "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  "aave-v2": "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  "aave-v3": "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  "compound": "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  "compound-v2": "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  "compound-v3": "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  "clearpool": "https://assets.coingecko.com/coins/images/24416/small/cpool.png",
  "clearpool-lending": "https://assets.coingecko.com/coins/images/24416/small/cpool.png",
  "venus": "https://assets.coingecko.com/coins/images/12677/small/venus.png",
  "radiant": "https://assets.coingecko.com/coins/images/26536/small/radiant-logo-mono-white-bg.png",
  "morpho": "https://assets.coingecko.com/coins/images/28176/small/Morpho_Token_200.png",
  "euler": "https://assets.coingecko.com/coins/images/26149/small/YCvKDfl8_400x400.jpeg",
  "ipor": "https://assets.coingecko.com/coins/images/27582/small/200x200_logo.png",
  "fluid": "https://assets.coingecko.com/coins/images/30771/small/fld.png",
  
  // DEXes
  "uniswap": "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  "uniswap-v2": "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  "uniswap-v3": "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  "pancakeswap": "https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png",
  "pancakeswap-v2": "https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png",
  "pancakeswap-v3": "https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png",
  "pancakeswap-amm": "https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png",
  "pancakeswap-amm-v3": "https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png",
  "sushiswap": "https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png",
  "curve": "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
  "balancer": "https://assets.coingecko.com/coins/images/11683/small/Balancer.png",
  "trader-joe": "https://assets.coingecko.com/coins/images/17476/small/JOE_icon.png",
  "trader-joe-v2": "https://assets.coingecko.com/coins/images/17476/small/JOE_icon.png",
  "raydium": "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg",
  "raydium-amm": "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg",
  "orca": "https://assets.coingecko.com/coins/images/17547/small/Orca_Logo.png",
  "apeswap": "https://assets.coingecko.com/coins/images/14947/small/apeswap.png",
  "apeswap-amm": "https://assets.coingecko.com/coins/images/14947/small/apeswap.png",
  "quickswap": "https://assets.coingecko.com/coins/images/13970/small/1_pOU6pBMEmiL-ZJVb0CYRjQ.png",
  "spookyswap": "https://assets.coingecko.com/coins/images/17213/small/spooky.png",
  "spiritswap": "https://assets.coingecko.com/coins/images/15122/small/spiral.png",
  
  // Yield Aggregators
  "beefy": "https://assets.coingecko.com/coins/images/12704/small/token.png",
  "yearn": "https://assets.coingecko.com/coins/images/11849/small/yearn.png",
  "convex": "https://assets.coingecko.com/coins/images/15585/small/convex.png",
  "concentrator": "https://assets.coingecko.com/coins/images/18657/small/concentrator.png",
  
  // New Protocols
  "aerodrome": "https://assets.coingecko.com/coins/images/31753/small/token.png",
  "aerodrome-v1": "https://assets.coingecko.com/coins/images/31753/small/token.png",
  "aerodrome-slipstream": "https://assets.coingecko.com/coins/images/31753/small/token.png",
  "steer": "https://assets.coingecko.com/coins/images/31161/small/steer.png",
  "steer-protocol": "https://assets.coingecko.com/coins/images/31161/small/steer.png",
  "babydoge": "https://assets.coingecko.com/coins/images/28435/small/babydoge.png",
  "babydogeswap": "https://assets.coingecko.com/coins/images/28435/small/babydoge.png",
  "origami": "https://assets.coingecko.com/coins/images/31974/small/origami.png",
  "origami-finance": "https://assets.coingecko.com/coins/images/31974/small/origami.png",
  "liquid": "https://assets.coingecko.com/coins/images/26375/small/apt.png",
  "liquidswap": "https://assets.coingecko.com/coins/images/26375/small/apt.png",
  "velodrome": "https://assets.coingecko.com/coins/images/25783/small/velo.png",
  "kyberswap": "https://assets.coingecko.com/coins/images/14899/small/RwdVsGcw_400x400.jpg",
  "gmx": "https://assets.coingecko.com/coins/images/18323/small/arbit.png",
  "gains": "https://assets.coingecko.com/coins/images/19737/small/logo.png",
  "pendle": "https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png"
}

export function PlatformLogo({ platform, className = "h-5 w-5" }: PlatformLogoProps) {
  // Normalize platform name by converting to lowercase and removing common suffixes
  const normalizedPlatform = platform.toLowerCase()
    .replace(/-lending$/, '')
    .replace(/-amm$/, '')
    .replace(/-v[0-9]+$/, '')
    .replace(/-protocol$/, '')
    .replace(/-finance$/, '')
    .replace('-', '')
    .trim()

  const logoUrl = platformLogos[platform.toLowerCase()] || 
                 platformLogos[normalizedPlatform] || 
                 platformLogos[normalizedPlatform.replace(/swap$/, '')]

  if (!logoUrl) {
    // Return a default placeholder if no logo is found
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center`}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {platform.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      <Image
        src={logoUrl}
        alt={`${platform} logo`}
        className="rounded-full object-contain"
        fill
        sizes="(max-width: 768px) 20px, 24px"
      />
    </div>
  )
} 