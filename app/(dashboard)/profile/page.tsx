"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { ActivityFeed } from "@/components/activity-feed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type PasswordForm = z.infer<typeof passwordSchema>

const mockActivities = [
  { id: "1", type: "mcq" as const, title: "Python Quiz Completed", description: "Scored 9/10", timestamp: "2 hours ago", points: 50 },
  { id: "2", type: "coding" as const, title: "Solved Two Sum", description: "Easy — Arrays", timestamp: "Yesterday", points: 100 },
  { id: "3", type: "streak" as const, title: "Streak Extended!", description: "12-day streak maintained", timestamp: "Today", points: 25 },
  { id: "4", type: "lesson" as const, title: "SQL Joins Lesson", description: "Completed Module 3", timestamp: "2 days ago", points: 75 },
  { id: "5", type: "achievement" as const, title: "First Week Champion", description: "7-day streak badge", timestamp: "3 days ago", points: 200 },
]

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    streakAlerts: true,
    assignmentReminders: false,
  })

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onPasswordSave = async (data: PasswordForm) => {
    try {
      await api.patch("/student/profile", {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      toast.success("Password updated successfully")
      reset()
    } catch (err: any) {
      toast.error("Failed to update password", {
        description: err?.response?.data?.message || "Please try again",
      })
    }
  }

  const onNotificationSave = async () => {
    try {
      await api.patch("/student/profile", { notifications })
      toast.success("Notification settings saved")
    } catch {
      toast.error("Failed to save notification settings")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Profile Info ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center teal-glow">
                  <span className="text-3xl font-bold text-primary font-serif">{initials}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all">
                  <Pencil className="h-3.5 w-3.5 text-primary-foreground" />
                </button>
              </div>

              <h2 className="text-xl font-bold font-serif text-foreground">
                {user?.name || "—"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>

              <Badge
                variant="outline"
                className="mt-2 bg-primary/10 border-primary/30 text-primary"
              >
                {user?.role === "student"
                  ? "Student"
                  : user?.role === "college_admin"
                  ? "College Admin"
                  : "Super Admin"}
              </Badge>
            </div>

            {/* Info rows */}
            <div className="mt-6 space-y-3">
              {[
                { label: "College", value: user?.college_name || "—" },
                { label: "Branch", value: user?.branch || "—" },
                { label: "Section", value: user?.section ? `Section ${user.section}` : "—" },
                { label: "Roll No.", value: user?.roll_number || "—" },
                { label: "Pass-out Year", value: user?.passout_year || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── RIGHT: Tabs ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <Tabs defaultValue="account">
              <TabsList className="bg-secondary/50 mb-6">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Account tab — change password */}
              <TabsContent value="account">
                <div className="max-w-sm">
                  <h3 className="font-semibold font-serif text-foreground mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handleSubmit(onPasswordSave)} className="space-y-4">
                    {/* Current password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("current_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="text-xs text-destructive">{errors.current_password.message}</p>
                      )}
                    </div>

                    {/* New password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("new_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.new_password && (
                        <p className="text-xs text-destructive">{errors.new_password.message}</p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter new password"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("confirm_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="bg-primary hover:brightness-110 text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Save Password
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* Notifications tab */}
              <TabsContent value="notifications">
                <h3 className="font-semibold font-serif text-foreground mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4 max-w-sm">
                  {[
                    {
                      key: "emailReminders" as const,
                      label: "Email Reminders",
                      desc: "Get daily learning reminders via email",
                    },
                    {
                      key: "streakAlerts" as const,
                      label: "Streak Alerts",
                      desc: "Be notified before your streak breaks",
                    },
                    {
                      key: "assignmentReminders" as const,
                      label: "Assignment Reminders",
                      desc: "Reminders for upcoming assignment deadlines",
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, [key]: checked }))
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  ))}

                  <Button
                    onClick={onNotificationSave}
                    className="bg-primary hover:brightness-110 text-primary-foreground"
                  >
                    Save Preferences
                  </Button>
                </div>
              </TabsContent>

              {/* Activity tab */}
              <TabsContent value="activity">
                <div className="max-h-[400px] overflow-y-auto">
                  <ActivityFeed activities={mockActivities} />
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
