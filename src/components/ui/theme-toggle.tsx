'use client'

import { useTheme } from './theme-provider'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-11 h-11 rounded-xl border bg-white/80 dark:bg-black/40 backdrop-blur-md border-gray-200 dark:border-gray-700 shadow-lg hover:scale-105 transition-all"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-300" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  )
}


