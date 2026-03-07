import axios from "axios"

const TOKEN_KEY = "fynity_access_token"

function getToken(): string | null {
  // 1. Try plain localStorage key — set synchronously by authStore.setAuth
  if (typeof window !== "undefined") {
    const t = localStorage.getItem(TOKEN_KEY)
    if (t) return t
  }
  return null
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url ?? ""
    const status = error.response?.status
    // Only force-logout on 401 for protected endpoints (not login)
    if (status === 401 && !url.includes("/auth/login") && !url.includes("/auth/refresh")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem("fynity-auth")
        document.cookie = "fynity_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
