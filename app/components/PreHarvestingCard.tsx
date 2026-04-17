import { GainsData, getNetGains, formatCurrency, formatCompact, formatFull } from '@/app/utils/calculateGains'

type Props = {
  gains: GainsData
}

// Shows compact + tooltip if value >= 1 lakh, otherwise plain format
function SmartVal({ value, className }: { value: number; className?: string }) {
  const abs = Math.abs(value)
  const needsCompact = abs >= 100000

  if (!needsCompact) {
    return <span className={className}>{formatCurrency(value)}</span>
  }

  return (
    <div className={`relative group inline-block ${className ?? ''}`}>
      <span>{formatCompact(value)}</span>
      <div className="tooltip-box absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20 shadow-lg">
        {formatFull(value)}
      </div>
    </div>
  )
}

export default function PreHarvestingCard({ gains }: Props) {
  const { stcgNet, ltcgNet, total } = getNetGains(gains)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex-1">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Pre Harvesting</h2>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right font-medium">Short-term</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right font-medium">Long-term</div>
      </div>

      {/* Profits */}
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">Profits</div>
        <div className="text-sm text-gray-900 dark:text-gray-100 text-right">
          <SmartVal value={gains.stcg.profits} />
        </div>
        <div className="text-sm text-gray-900 dark:text-gray-100 text-right">
          <SmartVal value={gains.ltcg.profits} />
        </div>
      </div>

      {/* Losses — shown as negative */}
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">Losses</div>
        <div className="text-sm text-gray-900 dark:text-gray-100 text-right">
          <SmartVal value={-gains.stcg.losses} />
        </div>
        <div className="text-sm text-gray-900 dark:text-gray-100 text-right">
          <SmartVal value={-gains.ltcg.losses} />
        </div>
      </div>

      {/* Net Capital Gains */}
      <div className="grid grid-cols-3 gap-2 py-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">Net Capital Gains</div>
        <div className={`text-sm font-medium text-right ${stcgNet >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-500'}`}>
          <SmartVal value={stcgNet} />
        </div>
        <div className={`text-sm font-medium text-right ${ltcgNet >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-500'}`}>
          <SmartVal value={ltcgNet} />
        </div>
      </div>

      {/* Realised total */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Realised Capital Gains:
        </span>
        <span className={`text-xl font-bold ${total >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
          <SmartVal value={total} />
        </span>
      </div>
    </div>
  )
}
