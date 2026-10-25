// Shared types + helpers for the public student portfolio (/u/<username>).
// Pure module (no "use client") so both the server page and the client view can import it.

import type {
  Project, Experience, Education, Skill, Certification, OpenTo,
  Achievement as CareerAchievement,
} from "@/lib/career-profile"

/** Career Profile items as the public API sends them (no is_public / sort_order). */
type Pub<T> = Omit<T, "is_public" | "sort_order">
export type PublicEducation = Omit<Pub<Education>, "show_score"> & {
  /** Degree at the student's own (institution-registered) college. */
  college_verified: boolean
}
export type PublicSkill = Pub<Skill> & { verified_by: string | null }

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
export interface Achievement { title: string; icon_color: string | null; completed_at: string | null; certificate_uid?: string | null }
export interface PublicCertificate {
  certificate_uid: string; kind: "course" | "domain"; title: string
  issuer: string; issued_at: string | null; pdf_url: string | null
}
export interface PublicProfile {
  username: string; name: string; avatar: string | null
  branch: string | null; passout_year: number | null
  college_name: string | null; college_logo_url: string | null
  points: number; streak: number; longest_streak: number
  linkedin: string | null; github: string | null
  coding_profiles: CodingProfile[]
  /** CareerEzi coding-practice problems solved (distinct accepted). Optional for older API. */
  problems_solved?: number
  /** Issued (non-revoked) certificates, newest first. Optional for older API. */
  certificates?: PublicCertificate[]
  completed_courses: Achievement[]
  completed_domains: Achievement[]

  // Career Profile — each section is absent when the student hid it.
  headline?: string | null
  location?: string | null
  open_to?: OpenTo | null
  about?: { about: string | null; languages: string | null; website: string | null }
  projects?: Pub<Project>[]
  experience?: Pub<Experience>[]
  education?: PublicEducation[]
  skills?: PublicSkill[]
  achievements?: Pub<CareerAchievement>[]
  external_certifications?: Pub<Certification>[]
}


export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
const ORIGIN = API.replace(/\/api$/, "")

/** Resolve possibly-relative media paths (avatars, logos) against the API origin. */
export function media(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (/^https?:\/\//.test(url)) return url
  return `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`
}
