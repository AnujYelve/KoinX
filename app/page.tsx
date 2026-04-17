'use client'

import { useEffect, useState } from 'react'
import Header from './components/Header'
import DisclaimerAccordion from './components/DisclaimerAccordion'
import PreHarvestingCard from './components/PreHarvestingCard'
import AfterHarvestingCard from './components/AfterHarvestingCard'
import HoldingsTable from './components/HoldingsTable'
import { GainsData, Holding, calculateAfterHarvesting, getNetGains } from './utils/calculateGains'


const howItWorksSteps = [
  'See your capital gains for FY 2024-25 in the left card',
  'Check boxes for assets you plan on selling to reduce your tax liability',
  'Instantly see your updated tax liability in the right card',
]

export default function TaxHarvestingPage() {
  const [capitalGains, setCapitalGains] = useState<GainsData | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/capital-gains').then((r) => r.json()),
      fetch('/api/holdings').then((r) => r.json()),
    ])
      .then(([gainsData, holdingsData]) => {
        setCapitalGains(gainsData.capitalGains)
        setHoldings(holdingsData.holdings)
      })
      .catch((err) => console.error('Failed to fetch data:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (selectAll: boolean) => {
    setSelectedIds(selectAll ? holdings.map((h) => h.id) : [])
  }

  const selectedHoldings = holdings.filter((h) => selectedIds.includes(h.id))
  const afterGains = capitalGains
    ? calculateAfterHarvesting(capitalGains, selectedHoldings)
    : null
  const preTotal = capitalGains ? getNetGains(capitalGains).total : 0

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Header />

      <main className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6">

        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tax Harvesting</h1>


          <div className="relative group">
            <a
              href="#"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              id="how-it-works-link"
              onClick={(e) => e.preventDefault()}
            >
              How it works?
            </a>


            <div className="tooltip-box how-it-works-tooltip absolute left-0 top-full mt-2 w-64 sm:w-72 bg-black dark:bg-white-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none z-30">

              <div className="absolute -top-2 left-4 w-3 h-3 bg-black text-white dark:bg-white-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45" />

              <ul className="space-y-2 mb-3">
                {howItWorksSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white bg-black dark:bg-white-800 dark:text-black-300">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-white bg-black dark:text-black-800 border-t border-gray-100 dark:border-gray-700 pt-2">
                <span className="font-semibold text-white dark:text-black-300">Pro tip:</span>{' '}
                Experiment with different combinations of your holdings to optimize your tax liability
              </p>
            </div>
          </div>
        </div>

        <DisclaimerAccordion />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Loading...</div>
          </div>
        ) : (
          <>
            {capitalGains && afterGains && (
              <div className="flex flex-col md:flex-row gap-4 mb-5">
                <PreHarvestingCard gains={capitalGains} />
                <AfterHarvestingCard gains={afterGains} preTotal={preTotal} />
              </div>
            )}

            <HoldingsTable
              holdings={holdings}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              showAll={showAll}
              onToggleShowAll={() => setShowAll((prev) => !prev)}
            />
          </>
        )}
      </main>
    </div>
  )
}
