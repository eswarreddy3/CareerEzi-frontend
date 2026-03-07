import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor — attach Bearer token from Zustand store
api.interceptors.request.use((config) => {
  // Read token from persisted Zustand state in localStorage
  try {
    const raw = localStorage.getItem("fynity-auth")
    if (raw) {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch {
    // localStorage unavailable (SSR) — skip
  }
  return config
})

// Response interceptor — handle 401 by clearing auth + redirecting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("fynity-auth")
        document.cookie = "fynity_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      } catch {
        // ignore
      }
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
