"use client"

import { useState } from "react"
import { Check, Pencil } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PackagePlan {
  id: string
  name: string
  price: string
  duration: string
  colleges: number
  color: string
  borderColor: string
  features: { label: string; included: boolean }[]
}

const packages: PackagePlan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    duration: "/forever",
    colleges: 3,
    color: "text-muted-foreground",
    borderColor: "border-border",
    features: [
      { label: "Up to 100 students", included: true },
      { label: "Basic MCQ practice", included: true },
      { label: "5 coding problems/month", included: true },
      { label: "Company prep resources", included: false },
      { label: "Domain programs", included: false },
      { label: "Analytics dashboard", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "₹49,999",
    duration: "/year",
    colleges: 8,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    features: [
      { label: "Up to 500 students", included: true },
      { label: "Full MCQ bank", included: true },
      { label: "Unlimited coding problems", included: true },
      { label: "Company prep resources", included: true },
      { label: "Domain programs", included: false },
      { label: "Analytics dashboard", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹99,999",
    duration: "/year",
    colleges: 22,
    color: "text-primary",
    borderColor: "border-primary/30",
    features: [
      { label: "Up to 2,000 students", included: true },
      { label: "Full MCQ bank", included: true },
      { label: "Unlimited coding problems", included: true },
      { label: "Company prep resources", included: true },
      { label: "Domain programs", included: true },
      { label: "Analytics dashboard", included: true },
      { label: "Priority support", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    duration: "",
    colleges: 15,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    features: [
      { label: "Unlimited students", included: true },
      { label: "Full MCQ bank", included: true },
      { label: "Unlimited coding problems", included: true },
      { label: "Company prep resources", included: true },
      { label: "Domain programs", included: true },
      { label: "Analytics dashboard", included: true },
      { label: "Priority support", included: true },
    ],
  },
]

export default function PackagesPage() {
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Packages</h1>
        <p className="text-muted-foreground mt-1">Manage pricing plans for colleges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <GlassCard
            key={pkg.id}
            className={cn(
              "relative border",
              pkg.id === "pro" ? `${pkg.borderColor} shadow-[0_0_20px_rgba(0,212,200,0.15)]` : pkg.borderColor
            )}
          >
            {pkg.id === "pro" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground text-xs px-3">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-xl font-bold font-serif", pkg.color)}>
                {pkg.name}
              </h2>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setEditing(editing === pkg.id ? null : pkg.id)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold text-foreground">{pkg.price}</span>
              <span className="text-sm text-muted-foreground">{pkg.duration}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              <span className={cn("font-semibold", pkg.color)}>{pkg.colleges}</span> colleges using this package
            </p>

            <div className="space-y-2">
              {pkg.features.map(({ label, included }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                      included
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <span className={included ? "text-foreground" : "text-muted-foreground line-through"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {editing === pkg.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Edit price:</p>
                <input
                  defaultValue={pkg.price}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                />
                <Button
                  size="sm"
                  className="w-full bg-primary hover:brightness-110 text-primary-foreground"
                  onClick={() => {
                    setEditing(null)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
