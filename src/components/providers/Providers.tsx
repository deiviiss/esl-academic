'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '../dark-mode/theme-provider'

interface ProviderProps {
  children: React.ReactNode
}

export const Providers = ({ children }: ProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}
