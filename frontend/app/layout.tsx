import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load the Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCD-Sahayak Command Center',
  description: 'Real-time Governance Monitoring System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Apply the font to the body */}
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>{children}</body>
    </html>
  )
}