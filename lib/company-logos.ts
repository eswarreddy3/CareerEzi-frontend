// Company-prep logo helpers shared by the list and detail pages.
//
// Only a handful of companies have a logo file in /public/Company_logos; every
// other company shows the first letter of `logo_letter` (or its name) on its
// brand gradient. There is deliberately no remote fallback — the Clearbit logo
// API these pages used to call has been shut down, and name-guessed domains
// could show another company's logo.

// Slug prefix → local logo file. Prefixes let one file serve every hiring
// track of a company (tcs-nqt, tcs-d, tcsprime … all use the TCS logo).
const LOCAL_LOGOS: [prefix: string, src: string][] = [
  ["tcs",       "/Company_logos/tcs_logo.png"],
  ["wipro",     "/Company_logos/wipro_logo.png"],
  ["accenture", "/Company_logos/accenture_logo.png"],
  ["infosys",   "/Company_logos/infosys_logo.png"],
  ["infy",      "/Company_logos/infosys_logo.png"],
  ["amazon",    "/Company_logos/amazon_logo.png"],
]

// The original hand-written seed (seed_company_prep.py) stored pale slate
// gradients for these slugs, which wash out the white letter; override them.
const GRADIENT_OVERRIDES: Record<string, string> = {
  tcs:   "from-blue-700 to-indigo-900",
  wipro: "from-fuchsia-600 to-purple-800",
}

const DEFAULT_GRADIENT = "from-blue-500 to-blue-700"

interface LogoSource {
  slug: string
  name: string
  logo_url?: string | null
  logo_color?: string | null
  logo_letter?: string | null
}

/** Image to show for a company, or null to show the letter instead. */
export function companyLogoSrc(c: LogoSource): string | null {
  if (c.logo_url) return c.logo_url
  const hit = LOCAL_LOGOS.find(([prefix]) => c.slug === prefix || c.slug.startsWith(prefix))
  return hit ? hit[1] : null
}

/** Tailwind gradient classes (`from-… to-…`) for the company's brand colour. */
export function companyGradient(c: LogoSource): string {
  return GRADIENT_OVERRIDES[c.slug] ?? c.logo_color ?? DEFAULT_GRADIENT
}

/** Always a single character, even if the DB holds something longer (e.g. "IBM"). */
export function companyLetter(c: LogoSource): string {
  return (c.logo_letter?.trim() || c.name.trim() || "?").charAt(0).toUpperCase()
}
