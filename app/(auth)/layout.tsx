"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-14 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground font-serif">F</span>
          </div>
          <span className="text-base font-bold font-serif gradient-text">Fynity</span>
        </div>
        <ThemeToggle collapsed />
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
