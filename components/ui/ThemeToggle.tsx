// components/ui/ThemeToggle.tsx
"use client"

import { useTheme } from "next-themes"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 bg-brand-contrast/18 text-brand-contrast cursor-pointer"
    >
      {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  )
}