"use client"

import { use, useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import type { ImperativePanelHandle } from "react-resizable-panels"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play, Send, ChevronLeft, ChevronRight, CheckCircle,
  XCircle, Clock, List, RotateCcw, Loader2, Terminal,
  ChevronDown, ChevronUp, Star, Code2, X, FileText,
  History, ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface Problem {
  id: number
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string | null
  starter_code: Record<string, string>
  points: number
  is_solved?: boolean
  submitted_code?: string | null
  submitted_language?: string | null
}

interface ProblemListItem {
  id: number
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  points: number
  is_solved?: boolean
}

interface Submission {
  id: number
  language: string
  status: string
  runtime_ms: number | null
  submitted_at: string
}

interface TestResult {
  id: number
  input: string
  expectedOutput: string
  actualOutput?: string
  status: "passed" | "failed" | "pending"
  hidden?: boolean
}

type Language = "python" | "java" | "cpp" | "javascript"

const difficultyConfig = {
  Easy:   { cls: "chip chip-success" },
  Medium: { cls: "chip chip-warning" },
  Hard:   { cls: "chip chip-danger"  },
}

const statusColors: Record<string, string> = {
  accepted:      "text-success",
  wrong_answer:  "text-danger",
  runtime_error: "text-streak",
  time_limit:    "text-warning",
}

const statusIcons: Record<string, React.ReactNode> = {
  accepted:      <CheckCircle className="h-3.5 w-3.5" />,
  wrong_answer:  <XCircle className="h-3.5 w-3.5" />,
  runtime_error: <Terminal className="h-3.5 w-3.5" />,
  time_limit:    <Clock className="h-3.5 w-3.5" />,
}

const LANG_LABELS: Record<Language, string> = {
  python:     "Python 3",
  java:       "Java",
  cpp:        "C++",
  javascript: "JavaScript",
}

const DEFAULT_CODE: Record<Language, string> = {
  python:     "# Write your solution here\n",
  java:       "class Solution {\n    // Write your solution here\n}\n",
  cpp:        "// Write your solution here\n",
  javascript: "// Write your solution here\n",
}

function timeAgo(iso: string): string {
  const d    = new Date(iso)
  const now  = new Date()
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs  = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const tabTriggerCls =
  "rounded-none h-10 px-4 text-xs font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors gap-1.5"

function HResizeHandle() {
  return (
    <PanelResizeHandle className="group relative flex items-center justify-center w-[5px] bg-border hover:bg-primary/50 data-[resize-handle-active]:bg-primary transition-colors cursor-col-resize z-10">
      <div className="flex flex-col gap-[4px] pointer-events-none">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="w-[3px] h-[3px] rounded-full bg-muted-foreground/40 group-hover:bg-primary/80 group-data-[resize-handle-active]:bg-white transition-colors" />
        ))}
      </div>
    </PanelResizeHandle>
  )
}

function VResizeHandle({ hidden }: { hidden: boolean }) {
  return (
    <PanelResizeHandle
      disabled={hidden}
      className={cn(
        "group relative flex items-center justify-center h-[5px] transition-colors",
        hidden ? "bg-transparent cursor-default" : "bg-border hover:bg-primary/50 data-[resize-handle-active]:bg-primary cursor-row-resize"
      )}
    >
      {!hidden && (
        <div className="flex flex-row gap-[4px] pointer-events-none">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-muted-foreground/40 group-hover:bg-primary/80 group-data-[resize-handle-active]:bg-white transition-colors" />
          ))}
        </div>
      )}
    </PanelResizeHandle>
  )
}

export default function CodingIDEPage({ params }: { params: Promise<{ module: string; slug: string }> }) {
  const { module: moduleSlug, slug } = use(params)
  const router = useRouter()

  const [problemsList, setProblemsList]     = useState<ProblemListItem[]>([])
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [submissions, setSubmissions]       = useState<Submission[]>([])
  const [loadingProblem, setLoadingProblem] = useState(true)

  const [language, setLanguage]         = useState<Language>("python")
  const [code, setCode]                 = useState(DEFAULT_CODE.python)
  const [activeTab, setActiveTab]       = useState("description")
  const [showProblemList, setShowProblemList] = useState(false)
  const [isRunning, setIsRunning]       = useState(false)
  const [testResults, setTestResults]   = useState<TestResult[]>([])
  const [customInput, setCustomInput]   = useState("")
  const [customOutput, setCustomOutput] = useState("")
  const [consoleTab, setConsoleTab]     = useState<"testcases" | "custom">("testcases")
  const [selectedCase, setSelectedCase] = useState(0)

  const [consoleCollapsed, setConsoleCollapsed] = useState(true)
  const consolePanelRef = useRef<ImperativePanelHandle>(null)

  const currentIndex = useMemo(
    () => problemsList.findIndex(p => p.slug === slug),
    [problemsList, slug]
  )

  /* load problems in this module for drawer + prev/next */
  useEffect(() => {
    api.get(`/coding/modules/${moduleSlug}/problems`)
      .then(res => setProblemsList(res.data.problems ?? []))
      .catch(() => {})
  }, [moduleSlug])

  /* reload when slug changes */
  useEffect(() => {
    if (!slug) return
    setLoadingProblem(true)
    setCurrentProblem(null)
    setSubmissions([])
    setTestResults([])
    setActiveTab("description")
    consolePanelRef.current?.collapse()

    api.get(`/coding/problems/${slug}`)
      .then(res => {
        const p: Problem = res.data
        setCurrentProblem(p)
        if (p.submitted_code && p.submitted_language) {
          const lang = p.submitted_language as Language
          setLanguage(lang)
          setCode(p.submitted_code)
        } else {
          setCode(p.starter_code?.[language] || DEFAULT_CODE[language])
        }
        return api.get(`/coding/problems/${slug}/submissions`)
      })
      .then(res => setSubmissions(res.data))
      .catch(() => toast.error("Failed to load problem"))
      .finally(() => setLoadingProblem(false))
  }, [slug])

  useEffect(() => { setSelectedCase(0) }, [testResults])

  function openConsole() { consolePanelRef.current?.expand() }

  function handleLanguageChange(newLang: Language) {
    setLanguage(newLang)
    if (currentProblem) setCode(currentProblem.starter_code?.[newLang] || DEFAULT_CODE[newLang])
  }

  function handleReset() {
    if (currentProblem) {
      setCode(currentProblem.starter_code?.[language] || DEFAULT_CODE[language])
      toast.info("Editor reset to starter code")
    }
  }

  function handlePrev() {
    if (currentIndex > 0)
      router.push(`/coding/${moduleSlug}/${problemsList[currentIndex - 1].slug}`)
  }

  function handleNext() {
    if (currentIndex < problemsList.length - 1)
      router.push(`/coding/${moduleSlug}/${problemsList[currentIndex + 1].slug}`)
  }

  async function handleRunCode() {
    if (!currentProblem) return
    setIsRunning(true)
    openConsole()

    if (customInput.trim()) {
      setConsoleTab("custom")
      setCustomOutput("Running...")
      try {
        const res = await api.post("/coding/run", {
          problem_slug: currentProblem.slug, language, code,
          custom_input: customInput,
        })
        setCustomOutput(res.data.output || res.data.error || "(no output)")
      } catch {
        setCustomOutput("Error: Failed to run code")
      } finally {
        setIsRunning(false)
      }
    } else {
      setConsoleTab("testcases")
      try {
        const res = await api.post("/coding/run", {
          problem_slug: currentProblem.slug, language, code,
        })
        const results = res.data.test_results ?? []
        setTestResults(results.map((r: any, i: number) => ({
          id: i + 1,
          input: r.input,
          expectedOutput: r.expected,
          actualOutput: r.got,
          status: r.passed ? "passed" : "failed",
        })))
        const allPassed = results.every((r: any) => r.passed)
        if (allPassed) toast.success("All test cases passed!")
        else toast.error("Some test cases failed")
      } catch {
        toast.error("Failed to run code")
      } finally {
        setIsRunning(false)
      }
    }
  }

  async function handleSubmit() {
    if (!currentProblem) return
    setIsRunning(true)
    openConsole()
    setConsoleTab("testcases")
    try {
      const res = await api.post("/coding/submit", {
        problem_slug: currentProblem.slug, language, code,
      })
      const { status, message, test_results, points_awarded, milestone_bonus } = res.data
      if (status === "accepted") {
        const baseDesc = points_awarded > 0 ? `+${points_awarded} points earned!` : message
        toast.success("Solution Accepted!", { description: baseDesc })
        if (milestone_bonus > 0)
          setTimeout(() => toast.success(`Milestone! +${milestone_bonus} pts — 10 problems solved!`), 800)
        setProblemsList(prev => prev.map(p =>
          p.slug === currentProblem.slug ? { ...p, is_solved: true } : p
        ))
        router.refresh()
      } else {
        toast.error(
          status === "runtime_error" ? "Runtime Error"
          : status === "time_limit"  ? "Time Limit Exceeded"
          : "Wrong Answer",
          { description: message }
        )
      }
      if (test_results) {
        setTestResults(test_results.map((r: any, i: number) => ({
          id: i + 1,
          input: r.hidden ? "" : r.input,
          expectedOutput: r.hidden ? "" : r.expected,
          actualOutput: r.got,
          status: r.passed ? "passed" : "failed",
          hidden: r.hidden ?? false,
        })))
      }
      const subsRes = await api.get(`/coding/problems/${currentProblem.slug}/submissions`)
      setSubmissions(subsRes.data)
      setActiveTab("submissions")
    } catch {
      toast.error("Failed to submit")
    } finally {
      setIsRunning(false)
    }
  }

  const diff        = currentProblem?.difficulty
  const passedCount = testResults.filter(r => r.status === "passed").length
  const totalNav    = problemsList.length
  const displayIdx  = currentIndex >= 0 ? currentIndex + 1 : "–"

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -mx-4 -mt-4">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/60 backdrop-blur-sm shrink-0 gap-2">

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost" size="sm"
            onClick={() => router.push(`/coding/${moduleSlug}`)}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Problems</span>
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            variant="ghost" size="icon"
            onClick={() => setShowProblemList(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Problem list"
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            variant="ghost" size="icon"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="h-8 w-8 text-muted-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums select-none px-0.5">
            {displayIdx} <span className="text-muted-foreground/40">/</span> {totalNav || "–"}
          </span>
          <Button
            variant="ghost" size="icon"
            onClick={handleNext}
            disabled={currentIndex < 0 || currentIndex >= totalNav - 1}
            className="h-8 w-8 text-muted-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden sm:flex items-center gap-2 flex-1 justify-center min-w-0 px-4">
          {currentProblem && (
            <>
              <span className="text-sm font-semibold text-foreground truncate">
                {currentIndex + 1}. {currentProblem.title}
              </span>
              {diff && (
                <span className={cn("chip text-xs shrink-0", difficultyConfig[diff].cls)}>
                  {diff}
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Select value={language} onValueChange={v => handleLanguageChange(v as Language)}>
            <SelectTrigger className="h-8 w-32 bg-secondary/50 border-border text-foreground text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(LANG_LABELS) as [Language, string][]).map(([val, label]) => (
                <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost" size="icon"
            onClick={handleReset}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Reset to starter code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <FeedbackModal compact triggerClassName="h-8 text-muted-foreground hover:text-primary" />
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            variant="outline" size="sm"
            onClick={handleRunCode}
            disabled={isRunning || !currentProblem}
            className="h-8 px-3.5 text-xs bg-secondary/50 border-border text-foreground hover:bg-secondary hover:text-foreground gap-1.5"
          >
            {isRunning && consoleTab !== "custom"
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Play className="h-3.5 w-3.5 fill-current" />}
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning || !currentProblem}
            className="h-8 px-3.5 text-xs gradient-bg text-white hover:opacity-90 gap-1.5"
          >
            {isRunning && consoleTab !== "custom"
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Send className="h-3.5 w-3.5" />}
            Submit
          </Button>
        </div>
      </div>

      {/* ── Resizable Panels ── */}
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal" autoSaveId="coding-ide-h" style={{ height: "100%" }}>

          <Panel defaultSize={42} minSize={18} maxSize={70}>
            <div className="flex flex-col h-full border-r border-border">
              {loadingProblem ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading problem…</p>
                </div>
              ) : currentProblem ? (
                <>
                  <div className="px-5 pt-5 pb-4 border-b border-border shrink-0">
                    <h2 className="text-base font-bold text-foreground leading-snug mb-3">
                      {currentIndex + 1}. {currentProblem.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {diff && (
                        <span className={cn("chip text-xs", difficultyConfig[diff].cls)}>{diff}</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-warning font-semibold">
                        <Star className="h-3 w-3 fill-warning" />
                        {currentProblem.points} pts
                      </span>
                      {currentProblem.tags.map(t => (
                        <span key={t} className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-md font-medium">{t}</span>
                      ))}
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
                    <TabsList className="shrink-0 bg-transparent border-b border-border rounded-none px-2 h-10 gap-0 justify-start">
                      <TabsTrigger value="description" className={tabTriggerCls}>
                        <FileText className="h-3.5 w-3.5" />
                        Description
                      </TabsTrigger>
                      <TabsTrigger value="submissions" className={tabTriggerCls}>
                        <History className="h-3.5 w-3.5" />
                        Submissions{submissions.length > 0 ? ` (${submissions.length})` : ""}
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto">
                      <TabsContent value="description" className="m-0 p-5 space-y-6">
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                          {currentProblem.description}
                        </p>

                        {currentProblem.examples.length > 0 && (
                          <div className="space-y-4">
                            {currentProblem.examples.map((ex, i) => (
                              <div key={i}>
                                <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                                  Example {i + 1}
                                </p>
                                <div className="rounded-xl border border-border bg-secondary/20 overflow-hidden">
                                  <div className="px-4 py-3 space-y-2 font-mono text-sm">
                                    <div className="flex gap-3">
                                      <span className="text-muted-foreground font-sans text-xs font-semibold w-24 shrink-0 pt-0.5">Input:</span>
                                      <code className="text-foreground/90 text-xs leading-relaxed">{ex.input}</code>
                                    </div>
                                    <div className="flex gap-3">
                                      <span className="text-muted-foreground font-sans text-xs font-semibold w-24 shrink-0 pt-0.5">Output:</span>
                                      <code className="text-foreground/90 text-xs leading-relaxed">{ex.output}</code>
                                    </div>
                                    {ex.explanation && (
                                      <div className="flex gap-3 pt-2 mt-1 border-t border-border">
                                        <span className="text-muted-foreground font-sans text-xs font-semibold w-24 shrink-0 pt-0.5">Explanation:</span>
                                        <span className="text-muted-foreground font-sans text-xs leading-relaxed">{ex.explanation}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {currentProblem.constraints && (
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Constraints</p>
                            <ul className="space-y-2">
                              {currentProblem.constraints.split("\n").filter(Boolean).map((c, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0 mt-1.5" />
                                  <code className="font-mono text-foreground/80 text-xs leading-relaxed">{c}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="submissions" className="m-0 p-5">
                        {submissions.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                            <History className="h-8 w-8 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">No submissions yet</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {submissions.map(s => (
                              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <span className={cn("flex items-center gap-1.5 font-semibold capitalize text-xs", statusColors[s.status] ?? "text-foreground")}>
                                  {statusIcons[s.status]}
                                  {s.status.replace("_", " ")}
                                </span>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="font-mono bg-secondary/60 px-2 py-0.5 rounded">{s.language}</span>
                                  {s.runtime_ms && <span>{s.runtime_ms}ms</span>}
                                  <span>{timeAgo(s.submitted_at)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </>
              ) : null}
            </div>
          </Panel>

          <HResizeHandle />

          <Panel defaultSize={58} minSize={25}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                <PanelGroup direction="vertical" style={{ height: "100%" }}>

                  <Panel defaultSize={100} minSize={25}>
                    <div style={{ height: "100%" }}>
                      <MonacoEditor
                        height="100%"
                        language={language === "cpp" ? "cpp" : language}
                        value={code}
                        onChange={val => setCode(val ?? "")}
                        theme="vs-dark"
                        options={{
                          fontSize: 14,
                          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          wordWrap: "on",
                          lineNumbers: "on",
                          renderLineHighlight: "line",
                          tabSize: 4,
                          padding: { top: 16, bottom: 16 },
                          smoothScrolling: true,
                          cursorSmoothCaretAnimation: "on",
                          bracketPairColorization: { enabled: true },
                        }}
                      />
                    </div>
                  </Panel>

                  <VResizeHandle hidden={consoleCollapsed} />

                  <Panel
                    ref={consolePanelRef}
                    collapsible
                    collapsedSize={0}
                    defaultSize={0}
                    minSize={18}
                    maxSize={65}
                    onCollapse={() => setConsoleCollapsed(true)}
                    onExpand={() => setConsoleCollapsed(false)}
                  >
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#040810" }}>
                      <div className="flex items-center border-b border-white/10 px-4 overflow-x-auto shrink-0">
                        {testResults.map((tc, i) => (
                          <button
                            key={i}
                            onClick={() => { setSelectedCase(i); setConsoleTab("testcases") }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap",
                              consoleTab === "testcases" && selectedCase === i
                                ? "text-gray-100 border-gray-300/60"
                                : "text-gray-500 border-transparent hover:text-gray-300"
                            )}
                          >
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              tc.status === "passed"  ? "bg-green-500" :
                              tc.status === "pending" ? "bg-gray-500" : "bg-red-500"
                            )} />
                            {tc.hidden ? `Hidden ${i + 1}` : `Case ${i + 1}`}
                          </button>
                        ))}
                        <button
                          onClick={() => setConsoleTab("custom")}
                          className={cn(
                            "px-3 py-2.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap",
                            consoleTab === "custom"
                              ? "text-gray-100 border-gray-300/60"
                              : "text-gray-500 border-transparent hover:text-gray-300"
                          )}
                        >
                          Custom Input
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {consoleTab === "testcases" && (
                          testResults.length === 0 ? (
                            <p className="text-xs text-gray-500 font-mono py-2">
                              &gt; Click <span className="text-cyan-400">Run</span> to execute against test cases...
                            </p>
                          ) : testResults[selectedCase] ? (
                            <div className="space-y-3">
                              {testResults[selectedCase].hidden ? (
                                <p className="text-xs text-gray-500 font-mono py-1">
                                  🔒 Hidden test case — input and expected output are not shown.
                                </p>
                              ) : (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1.5">Input =</p>
                                    <pre className="bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                                      {testResults[selectedCase].input}
                                    </pre>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1.5">Expected Output =</p>
                                    <pre className="bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono text-emerald-400 whitespace-pre-wrap break-all">
                                      {testResults[selectedCase].expectedOutput}
                                    </pre>
                                  </div>
                                </>
                              )}
                              <div>
                                <p className="text-xs text-gray-500 font-mono mb-1.5">Output =</p>
                                <pre className={cn(
                                  "bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono whitespace-pre-wrap break-all",
                                  testResults[selectedCase].status === "passed" ? "text-emerald-400" : "text-red-400"
                                )}>
                                  {testResults[selectedCase].actualOutput ?? "(no output)"}
                                </pre>
                              </div>
                            </div>
                          ) : null
                        )}

                        {consoleTab === "custom" && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-gray-500 font-mono mb-1.5 block">&gt; stdin</label>
                              <textarea
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                placeholder={"Enter input here...\n(leave empty to run against test cases)"}
                                className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm font-mono text-gray-200 placeholder:text-gray-600 resize-none focus:outline-none focus:border-cyan-400/40 transition-colors"
                              />
                            </div>
                            {customOutput && (
                              <div>
                                <label className="text-xs text-gray-500 font-mono mb-1.5 block">&gt; stdout</label>
                                <pre className="w-full min-h-10 overflow-auto bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm font-mono text-emerald-400">
                                  {customOutput}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>
                </PanelGroup>
              </div>

              <button
                onClick={() => {
                  consoleCollapsed
                    ? consolePanelRef.current?.expand()
                    : consolePanelRef.current?.collapse()
                }}
                style={{ flexShrink: 0 }}
                className="w-full flex items-center justify-between px-4 py-2 bg-card/60 hover:bg-secondary/40 transition-colors border-t border-border group"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">Console</span>
                  {testResults.length > 0 && (
                    <span className={cn(
                      "text-xs font-semibold px-1.5 py-0.5 rounded",
                      passedCount === testResults.length
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    )}>
                      {passedCount}/{testResults.length} passed
                    </span>
                  )}
                </div>
                {consoleCollapsed
                  ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                }
              </button>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Problem List Drawer */}
      <AnimatePresence>
        {showProblemList && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowProblemList(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-40 w-72 bg-background border-r border-border flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Problems</span>
                  <span className="text-xs text-muted-foreground">({problemsList.length})</span>
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => setShowProblemList(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {problemsList.map((problem, idx) => (
                  <button
                    key={problem.id}
                    onClick={() => { router.push(`/coding/${moduleSlug}/${problem.slug}`); setShowProblemList(false) }}
                    className={cn(
                      "w-full p-3 rounded-xl text-left transition-all hover:bg-secondary/60 group",
                      problem.slug === slug
                        ? "bg-primary/10 border border-primary/25 shadow-sm"
                        : "border border-transparent"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {problem.is_solved && (
                          <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                        )}
                        <span className={cn(
                          "text-sm font-medium leading-snug truncate",
                          problem.slug === slug ? "text-primary" : "text-foreground"
                        )}>
                          {idx + 1}. {problem.title}
                        </span>
                      </div>
                      <span className="flex items-center gap-0.5 text-xs text-warning shrink-0 mt-0.5">
                        <Star className="h-3 w-3 fill-warning" />
                        {problem.points}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={cn("chip text-xs", difficultyConfig[problem.difficulty].cls)}>
                        {problem.difficulty}
                      </span>
                      {problem.tags.slice(0, 1).map(t => (
                        <span key={t} className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
