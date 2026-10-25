// 'YYYY' / 'YYYY-MM' date strings used by the Career Profile. Pure — safe on the
// server and on the public page.

/** 'YYYY' or 'YYYY-MM' */
export type YM = string

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** '2025-01' → 'Jan 2025', '2025' → '2025' */
export function formatYM(ym: YM | null | undefined): string {
  if (!ym) return ""
  const [y, m] = ym.split("-")
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y
}

/** 'Jan 2024 – Present' / '2019 – 2021' / '' */
export function formatRange(start: YM | null, end: YM | null, current = false): string {
  const s = formatYM(start), e = current ? "Present" : formatYM(end)
  if (s && e) return `${s} – ${e}`
  return s || e
}

/** '3 yrs 2 mos' / '6 mos' / '' — month-precise only when both ends have months. */
export function formatDuration(start: YM | null, end: YM | null, current = false, now = new Date()): string {
  if (!start) return ""
  const endYM = current ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}` : end
  if (!endYM) return ""
  const [sy, sm] = start.split("-").map(Number)
  const [ey, em] = endYM.split("-").map(Number)
  if (!sm || !em) {
    const years = ey - sy
    return years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : ""
  }
  const months = (ey - sy) * 12 + (em - sm) + 1          // inclusive: Jan–Jan is 1 month
  if (months <= 0) return ""
  const y = Math.floor(months / 12), m = months % 12
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ")
}
