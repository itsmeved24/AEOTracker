'use client'

import NProgress from 'nprogress'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, trickleSpeed: 120 })

export function RouteProgress() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const origPush = router.push
    const origReplace = router.replace
    router.push = ((href: string, opts?: any) => {
      NProgress.start()
      return origPush(href, opts)
    }) as typeof router.push
    router.replace = ((href: string, opts?: any) => {
      NProgress.start()
      return origReplace(href, opts)
    }) as typeof router.replace

    return () => {
      router.push = origPush
      router.replace = origReplace
    }
  }, [router])

  useEffect(() => {
    NProgress.done()
  }, [pathname])

  return null
}


