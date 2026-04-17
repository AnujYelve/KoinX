import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tax Loss Harvesting | KoinX',
  description: 'Optimise your crypto portfolio with tax loss harvesting. Reduce your tax liability by offsetting gains with losses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-950 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
