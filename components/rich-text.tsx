import { Fragment, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Minimal inline-markdown renderer used for coding-problem descriptions (and
 * anywhere else simple emphasis is needed). Supports **bold**, *italic*, and
 * `inline code`. Line breaks are preserved via `whitespace-pre-line`, so plain
 * text written before markdown was introduced renders exactly as before.
 *
 * No external markdown dependency — matches the codebase's hand-rolled approach.
 */

// **bold** is matched before *italic* so the double-asterisk wins.
const TOKEN = /(\*\*([^*]+?)\*\*|\*([^*]+?)\*|`([^`]+?)`)/g

function parseInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null

  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>)
    if (m[2] !== undefined) {
      out.push(<strong key={key++} className="font-semibold text-foreground">{m[2]}</strong>)
    } else if (m[3] !== undefined) {
      out.push(<em key={key++} className="italic">{m[3]}</em>)
    } else if (m[4] !== undefined) {
      out.push(
        <code key={key++} className="px-1 py-0.5 rounded bg-secondary/70 border border-border text-[0.85em] font-mono">
          {m[4]}
        </code>
      )
    }
    last = TOKEN.lastIndex
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>)
  return out
}

export function RichText({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return <div className={cn("whitespace-pre-line", className)}>{parseInline(text)}</div>
}
