// Display labels for Career Profile enums. Pure — safe on the public page.

import type { EducationLevel, EmploymentType, SkillCategory, AchievementKind, OpenTo } from "@/lib/career-profile"

export const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: "degree", label: "Degree (B.Tech / B.E. / B.Sc …)" },
  { value: "pg", label: "Post-graduation (M.Tech / MBA / MCA …)" },
  { value: "diploma", label: "Diploma" },
  { value: "intermediate", label: "Intermediate / 12th" },
  { value: "ssc", label: "SSC / 10th" },
  { value: "other", label: "Other" },
]
export const EDUCATION_LEVEL_SHORT: Record<EducationLevel, string> = {
  degree: "Degree", pg: "Post-graduation", diploma: "Diploma",
  intermediate: "Intermediate", ssc: "SSC", other: "Education",
}
export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "internship", label: "Internship" }, { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" }, { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
]
export const SKILL_CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "language", label: "Languages" }, { value: "framework", label: "Frameworks & libraries" },
  { value: "tool", label: "Tools & platforms" }, { value: "soft", label: "Soft skills" },
  { value: "other", label: "Other" },
]
export const ACHIEVEMENT_KINDS: { value: AchievementKind; label: string }[] = [
  { value: "hackathon", label: "Hackathon" }, { value: "award", label: "Award" },
  { value: "leadership", label: "Leadership / club role" }, { value: "publication", label: "Publication" },
  { value: "extracurricular", label: "Extracurricular" }, { value: "other", label: "Other" },
]
export const OPEN_TO: { value: OpenTo; label: string }[] = [
  { value: "internship", label: "Internships" }, { value: "full_time", label: "Full-time roles" },
  { value: "both", label: "Internships & full-time" }, { value: "not_looking", label: "Not looking right now" },
]

