import { Fragment, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Minimal markdown renderer used for coding-problem descriptions, company-prep
 * content and anywhere else simple formatting is needed. Supports:
 *
 *   - inline **bold**, *italic* and `inline code`
 *   - `- ` / `* ` bullet lists and `1. ` numbered lists
 *   - fenced ``` code blocks (an optional language after the fence is shown as a label)
 *   - simple pipe tables (`| a | b |` rows, with a `|---|---|` separator after the header)
 *
 * Non-list text keeps its line breaks via `whitespace-pre-line`, so plain text
 * written before markdown was introduced renders exactly as before.
 *
 * No external markdown dependency — matches the codebase's hand-rolled approach.
 */

// **bold** is matched before *italic* so the double-asterisk wins. Both may
// wrap `inline code` (whose contents can include `*`, e.g. **`int (*f)(int)`**),
// and their contents are parsed again so that the code renders as code.
// *Italic* must not start with a space, so "2 * R * 3" stays plain text.
const CODE_OR = (rest: string) => `(?:\`[^\`]+\`|${rest})`
const TOKEN = new RegExp(
  `(\\*\\*(${CODE_OR("[^*`]")}+?)\\*\\*` +
  `|\\*(${CODE_OR("[^*\\s`]")}${CODE_OR("[^*`]")}*?)\\*` +
  "|`([^`]+?)`)",
  "g",
)
// A bullet line: optional indent, then "- " or "* " (single marker + space).
// The space requirement keeps it from matching *italic* / **bold** at line start.
const BULLET = /^\s*[-*]\s+(.*)$/
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/
const FENCE = /^\s*```\s*([\w+#-]*)\s*$/
const TABLE_ROW = /^\s*\|.*\|\s*$/
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/

function parseInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = new RegExp(TOKEN) // own lastIndex — parseInline recurses for bold/italic
  let last = 0
  let key = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>)
    if (m[2] !== undefined) {
      out.push(<strong key={key++} className="font-semibold text-foreground">{parseInline(m[2])}</strong>)
    } else if (m[3] !== undefined) {
      out.push(<em key={key++} className="italic">{parseInline(m[3])}</em>)
    } else if (m[4] !== undefined) {
      out.push(
        <code key={key++} className="px-1 py-0.5 rounded bg-secondary/70 border border-border text-[0.85em] font-mono">
          {m[4]}
        </code>
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>)
  return out
}

const splitRow = (line: string) =>
  line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim())

// Group the text into text-blocks, lists, code blocks and tables so that
// consecutive list lines render inside a single <ul>/<ol>.
function parseBlocks(text: string): ReactNode[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let textBuf: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let key = 0

  const flushText = () => {
    if (!textBuf.length) return
    // Trim leading/trailing blank lines that hug a block, but keep inner breaks.
    const joined = textBuf.join("\n").replace(/^\n+|\n+$/g, "")
    if (joined) blocks.push(<span key={key++} className="block whitespace-pre-line">{parseInline(joined)}</span>)
    textBuf = []
  }
  const flushList = () => {
    if (!list) return
    const items = list.items.map((item, i) => <li key={i}>{parseInline(item)}</li>)
    blocks.push(list.ordered
      ? <ol key={key++} className="list-decimal pl-5 space-y-1 my-1">{items}</ol>
      : <ul key={key++} className="list-disc pl-5 space-y-1 my-1">{items}</ul>)
    list = null
  }
  const flushAll = () => { flushText(); flushList() }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // ── fenced code block ──
    const fence = FENCE.exec(line)
    if (fence) {
      flushAll()
      const lang = fence[1]
      const code: string[] = []
      i++
      while (i < lines.length && !FENCE.test(lines[i])) code.push(lines[i++])
      blocks.push(
        <div key={key++} className="my-2 rounded-lg border border-border bg-secondary/50 overflow-hidden">
          {lang && lang !== "text" && (
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-secondary/60">
              {lang}
            </div>
          )}
          <pre className="px-3 py-2.5 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-foreground whitespace-pre">
            <code>{code.join("\n")}</code>
          </pre>
        </div>
      )
      continue
    }

    // ── pipe table (header row immediately followed by a |---| separator) ──
    if (TABLE_ROW.test(line) && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
      flushAll()
      const header = splitRow(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && TABLE_ROW.test(lines[i])) rows.push(splitRow(lines[i++]))
      i--
      blocks.push(
        <div key={key++} className="my-2 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-[0.95em]">
            <thead className="bg-secondary/60">
              <tr>{header.map((h, c) => <th key={c} className="px-3 py-1.5 font-semibold text-foreground">{parseInline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-t border-border">
                  {r.map((cell, c) => <td key={c} className="px-3 py-1.5">{parseInline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // ── lists ──
    const b = BULLET.exec(line)
    const n = b ? null : NUMBERED.exec(line)
    if (b || n) {
      const ordered = !!n
      flushText()
      if (list && list.ordered !== ordered) flushList()
      if (!list) list = { ordered, items: [] }
      list.items.push((b ?? n)![1])
      continue
    }

    flushList()
    textBuf.push(line)
  }
  flushAll()
  return blocks
}

export function RichText({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return <div className={cn("space-y-1", className)}>{parseBlocks(text)}</div>
}
