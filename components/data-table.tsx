"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { PaginationBar } from "@/components/pagination-bar"
import { SortButton, ariaSort, compareValues, nextSort, type SortDir, type SortState } from "@/components/sort-button"
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
  /** Makes the header clickable. */
  sortable?: boolean
  /** Key sent to the server / used for comparison (defaults to `key`). */
  sortKey?: string
  /** Client-side sort value (defaults to `row[key]`). */
  sortValue?: (row: T) => unknown
  /** Direction of the first click — use "desc" for numbers where bigger is better. */
  firstDir?: SortDir
}

/** Server-driven mode: `data` is already one page; the parent refetches on every change. */
export interface ServerPaging {
  page: number
  pages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  /** Search box value changes (the parent should debounce before fetching). */
  onSearchChange?: (query: string) => void
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
  defaultSort?: SortState
  server?: ServerPaging
  itemLabel?: string
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
  defaultSort,
  server,
  itemLabel,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("")
  const [localPage, setLocalPage] = useState(1)
  const [localPageSize, setLocalPageSize] = useState(pageSize)
  const [localSort, setLocalSort] = useState<SortState | null>(defaultSort ?? null)

  const sortKeyOf = (col: Column<T>) => col.sortKey ?? String(col.key)
  const sort = server ? server.sort ?? null : localSort

  const filtered = useMemo(() => {
    if (server || !query) return data
    const q = query.toLowerCase()
    return data.filter((row) => searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q)))
  }, [data, query, searchKeys, server])

  const sorted = useMemo(() => {
    if (server || !localSort) return filtered
    const col = columns.find((c) => sortKeyOf(c) === localSort.key)
    if (!col) return filtered
    const value = col.sortValue ?? ((row: T) => row[col.key as keyof T])
    return [...filtered].sort((a, b) => compareValues(value(a), value(b), localSort.dir))
  }, [filtered, localSort, columns, server])

  const size = server ? server.pageSize : localPageSize
  const total = server ? server.total : sorted.length
  const totalPages = server ? server.pages : Math.ceil(sorted.length / size)
  // Clamp: data can shrink under the current page (deletes, new search)
  const page = server ? server.page : Math.min(localPage, Math.max(totalPages, 1))
  const paginated = server ? data : sorted.slice((page - 1) * size, page * size)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (server) server.onSearchChange?.(value)
    else setLocalPage(1)
  }

  const handleSort = (key: string) => {
    const col = columns.find((c) => sortKeyOf(c) === key)
    const next = nextSort(sort ?? { key: "", dir: "asc" }, key, col?.firstDir)
    if (server) server.onSortChange?.(next)
    else { setLocalSort(next); setLocalPage(1) }
  }

  const goToPage = (p: number) => (server ? server.onPageChange(p) : setLocalPage(p))
  const changePageSize = server
    ? server.onPageSizeChange
    : (n: number) => { setLocalPageSize(n); setLocalPage(1) }

  return (
    <div className="space-y-4">
      {/* Search */}
      {(searchKeys.length > 0 || server?.onSearchChange) && (
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
                  aria-sort={col.sortable && sort ? ariaSort(sort, sortKeyOf(col)) : undefined}
                >
                  {col.sortable ? (
                    <SortButton
                      label={col.header}
                      sortKey={sortKeyOf(col)}
                      sort={sort ?? { key: "", dir: "asc" }}
                      onSort={handleSort}
                    />
                  ) : (
                    col.header
                  )}
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
      {(server || !isLoading) && (
        <PaginationBar
          disabled={isLoading}
          page={page}
          pages={totalPages}
          total={total}
          pageSize={size}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
          itemLabel={itemLabel}
        />
      )}
    </div>
  )
}
