"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Column<T> {
  key: keyof T | string
  header: string
  className?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  isLoading?: boolean
  pageSize?: number
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  actions?: (row: T) => React.ReactNode
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  searchPlaceholder = "Search...",
  searchKeys = [],
  isLoading = false,
  pageSize = 10,
  emptyMessage = "No data found",
  emptyIcon,
  actions,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = query
    ? data.filter((row) =>
        searchKeys.some((key) =>
          String(row[key]).toLowerCase().includes(query.toLowerCase())
        )
      )
    : data

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchKeys.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border text-foreground"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={`text-muted-foreground ${col.className ?? ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-muted-foreground text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        <Skeleton className="h-4 w-full bg-secondary/50" />
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <Skeleton className="h-4 w-24 ml-auto bg-secondary/50" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              : paginated.map((row) => (
                  <TableRow
                    key={String(row[keyField])}
                    className="border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={`text-foreground ${col.className ?? ""}`}
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.key as keyof T] ?? "")}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="text-right">{actions(row)}</TableCell>
                    )}
                  </TableRow>
                ))}

            {!isLoading && paginated.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon && (
                      <div className="text-muted-foreground/30">{emptyIcon}</div>
                    )}
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border text-foreground"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border text-foreground"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
