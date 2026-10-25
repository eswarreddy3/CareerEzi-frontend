// Single source of truth for every fact the legal pages state about the operator.
// Change details here — never inline them in the page copy.
//
// TODO(legal): the fields marked ⚠ must be confirmed by the business before launch.
// A named Grievance Officer (IT Intermediary Rules 2021, DPDP Act 2023) is
// deliberately omitted for now — add it back here and in the pages before launch.

export const LEGAL = {
  product: "CareerEzi",
  // ⚠ Confirm the exact registered name (e.g. "Fynity Innovations Private Limited").
  entity: "Fynity Innovations",
  // ⚠ Confirm the full registered office address.
  address: "Chennai, Tamil Nadu, India",
  website: "https://careerezi.com",
  supportEmail: "hello@careerezi.com",
  // ⚠ Create these mailboxes, or point them at an inbox that is actually monitored.
  privacyEmail: "privacy@careerezi.com",
  jurisdiction: "Chennai, Tamil Nadu",
  // Bump TERMS_VERSION whenever Terms or Privacy change materially — users who
  // accepted an older version are asked to accept again.
  effectiveDate: "18 October 2026",
  lastUpdated: "25 October 2026",
} as const

export const TERMS_VERSION = "2026-10-18"

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
] as const

// Tabs shown at the top of the info/legal page shell.
export const SITE_PAGES = [{ href: "/about", label: "About CareerEzi" }, ...LEGAL_LINKS] as const
