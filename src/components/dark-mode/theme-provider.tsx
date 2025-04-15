'use client'

import dynamic from 'next/dynamic'
import { type ThemeProviderProps } from 'next-themes'
import * as React from 'react'

const NextThemesProvider = dynamic(
  async () => await import('next-themes').then((e) => e.ThemeProvider),
  {
    ssr: false
  }
)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
