'use client'

import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 h-14 flex items-center justify-between">
        {/* KoinX Logo */}
        <div className="flex items-center gap-1">
          <Image src="/Logo.svg" alt="KoinX Logo" width={80} height={24} className="h-6 w-auto" />
        </div>

        {/* Nav + theme toggle */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
