import { GainsData, getNetGains, formatCurrency, formatCompact, formatFull } from '@/app/utils/calculateGains'

type Props = {
  gains: GainsData
  preTotal: number
}


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

export default function AfterHarvestingCard({ gains, preTotal }: Props) {
  const { stcgNet, ltcgNet, total } = getNetGains(gains)
  const savings = preTotal - total

  return (
    <div className="bg-blue-600 rounded-xl p-5 flex-1 text-white">
      <h2 className="text-base font-semibold mb-4">After Harvesting</h2>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div />
        <div className="text-xs text-blue-200 text-right font-medium">Short-term</div>
        <div className="text-xs text-blue-200 text-right font-medium">Long-term</div>
      </div>

      {/* Profits */}
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-blue-500">
        <div className="text-sm text-blue-100">Profits</div>
        <div className="text-sm text-right"><SmartVal value={gains.stcg.profits} /></div>
        <div className="text-sm text-right"><SmartVal value={gains.ltcg.profits} /></div>
      </div>

      {/* Losses */}
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-blue-500">
        <div className="text-sm text-blue-100">Losses</div>
        <div className="text-sm text-right"><SmartVal value={-gains.stcg.losses} /></div>
        <div className="text-sm text-right"><SmartVal value={-gains.ltcg.losses} /></div>
      </div>

      {/* Net Capital Gains */}
      <div className="grid grid-cols-3 gap-2 py-2">
        <div className="text-sm text-blue-100">Net Capital Gains</div>
        <div className="text-sm font-medium text-right"><SmartVal value={stcgNet} /></div>
        <div className="text-sm font-medium text-right"><SmartVal value={ltcgNet} /></div>
      </div>

      {/* Effective Capital Gains */}
      <div className="mt-4 pt-3 border-t border-blue-500 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold">Effective Capital Gains:</span>
        <span className="text-xl font-bold">
          <SmartVal value={total} />
        </span>
      </div>

      {/* Savings message */}
      {savings > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2">
          <span>🎉</span>
          <span className="text-sm font-medium">
            Your taxable capital gains are reduced by{' '}
            <span className="font-bold">
              <SmartVal value={savings} />
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
