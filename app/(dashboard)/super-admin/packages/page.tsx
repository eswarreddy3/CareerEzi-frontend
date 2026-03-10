"use client"

import { useState, useEffect } from "react"
import { Check, Pencil, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface Package {
  id: number
  name: string
  plan_type: string
  price: number
  features: string[]
  is_active: boolean
}

const planStyle: Record<string, { label: string; color: string; borderColor: string; badge?: string }> = {
  free:       { label: "Free",        color: "text-muted-foreground", borderColor: "border-border" },
  base:       { label: "Base Plan",   color: "text-blue-400",         borderColor: "border-blue-500/30" },
  pro:        { label: "Pro Plan",    color: "text-primary",          borderColor: "border-primary/30", badge: "Most Popular" },
  enterprise: { label: "Enterprise",  color: "text-purple-400",       borderColor: "border-purple-500/30" },
}

function formatPrice(price: number, planType: string): string {
  if (planType === "enterprise") return "Custom"
  if (price === 0) return "Free"
  return `₹${price.toLocaleString("en-IN")}`
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get("/super-admin/packages")
      .then((r) => setPackages(r.data))
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setLoading(false))
  }, [])

  const startEdit = (pkg: Package) => {
    setEditing(pkg.id)
    setEditPrice(String(pkg.price))
  }

  const handleSave = async (pkg: Package) => {
    const price = parseFloat(editPrice)
    if (isNaN(price) || price < 0) {
      toast.error("Enter a valid price")
      return
    }
    setSaving(true)
    try {
      await api.patch(`/super-admin/packages/${pkg.id}`, { price })
      setPackages((prev) => prev.map((p) => p.id === pkg.id ? { ...p, price } : p))
      toast.success(`${pkg.name} price updated`)
      setEditing(null)
    } catch {
      toast.error("Failed to update package")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Packages</h1>
          <p className="text-muted-foreground mt-1">Manage pricing plans for colleges</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} className="h-96 animate-pulse bg-secondary/20" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Packages</h1>
        <p className="text-muted-foreground mt-1">Manage pricing plans for colleges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const style = planStyle[pkg.plan_type] ?? { label: pkg.name, color: "text-foreground", borderColor: "border-border" }
          const isEditing = editing === pkg.id
          const isEnterprise = pkg.plan_type === "enterprise"

          return (
            <GlassCard
              key={pkg.id}
              className={cn(
                "relative border flex flex-col",
                style.borderColor,
                pkg.plan_type === "pro" && "shadow-[0_0_20px_rgba(0,212,200,0.15)]"
              )}
            >
              {style.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-xs px-3">
                    {style.badge}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h2 className={cn("text-xl font-bold font-serif", style.color)}>
                  {pkg.name}
                </h2>
                {!isEnterprise && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => isEditing ? setEditing(null) : startEdit(pkg)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="mb-1">
                <span className={cn("text-3xl font-bold", isEnterprise ? "text-purple-400" : "text-foreground")}>
                  {formatPrice(pkg.price, pkg.plan_type)}
                </span>
                {pkg.price > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">/student/year</span>
                )}
              </div>

              {isEnterprise && (
                <p className="text-xs text-muted-foreground mb-3">Contact us for pricing</p>
              )}

              <div className="space-y-2 mt-3 flex-1">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm">
                    <div className={cn(
                      "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                      isEnterprise ? "bg-purple-500/20 text-purple-400" : "bg-primary/20 text-primary"
                    )}>
                      {isEnterprise
                        ? <Sparkles className="h-2.5 w-2.5" />
                        : <Check className="h-2.5 w-2.5" />
                      }
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-border space-y-2 mt-4">
                  <p className="text-xs text-muted-foreground">Edit price (₹/student/year):</p>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="0"
                  />
                  <Button
                    size="sm"
                    disabled={saving}
                    className="w-full bg-primary hover:brightness-110 text-primary-foreground"
                    onClick={() => handleSave(pkg)}
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
