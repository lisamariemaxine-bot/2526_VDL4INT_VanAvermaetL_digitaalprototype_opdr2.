'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export default function GoogleAnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string, {
        page_path: pathname,
      })
    }
  }, [pathname])

  return null
}
