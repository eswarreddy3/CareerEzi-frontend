"use client"

import { useAuthStore, type UserRole } from "@/store/authStore"

export function useAuth() {
  const { token, user, clearAuth } = useAuthStore()

  const isAuthenticated = !!token && !!user

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  }

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role ?? null,
    hasRole,
    logout: clearAuth,
  }
}
