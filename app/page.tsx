"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function Home() {
  const router = useRouter()
  const { token, user } = useAuthStore()

  useEffect(() => {
    if (!token || !user) {
      router.replace("/login")
      return
    }
    if (user.first_login) {
      router.replace("/onboarding")
      return
    }
    const dest =
      user.role === "super_admin"
        ? "/super-admin"
        : user.role === "college_admin"
        ? "/admin"
        : "/dashboard"
    router.replace(dest)
  }, [token, user, router])

  return null
}
