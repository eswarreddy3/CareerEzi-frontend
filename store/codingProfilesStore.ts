import { create } from "zustand"
import api from "@/lib/api"
import { toast } from "sonner"

export interface GithubStats {
  name?: string | null
  avatar_url?: string | null
  bio?: string | null
  public_repos?: number
  followers?: number
  following?: number
  total_stars?: number
  top_languages?: string[]
  top_repos?: { name: string; stars: number; language: string | null; url: string }[]
}
export interface LeetcodeStats {
  name?: string | null
  avatar_url?: string | null
  country?: string | null
  ranking?: number | null
  total_solved?: number
  total_questions?: number
  easy_solved?: number; easy_total?: number
  medium_solved?: number; medium_total?: number
  hard_solved?: number; hard_total?: number
  contest_rating?: number | null
  contest_global_ranking?: number | null
}
export interface HackerrankStats {
  name?: string | null
  avatar_url?: string | null
  country?: string | null
  school?: string | null
  level?: number | null
  headline?: string | null
  followers?: number
  total_stars?: number
  badges?: { name: string; stars: number; solved: number; total: number }[]
}
export interface CodingProfile {
  platform: string
  username: string
  profile_url: string | null
  stats: (GithubStats & LeetcodeStats & HackerrankStats) | null
  sync_status: string | null
  sync_error: string | null
  last_synced_at: string | null
}
export interface SupportedPlatform {
  platform: string
  label: string
  official: boolean
  enabled: boolean
}

interface CodingProfilesState {
  profiles: CodingProfile[]
  supported: SupportedPlatform[]
  loaded: boolean
  loading: boolean
  savingPlatform: string | null
  refreshing: boolean
  fetch: (force?: boolean) => Promise<void>
  saveProfile: (platform: string, label: string, username: string) => Promise<boolean>
  removeProfile: (platform: string, label: string) => Promise<void>
  refresh: () => Promise<void>
}

export const useCodingProfilesStore = create<CodingProfilesState>((set, get) => ({
  profiles: [],
  supported: [],
  loaded: false,
  loading: false,
  savingPlatform: null,
  refreshing: false,

  fetch: async (force = false) => {
    if (get().loading) return
    if (get().loaded && !force) return
    set({ loading: true })
    try {
      const res = await api.get("/student/coding-profiles")
      set({ profiles: res.data.profiles, supported: res.data.supported, loaded: true })
    } catch {
      // silent — UI shows empty state
    } finally {
      set({ loading: false })
    }
  },

  saveProfile: async (platform, label, username) => {
    const clean = username.trim().replace(/^@/, "")
    if (!clean) return false
    set({ savingPlatform: platform })
    try {
      const res = await api.put("/student/coding-profiles", { platform, username: clean })
      set((s) => ({ profiles: [...s.profiles.filter((p) => p.platform !== platform), res.data.profile] }))
      if (res.data.warning) toast.error(res.data.warning)
      else toast.success(`${label} connected`)
      return true
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save")
      return false
    } finally {
      set({ savingPlatform: null })
    }
  },

  removeProfile: async (platform, label) => {
    try {
      await api.delete(`/student/coding-profiles/${platform}`)
      set((s) => ({ profiles: s.profiles.filter((p) => p.platform !== platform) }))
      toast.success(`${label} disconnected`)
    } catch {
      toast.error("Failed to remove")
    }
  },

  refresh: async () => {
    set({ refreshing: true })
    try {
      const res = await api.post("/student/coding-profiles/refresh")
      set({ profiles: res.data.profiles })
      toast.success("Profiles refreshed")
    } catch {
      toast.error("Failed to refresh")
    } finally {
      set({ refreshing: false })
    }
  },
}))
