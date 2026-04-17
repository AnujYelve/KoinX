export type GainsData = {
  stcg: { profits: number; losses: number }
  ltcg: { profits: number; losses: number }
}

export type Holding = {
  id: number
  name: string
  symbol: string
  logoColor: string
  logoLetter: string
  logoUrl?: string
  holdings: number
  avgBuyPrice: number
  currentPrice: number
  stcg: { gain: number; units: number }
  ltcg: { gain: number; units: number }
}


export function calculateAfterHarvesting(
  baseGains: GainsData,
  selectedHoldings: Holding[]
): GainsData {
  let stcgProfits = baseGains.stcg.profits
  let stcgLosses = baseGains.stcg.losses
  let ltcgProfits = baseGains.ltcg.profits
  let ltcgLosses = baseGains.ltcg.losses

  for (const asset of selectedHoldings) {
    if (asset.stcg.gain > 0) {
      stcgProfits += asset.stcg.gain
    } else {
      stcgLosses += Math.abs(asset.stcg.gain)
    }

    if (asset.ltcg.gain > 0) {
      ltcgProfits += asset.ltcg.gain
    } else {
      ltcgLosses += Math.abs(asset.ltcg.gain)
    }
  }

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses },
  }
}

export function getNetGains(gains: GainsData) {
  const stcgNet = gains.stcg.profits - gains.stcg.losses
  const ltcgNet = gains.ltcg.profits - gains.ltcg.losses
  const total = stcgNet + ltcgNet
  return { stcgNet, ltcgNet, total }
}


export function formatCurrency(value: number): string {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return value < 0 ? `- $ ${formatted}` : `$ ${formatted}`
}


export function formatCompact(value: number): string {
  const abs = Math.abs(value)
  let formatted: string

  if (abs >= 1_000_000) {
    formatted = `$${(abs / 1_000_000).toFixed(2)}M`
  } else if (abs >= 1_000) {
    formatted = `$${(abs / 1_000).toFixed(2)}K`
  } else {
    formatted = `$${abs.toFixed(2)}`
  }

  return value < 0 ? `-${formatted}` : `+${formatted}`
}


export function formatFull(value: number): string {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return value < 0 ? `-$${formatted}` : `$${formatted}`
}


export function formatPrice(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}
