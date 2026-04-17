'use client'

import { useState } from 'react'
import { Holding, formatCompact, formatFull, formatPrice } from '@/app/utils/calculateGains'

type SortConfig = {
  column: 'stcg' | 'ltcg' | null
  direction: 'asc' | 'desc' | null
}

type Props = {
  holdings: Holding[]
  selectedIds: number[]
  onSelect: (id: number) => void
  onSelectAll: (selectAll: boolean) => void
  showAll: boolean
  onToggleShowAll: () => void
}

import Image from 'next/image'

function CryptoLogo({ color, letter, logoUrl, alt }: { color: string; letter: string; logoUrl?: string; alt: string }) {
  if (logoUrl) {
    return (
      <div className="w-8 h-8 flex-shrink-0 relative">
        <Image src={logoUrl} alt={alt} fill className="object-contain" />
      </div>
    )
  }

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {letter}
    </div>
  )
}


function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' | null }) {
  const upActive = active && direction === 'asc'
  const downActive = active && direction === 'desc'

  return (
    <span className="inline-flex flex-col items-center ml-1.5 gap-0.5 translate-y-[-1px]">
      <svg width="7" height="5" viewBox="0 0 7 5" fill={upActive ? '#2563eb' : '#9ca3af'}>
        <path d="M3.5 0L7 5H0L3.5 0Z" />
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill={downActive ? '#2563eb' : '#9ca3af'}>
        <path d="M3.5 5L0 0H7L3.5 5Z" />
      </svg>
    </span>
  )
}


function GainCell({ value, units, symbol }: { value: number; units: number; symbol: string }) {
  const isZero = value === 0
  const isPositive = value > 0
  const needsTooltip = Math.abs(value) >= 100000

  const displayStr = isZero ? '$0.00' : formatCompact(value)
  const fullStr = formatFull(value)

  return (
    <div className="relative group inline-flex flex-col items-end">
      <span
        className={`text-sm font-medium ${
          isZero ? 'text-gray-500' : isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {displayStr}
      </span>
      <span className="text-xs text-gray-400">
        {units} {symbol}
      </span>
     
      {needsTooltip && (
        <div className="tooltip-box absolute bottom-full right-0 mb-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20 shadow-lg">
          {fullStr}
        </div>
      )}
    </div>
  )
}

// Price with tooltip 
function PriceCell({ price }: { price: number }) {
  const compact = formatPrice(price)
  const didCompact = price >= 1000
  const full = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="relative group inline-block">
      <span className="text-sm text-gray-900 dark:text-gray-100">{compact}</span>
      {didCompact && (
        <div className="tooltip-box absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20 shadow-lg">
          {full}
        </div>
      )}
    </div>
  )
}

export default function HoldingsTable({
  holdings,
  selectedIds,
  onSelect,
  onSelectAll,
  showAll,
  onToggleShowAll,
}: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: null })

  const allSelected = holdings.length > 0 && selectedIds.length === holdings.length

  // Sorting
  const handleSort = (column: 'stcg' | 'ltcg') => {
    setSortConfig((prev) => {
      if (prev.column !== column) return { column, direction: 'asc' }
      if (prev.direction === 'asc') return { column, direction: 'desc' }
      return { column: null, direction: null }
    })
  }

  const sortedHoldings = [...holdings].sort((a, b) => {
    if (!sortConfig.column || !sortConfig.direction) return 0
    const valA = a[sortConfig.column].gain
    const valB = b[sortConfig.column].gain
    return sortConfig.direction === 'asc' ? valA - valB : valB - valA
  })

  const displayedHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: '680px' }}>
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-4 sm:px-5 py-3 text-left">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    id="select-all"
                    aria-label="Select all holdings"
                  />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Asset</span>
                </div>
              </th>

              <th className="px-3 py-3 text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Holdings</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Avg Buy Price</div>
              </th>

              <th className="px-3 py-3 text-right">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Price</span>
              </th>

              {/* Sortable: Short-Term */}
              <th
                className={`px-3 py-3 text-right cursor-pointer select-none transition-colors ${
                  sortConfig.column === 'stcg'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => handleSort('stcg')}
              >
                <span className="text-xs font-medium inline-flex items-center">
                  Short-Term
                  <SortIcon active={sortConfig.column === 'stcg'} direction={sortConfig.direction} />
                </span>
              </th>

              {/* Sortable: Long-Term */}
              <th
                className={`px-3 py-3 text-right cursor-pointer select-none transition-colors ${
                  sortConfig.column === 'ltcg'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => handleSort('ltcg')}
              >
                <span className="text-xs font-medium inline-flex items-center">
                  Long-Term
                  <SortIcon active={sortConfig.column === 'ltcg'} direction={sortConfig.direction} />
                </span>
              </th>

              <th className="px-3 py-3 text-right">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Amount to Sell</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {displayedHoldings.map((asset) => {
              const isSelected = selectedIds.includes(asset.id)

              return (
                <tr
                  key={asset.id}
                  className={`holdings-row border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => onSelect(asset.id)}
                >
                  <td className="px-4 sm:px-5 py-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(asset.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${asset.name}`}
                        id={`checkbox-${asset.id}`}
                      />
                      <CryptoLogo 
                        color={asset.logoColor} 
                        letter={asset.logoLetter} 
                        logoUrl={asset.logoUrl}
                        alt={`${asset.name} logo`} 
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{asset.name}</div>
                        <div className="text-xs text-gray-400">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {asset.holdings.toLocaleString()} {asset.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      ${asset.avgBuyPrice.toLocaleString()}/{asset.symbol}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-right">
                    <PriceCell price={asset.currentPrice} />
                  </td>

                  <td className="px-3 py-3 text-right">
                    <GainCell value={asset.stcg.gain} units={asset.stcg.units} symbol={asset.symbol} />
                  </td>

                  <td className="px-3 py-3 text-right">
                    <GainCell value={asset.ltcg.gain} units={asset.ltcg.units} symbol={asset.symbol} />
                  </td>

                  <td className="px-3 py-3 text-right">
                    {isSelected ? (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {asset.holdings.toLocaleString()} {asset.symbol}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 5 && (
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onToggleShowAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            id="toggle-view-all"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        </div>
      )}
    </div>
  )
}
