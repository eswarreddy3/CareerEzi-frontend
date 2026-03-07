"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  ClipboardList,
  Code2,
  Building2,
  Layers,
  Trophy,
  Menu,
  X,
  Flame,
  Star,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice-mcq", label: "Practice MCQ", icon: FileQuestion },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/coding", label: "Coding", icon: Code2 },
  { href: "/company-prep", label: "Company Prep", icon: Building2 },
  { href: "/domain-programs", label: "Domain Programs", icon: Layers },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
]

const adminNavItems = [
  { href: "/admin", label: "Admin Dashboard", icon: Settings },
]

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const items = isAdmin ? [...navItems, ...adminNavItems] : navItems

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden text-foreground"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-dark flex items-center justify-center teal-glow">
              <span className="text-xl font-bold text-primary-foreground font-serif">F</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold font-serif gradient-text">Fynity</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden lg:flex text-muted-foreground hover:text-foreground", isCollapsed && "hidden")}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isCollapsed && "justify-center px-2",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground teal-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className={cn(
          "p-4 border-t border-sidebar-border",
          isCollapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "flex-col gap-2"
          )}>
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-secondary text-foreground">RK</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">Rahul Kumar</p>
                <p className="text-xs text-muted-foreground truncate">CSE - 3rd Year</p>
              </div>
            )}
          </div>
          
          {/* Streak and Points */}
          <div className={cn(
            "flex items-center gap-4 mt-3",
            isCollapsed ? "flex-col gap-2" : "justify-center"
          )}>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500 flame-pulse" />
              <span className="text-sm font-semibold text-foreground">12</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-foreground">4,200</span>
            </div>
          </div>
        </div>

        {/* Collapse button for desktop */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto mb-4 text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(false)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </aside>
    </>
  )
}
