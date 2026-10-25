"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

/** First, last and current±delta pages with "gap" markers — never one button per page. */
export function pageWindow(page: number, pages: number, delta = 1): (number | "gap")[] {
  const out: (number | "gap")[] = []
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= delta) out.push(p)
    else if (out[out.length - 1] !== "gap") out.push("gap")
  }
  return out
}

interface PaginationBarProps {
  page: number
  pages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  /** Shows a rows-per-page picker when provided. */
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  disabled?: boolean
  /** Noun for the "Showing 1–25 of 300 …" label. */
  itemLabel?: string
  className?: string
}

export function PaginationBar({
  page,
  pages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  disabled = false,
  itemLabel,
  className,
}: PaginationBarProps) {
  if (total === 0) return null
  const sizes = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((x, y) => x - y)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground", className)}>
      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          Showing {from.toLocaleString()}–{to.toLocaleString()} of {total.toLocaleString()}
          {itemLabel ? ` ${itemLabel}` : ""}
        </span>
        {onPageSizeChange && (
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))} disabled={disabled}>
            <SelectTrigger className="h-8 w-[110px] bg-secondary/50 border-border text-foreground text-xs" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n} / page</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {pages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border text-foreground"
            onClick={() => onPageChange(page - 1)}
            disabled={disabled || page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pageWindow(page, pages).map((p, i) =>
            p === "gap" ? (
              <span key={`gap-${i}`} className="px-1 select-none">…</span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className={cn("h-8 min-w-8 px-2 tabular-nums", p !== page && "border-border text-foreground")}
                onClick={() => onPageChange(p)}
                disabled={disabled}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border text-foreground"
            onClick={() => onPageChange(page + 1)}
            disabled={disabled || page >= pages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      )}
    </div>
  )
}
