import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Sistema de Usuários',
  description: 'Gerencie usuários de forma rápida, simples e eficiente.',
  icons: '/favicon.ico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 text-neutral-900`}
      >
        {children}
      </body>
    </html>
  )
}
