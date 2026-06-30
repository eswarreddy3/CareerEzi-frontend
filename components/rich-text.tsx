import { Fragment, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Minimal markdown renderer used for coding-problem descriptions (and anywhere
 * else simple formatting is needed). Supports inline **bold**, *italic*,
 * `inline code`, and `- ` / `* ` bullet lists. Non-list text keeps its line
 * breaks via `whitespace-pre-line`, so plain text written before markdown was
 * introduced renders exactly as before.
 *
 * No external markdown dependency — matches the codebase's hand-rolled approach.
 */

// **bold** is matched before *italic* so the double-asterisk wins.
const TOKEN = /(\*\*([^*]+?)\*\*|\*([^*]+?)\*|`([^`]+?)`)/g
// A bullet line: optional indent, then "- " or "* " (single marker + space).
// The space requirement keeps it from matching *italic* / **bold** at line start.
const BULLET = /^\s*[-*]\s+(.*)$/

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

// Group the text into alternating text-blocks and bullet-lists so that
// consecutive `- ` lines render inside a single <ul>.
function parseBlocks(text: string): ReactNode[] {
  const lines = text.split("\n")
  const blocks: ReactNode[] = []
  let textBuf: string[] = []
  let listBuf: string[] = []
  let key = 0

  const flushText = () => {
    if (!textBuf.length) return
    // Trim leading/trailing blank lines that hug a list, but keep inner breaks.
    const joined = textBuf.join("\n").replace(/^\n+|\n+$/g, "")
    if (joined) blocks.push(<span key={key++} className="whitespace-pre-line">{parseInline(joined)}</span>)
    textBuf = []
  }
  const flushList = () => {
    if (!listBuf.length) return
    blocks.push(
      <ul key={key++} className="list-disc pl-5 space-y-1 my-1">
        {listBuf.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
      </ul>
    )
    listBuf = []
  }

  for (const line of lines) {
    const b = BULLET.exec(line)
    if (b) {
      flushText()
      listBuf.push(b[1])
    } else {
      flushList()
      textBuf.push(line)
    }
  }
  flushText()
  flushList()
  return blocks
}

export function RichText({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return <div className={cn("space-y-1", className)}>{parseBlocks(text)}</div>
}
