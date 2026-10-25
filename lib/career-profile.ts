// Career Profile — the single source of a student's portfolio facts.
// Read by the Career Profile page, the resume builder and the public page.
// Backend contract: app/services/career_profile.py (SECTIONS) + routes/career_profile.py.

import api from "@/lib/api"

import type { YM } from "@/lib/ym"
export type { YM }

interface Base { id: number; sort_order: number; is_public: boolean }

export type EducationLevel = "degree" | "pg" | "diploma" | "intermediate" | "ssc" | "other"
export interface Education extends Base {
  level: EducationLevel; institution: string; board: string | null; field: string | null
  start_date: YM | null; end_date: YM | null; is_current: boolean
  score: string | null; score_type: "cgpa" | "percent" | "grade" | null; show_score: boolean
}
export interface Project extends Base {
  title: string; description: string | null; live_url: string | null; repo_url: string | null
  skills: string[]; is_team: boolean; team_size: number | null; role: string | null
  start_date: YM | null; end_date: YM | null; is_ongoing: boolean
  cover_image: string | null; is_featured: boolean
}
export type EmploymentType = "internship" | "full_time" | "part_time" | "freelance" | "contract"
export interface Experience extends Base {
  company: string; role: string; employment_type: EmploymentType | null; location: string | null
  start_date: YM | null; end_date: YM | null; is_current: boolean; description: string | null
}
export type SkillCategory = "language" | "framework" | "tool" | "soft" | "other"
export interface Skill extends Base {
  name: string; category: SkillCategory
  /** Why CareerEzi can vouch for this skill (coding practice, a course, GitHub), or null. Read-only. */
  verified_by?: string | null
}
export type AchievementKind = "hackathon" | "award" | "leadership" | "publication" | "extracurricular" | "other"
export interface Achievement extends Base {
  title: string; kind: AchievementKind; organization: string | null; date: YM | null
  description: string | null; url: string | null
}
export interface Certification extends Base {
  name: string; issuer: string | null; issue_date: YM | null
  credential_id: string | null; credential_url: string | null
}

export type OpenTo = "internship" | "full_time" | "both" | "not_looking"
export interface About {
  headline: string | null; about: string | null; location: string | null; open_to: OpenTo | null
  website: string | null; languages: string | null; strengths: string | null; hobbies: string | null
}

export interface SectionItems {
  education: Education; projects: Project; experience: Experience
  skills: Skill; achievements: Achievement; certifications: Certification
}
export type Section = keyof SectionItems
export type AnyItem = SectionItems[Section]

export interface VerifiedCertificate {
  certificate_uid: string; kind: "course" | "domain"; title: string; issuer: string; issued_at: string | null
}

export interface CareerProfile {
  about: About
  education: Education[]; projects: Project[]; experience: Experience[]
  skills: Skill[]; achievements: Achievement[]; certifications: Certification[]
  verified_certificates: VerifiedCertificate[]
  imported_at: string | null
  completeness: { percent: number; missing: string[] }
  public_settings: PublicSettings
}

export type PublicSection =
  | "about" | "projects" | "experience" | "education" | "skills"
  | "achievements" | "certifications" | "coding" | "contact"
export interface PublicSettings { hidden_sections: PublicSection[] }

export const PUBLIC_SECTIONS: { value: PublicSection; label: string; hint?: string }[] = [
  { value: "about", label: "About" },
  { value: "projects", label: "Projects" },
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education" },
  { value: "skills", label: "Skills" },
  { value: "achievements", label: "Achievements" },
  { value: "certifications", label: "Certificates", hint: "CareerEzi and outside certificates" },
  { value: "coding", label: "Coding stats", hint: "Problems solved and GitHub / LeetCode / HackerRank" },
  { value: "contact", label: "LinkedIn & GitHub links" },
]

// Labels live in a pure module so the public page can use them without the API client.
export {
  EDUCATION_LEVELS, EDUCATION_LEVEL_SHORT, EMPLOYMENT_TYPES, SKILL_CATEGORIES,
  ACHIEVEMENT_KINDS, OPEN_TO,
} from "@/lib/career-profile-labels"

// Date helpers live in a pure module so the public page can use them without the API client.
export { formatYM, formatRange, formatDuration } from "@/lib/ym"

// ─── API ────────────────────────────────────────────────────────────────────

export async function fetchCareerProfile(): Promise<CareerProfile> {
  return (await api.get("/student/career-profile")).data
}
export async function saveAbout(data: Partial<About>): Promise<About> {
  return (await api.patch("/student/career-profile/about", data)).data.about
}
export async function savePublicSettings(data: PublicSettings): Promise<PublicSettings> {
  return (await api.put("/student/career-profile/public-settings", data)).data.public_settings
}
export async function createItem<S extends Section>(section: S, data: Partial<SectionItems[S]>): Promise<SectionItems[S]> {
  return (await api.post(`/student/career-profile/${section}`, data)).data.item
}
export async function updateItem<S extends Section>(section: S, id: number, data: Partial<SectionItems[S]>): Promise<SectionItems[S]> {
  return (await api.patch(`/student/career-profile/${section}/${id}`, data)).data.item
}
export async function deleteItem(section: Section, id: number): Promise<void> {
  await api.delete(`/student/career-profile/${section}/${id}`)
}
export async function reorderItems<S extends Section>(section: S, ids: number[]): Promise<SectionItems[S][]> {
  return (await api.put(`/student/career-profile/${section}/order`, { ids })).data.items
}

/** The backend's 400 message, or a fallback. */
export function apiError(err: unknown, fallback = "Something went wrong"): string {
  return (err as any)?.response?.data?.error || fallback
}
