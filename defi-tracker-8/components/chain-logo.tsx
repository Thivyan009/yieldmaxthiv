import Image from "next/image"

interface ChainLogoProps {
  chain: string
  className?: string
}

const chainLogos: Record<string, string> = {
  // Layer 1s
  "ethereum": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  "eth": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  "bitcoin": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  "btc": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  "solana": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  "sol": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  "avalanche": "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  "avax": "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  "avalanche-c": "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  "binance": "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  "bnb": "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  "bsc": "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  "fantom": "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png",
  "ftm": "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png",
  "tron": "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png",
  "trx": "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png",
  
  // Layer 2s & Sidechains
  "polygon": "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  "matic": "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  "polygon-pos": "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  "polygon-zkevm": "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  "arbitrum": "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  "arbitrum-one": "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  "arbitrum-nova": "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  "optimism": "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  "op": "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  "base": "https://assets.coingecko.com/coins/images/32978/small/base.png",
  "metis": "https://assets.coingecko.com/coins/images/15595/small/metis.PNG",
  "metis-andromeda": "https://assets.coingecko.com/coins/images/15595/small/metis.PNG",
  "celo": "https://assets.coingecko.com/coins/images/11090/small/InjXBNx9_400x400.jpg",
  "gnosis": "https://assets.coingecko.com/coins/images/24186/small/gnosis.png",
  "xdai": "https://assets.coingecko.com/coins/images/24186/small/gnosis.png",
  "aurora": "https://assets.coingecko.com/coins/images/20582/small/aurora.jpeg",
  "moonriver": "https://assets.coingecko.com/coins/images/17984/small/moonriver.png",
  "moonbeam": "https://assets.coingecko.com/coins/images/22459/small/glmr.png",
  "harmony": "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png",
  "one": "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png",
  "kava": "https://assets.coingecko.com/coins/images/9761/small/kava.png",
  "klaytn": "https://assets.coingecko.com/coins/images/9672/small/klaytn.png",
  "klay": "https://assets.coingecko.com/coins/images/9672/small/klaytn.png",
  "linea": "https://assets.coingecko.com/coins/images/33910/small/linea.png",
  "zksync": "https://assets.coingecko.com/coins/images/25947/small/zksync.jpeg",
  "zksync-era": "https://assets.coingecko.com/coins/images/25947/small/zksync.jpeg",
  "scroll": "https://assets.coingecko.com/coins/images/32269/small/scroll.png"
}

export function ChainLogo({ chain, className = "h-5 w-5" }: ChainLogoProps) {
  // Normalize chain name by converting to lowercase and handling common aliases
  const normalizedChain = chain.toLowerCase()
    .replace('network', '')
    .replace('chain', '')
    .replace('mainnet', '')
    .replace('-chain', '')
    .replace('-main', '')
    .replace('-one', '')
    .replace('-pos', '')
    .replace('-era', '')
    .replace('-andromeda', '')
    .trim()

  const logoUrl = chainLogos[normalizedChain]

  if (!logoUrl) {
    // Return a default placeholder if no logo is found
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center`}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {chain.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      <Image
        src={logoUrl}
        alt={`${chain} logo`}
        className="rounded-full object-contain"
        fill
        sizes="(max-width: 768px) 20px, 24px"
      />
    </div>
  )
} 