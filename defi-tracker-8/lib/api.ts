// DeFiLlama API service

export interface YieldPool {
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apyBase: number
  apyReward: number
  apy: number
  rewardTokens: string[]
  pool: string
  apyPct1D: number
  apyPct7D: number
  apyPct30D: number
  stablecoin: boolean
  ilRisk: string
  exposure: string
  predictions: {
    predictedClass: string
    predictedProbability: number
    binnedConfidence: number
  }
  poolMeta: string | null
  mu: number
  sigma: number
  count: number
  outlier: boolean
  underlyingTokens: string[]
  il7d: number
  apyBase7d: number
  apyMean30d: number
  volumeUsd1d: number
  volumeUsd7d: number
  apyBaseInception: number
}

export interface YieldData {
  status: string
  data: YieldPool[]
}

export interface ChainInfo {
  id: string
  name: string
  logoURI?: string
  color: string
}

export const chains: Record<string, ChainInfo> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    color: "bg-blue-500",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    color: "bg-blue-700",
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    color: "bg-red-500",
  },
  base: {
    id: "base",
    name: "Base",
    color: "bg-blue-400",
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    color: "bg-purple-500",
  },
  avalanche: {
    id: "avax",
    name: "Avalanche",
    color: "bg-red-600",
  },
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    color: "bg-yellow-500",
  },
  fantom: {
    id: "fantom",
    name: "Fantom",
    color: "bg-blue-800",
  },
  metis: {
    id: "metis",
    name: "Metis",
    color: "bg-teal-600",
  },
  celo: {
    id: "celo",
    name: "Celo",
    color: "bg-green-500",
  },
}

export async function fetchYieldData(): Promise<YieldPool[]> {
  try {
    // Call our server-side API route instead of directly calling the DeFiLlama API
    const response = await fetch("/api/yield-data")

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching yield data:", error)
    throw error
  }
}

export function formatAPY(apy: number | null | undefined): string {
  if (apy === null || apy === undefined) {
    return "N/A"
  }
  return `${apy.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

export function formatTVL(value: number): string {
  if (!value) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export function getChainInfo(chainId: string): ChainInfo {
  return (
    chains[chainId.toLowerCase()] || {
      id: chainId,
      name: chainId.charAt(0).toUpperCase() + chainId.slice(1),
      color: "bg-gray-500",
    }
  )
}
