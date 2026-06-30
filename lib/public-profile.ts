// Shared types + helpers for the public student portfolio (/u/<username>).
// Pure module (no "use client") so both the server page and the client view can import it.

export interface CodingStats {
  name?: string | null; avatar_url?: string | null; bio?: string | null
  country?: string | null; school?: string | null; level?: number | null
  public_repos?: number; followers?: number; total_stars?: number
  top_languages?: string[]
  top_repos?: { name: string; stars: number; language: string | null; url: string }[]
  ranking?: number | null; total_solved?: number
  easy_solved?: number; easy_total?: number
  medium_solved?: number; medium_total?: number
  hard_solved?: number; hard_total?: number
  contest_rating?: number | null
  badges?: { name: string; stars: number; solved: number; total: number }[]
}
export interface CodingProfile {
  platform: string; username: string; profile_url: string | null; stats: CodingStats | null
}
export interface Achievement { title: string; icon_color: string | null; completed_at: string | null }
export interface PublicProfile {
  username: string; name: string; avatar: string | null
  branch: string | null; passout_year: number | null
  college_name: string | null; college_logo_url: string | null
  points: number; streak: number; longest_streak: number
  linkedin: string | null; github: string | null
  coding_profiles: CodingProfile[]
  completed_courses: Achievement[]
  completed_domains: Achievement[]
}

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
const ORIGIN = API.replace(/\/api$/, "")

/** Resolve possibly-relative media paths (avatars, logos) against the API origin. */
export function media(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (/^https?:\/\//.test(url)) return url
  return `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`
}
