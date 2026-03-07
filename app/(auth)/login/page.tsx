"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, FlaskConical } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore, type User } from "@/store/authStore"
import api from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type LoginForm = z.infer<typeof loginSchema>

// ── Mock users for dev testing ────────────────────────────────────────────────
const DEV_USERS: { label: string; color: string; user: User; token: string }[] = [
  {
    label: "Student",
    color: "border-primary/40 text-primary hover:bg-primary/10",
    token: "dev-student-token",
    user: {
      id: "u1",
      name: "Rahul Kumar",
      email: "rahul@college.edu",
      role: "student",
      college_id: "c1",
      college_name: "VIT Vellore",
      first_login: false,
      branch: "CSE",
      section: "A",
      roll_number: "21CS006",
      passout_year: "2025",
      phone: "9876543210",
      points: 4200,
      streak: 12,
    },
  },
  {
    label: "College Admin",
    color: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
    token: "dev-admin-token",
    user: {
      id: "u2",
      name: "Dr. Priya Menon",
      email: "priya@vit.edu",
      role: "college_admin",
      college_id: "c1",
      college_name: "VIT Vellore",
      first_login: false,
      points: 0,
      streak: 0,
    },
  },
  {
    label: "Super Admin",
    color: "border-purple-500/40 text-purple-400 hover:bg-purple-500/10",
    token: "dev-super-token",
    user: {
      id: "u3",
      name: "Eswar Reddy",
      email: "eswar@fynity.in",
      role: "super_admin",
      first_login: false,
      points: 0,
      streak: 0,
    },
  },
  {
    label: "First-Login Student",
    color: "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10",
    token: "dev-firstlogin-token",
    user: {
      id: "u4",
      name: "Ananya Gupta",
      email: "ananya@college.edu",
      role: "student",
      college_id: "c1",
      college_name: "SRM Institute",
      first_login: true,
      points: 0,
      streak: 0,
    },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data)
      const { token, refreshToken, user } = res.data
      setAuth(token, refreshToken, user)
      redirectByUser(user)
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid email or password"
      toast.error("Sign in failed", { description: message })
    }
  }

  const redirectByUser = (user: User) => {
    if (user.first_login) return router.replace("/onboarding")
    if (user.role === "super_admin") return router.replace("/super-admin")
    if (user.role === "college_admin") return router.replace("/admin")
    router.replace("/dashboard")
  }

  const handleDevLogin = (entry: (typeof DEV_USERS)[number]) => {
    setAuth(entry.token, `${entry.token}-refresh`, entry.user)
    toast.success(`Logged in as ${entry.label}`)
    redirectByUser(entry.user)
  }

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-teal-dark flex items-center justify-center teal-glow mb-4">
            <span className="text-2xl font-bold text-primary-foreground font-serif">F</span>
          </div>
          <h1 className="text-2xl font-bold font-serif gradient-text">Fynity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your placement journey starts here
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@college.edu"
              autoComplete="email"
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:brightness-110 text-primary-foreground font-semibold transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Sign In
          </Button>
        </form>

        {/* ── Dev mock login ──────────────────────────────────────────────── */}
        <div className="mt-6 pt-5 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Dev shortcuts — no backend needed
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEV_USERS.map((entry) => (
              <button
                key={entry.label}
                onClick={() => handleDevLogin(entry)}
                className={`text-xs py-2 px-3 rounded-lg border transition-all font-medium ${entry.color}`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
