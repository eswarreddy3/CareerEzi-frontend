"use client"

import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  totalQuestions: number
  completedQuestions: number
  status: "pending" | "in-progress" | "completed" | "overdue"
  points: number
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Python Basics Assessment",
    course: "Python",
    dueDate: "Mar 10, 2026",
    totalQuestions: 20,
    completedQuestions: 20,
    status: "completed",
    points: 100,
  },
  {
    id: "2",
    title: "SQL Joins Practice",
    course: "SQL",
    dueDate: "Mar 12, 2026",
    totalQuestions: 15,
    completedQuestions: 8,
    status: "in-progress",
    points: 75,
  },
  {
    id: "3",
    title: "Data Structures Quiz",
    course: "Data Structures",
    dueDate: "Mar 15, 2026",
    totalQuestions: 25,
    completedQuestions: 0,
    status: "pending",
    points: 150,
  },
  {
    id: "4",
    title: "Aptitude Test - Week 5",
    course: "Quantitative Aptitude",
    dueDate: "Mar 5, 2026",
    totalQuestions: 30,
    completedQuestions: 15,
    status: "overdue",
    points: 120,
  },
  {
    id: "5",
    title: "JavaScript Fundamentals",
    course: "JavaScript",
    dueDate: "Mar 18, 2026",
    totalQuestions: 20,
    completedQuestions: 0,
    status: "pending",
    points: 100,
  },
]

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-secondary text-muted-foreground",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-amber-500/20 text-amber-400",
    icon: AlertCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: CheckCircle,
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-500/20 text-red-400",
    icon: AlertCircle,
  },
}

export default function AssignmentsPage() {
  const handleStartAssignment = (assignment: Assignment) => {
    if (assignment.status === "completed") {
      toast.info("Assignment already completed!", {
        description: `You earned ${assignment.points} points`,
      })
      return
    }
    
    toast.success(`Starting ${assignment.title}`, {
      description: "Loading assignment...",
    })
  }

  const pendingCount = assignments.filter(a => a.status === "pending" || a.status === "in-progress").length
  const completedCount = assignments.filter(a => a.status === "completed").length
  const overdueCount = assignments.filter(a => a.status === "overdue").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Assignments</h1>
        <p className="text-muted-foreground mt-2">Complete assignments to earn points and track your progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20">
            <Clock className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold font-serif text-foreground">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold font-serif text-foreground">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/20">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold font-serif text-foreground">{overdueCount}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </GlassCard>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const config = statusConfig[assignment.status]
          const StatusIcon = config.icon
          const progress = (assignment.completedQuestions / assignment.totalQuestions) * 100

          return (
            <GlassCard key={assignment.id} hover className="group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{assignment.dueDate}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-[120px]">
                    <Progress value={progress} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {assignment.completedQuestions}/{assignment.totalQuestions}
                    </span>
                  </div>

                  <Badge className={cn("flex items-center gap-1", config.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>

                  <div className="text-sm font-medium text-primary">
                    {assignment.points} pts
                  </div>

                  <Button
                    size="sm"
                    className={cn(
                      "transition-all",
                      assignment.status === "completed"
                        ? "bg-secondary hover:bg-secondary/80 text-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                    onClick={() => handleStartAssignment(assignment)}
                  >
                    {assignment.status === "completed" ? "Review" : assignment.status === "in-progress" ? "Continue" : "Start"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {assignments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No assignments yet</h3>
          <p className="text-sm text-muted-foreground">Check back later for new assignments</p>
        </div>
      )}
    </div>
  )
}
