// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './wagmi'   // ← Dòng này phải thêm vào

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FunClub',
  description: 'Fair Launch on Base • 3 ETH Goal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>   {/* ← Bọc toàn bộ children vào đây */}
      </body>
    </html>
  )
}