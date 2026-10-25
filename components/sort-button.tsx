"use client"

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortDir = "asc" | "desc"
export interface SortState { key: string; dir: SortDir }

/** Clicking the active column flips direction; a new column starts at `firstDir`. */
export function nextSort(current: SortState, key: string, firstDir: SortDir = "asc"): SortState {
  return current.key === key
    ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
    : { key, dir: firstDir }
}

/** Compares nullable values with nulls last in both directions (matches the backend). */
export function compareValues(a: unknown, b: unknown, dir: SortDir): number {
  const aNull = a === null || a === undefined || a === ""
  const bNull = b === null || b === undefined || b === ""
  if (aNull || bNull) return aNull === bNull ? 0 : aNull ? 1 : -1
  const cmp = typeof a === "number" && typeof b === "number"
    ? a - b
    : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" })
  return dir === "asc" ? cmp : -cmp
}

export function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3 w-3 ml-1 opacity-30" />
  return dir === "asc"
    ? <ChevronUp className="h-3 w-3 ml-1 text-primary" />
    : <ChevronDown className="h-3 w-3 ml-1 text-primary" />
}

export function ariaSort(sort: SortState, key: string): "ascending" | "descending" | undefined {
  if (sort.key !== key) return undefined
  return sort.dir === "asc" ? "ascending" : "descending"
}

interface SortButtonProps {
  label: React.ReactNode
  sortKey: string
  sort: SortState
  onSort: (key: string) => void
  align?: "left" | "right"
  className?: string
}

/** Clickable column header label with a direction indicator. Put `ariaSort(...)` on the enclosing <th>. */
export function SortButton({ label, sortKey, sort, onSort, align = "left", className }: SortButtonProps) {
  const active = sort.key === sortKey
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        "inline-flex items-center whitespace-nowrap transition-colors hover:text-foreground",
        active && "text-foreground",
        align === "right" && "ml-auto",
        className,
      )}
    >
      {label} <SortIcon active={active} dir={sort.dir} />
    </button>
  )
}
