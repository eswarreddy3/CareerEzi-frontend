"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Star, ArrowRight, Code, Database, Globe, Terminal, Braces, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { LucideIcon } from "lucide-react"

interface Course {
  id: string
  title: string
  icon: LucideIcon
  iconColor: string
  lessonsCompleted: number
  totalLessons: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  stars: number
  category: "programming" | "aptitude" | "domain"
  isLocked: boolean
  prerequisite?: string
}

const courses: Course[] = [
  {
    id: "python",
    title: "Python",
    icon: Code,
    iconColor: "text-blue-400",
    lessonsCompleted: 17,
    totalLessons: 25,
    difficulty: "Beginner",
    stars: 150,
    category: "programming",
    isLocked: false,
  },
  {
    id: "sql",
    title: "SQL",
    icon: Database,
    iconColor: "text-cyan-400",
    lessonsCompleted: 8,
    totalLessons: 20,
    difficulty: "Intermediate",
    stars: 100,
    category: "programming",
    isLocked: false,
  },
  {
    id: "java",
    title: "Java",
    icon: Braces,
    iconColor: "text-orange-400",
    lessonsCompleted: 0,
    totalLessons: 30,
    difficulty: "Intermediate",
    stars: 200,
    category: "programming",
    isLocked: false,
  },
  {
    id: "javascript",
    title: "JavaScript",
    icon: Braces,
    iconColor: "text-yellow-400",
    lessonsCompleted: 0,
    totalLessons: 25,
    difficulty: "Beginner",
    stars: 150,
    category: "programming",
    isLocked: false,
  },
  {
    id: "html-css",
    title: "HTML/CSS",
    icon: Globe,
    iconColor: "text-pink-400",
    lessonsCompleted: 0,
    totalLessons: 20,
    difficulty: "Beginner",
    stars: 100,
    category: "programming",
    isLocked: false,
  },
  {
    id: "nodejs",
    title: "Node.js",
    icon: Server,
    iconColor: "text-green-400",
    lessonsCompleted: 0,
    totalLessons: 25,
    difficulty: "Advanced",
    stars: 250,
    category: "programming",
    isLocked: true,
    prerequisite: "JavaScript",
  },
  {
    id: "quantitative",
    title: "Quantitative Aptitude",
    icon: Terminal,
    iconColor: "text-purple-400",
    lessonsCompleted: 5,
    totalLessons: 30,
    difficulty: "Intermediate",
    stars: 180,
    category: "aptitude",
    isLocked: false,
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    icon: Terminal,
    iconColor: "text-teal-400",
    lessonsCompleted: 0,
    totalLessons: 25,
    difficulty: "Beginner",
    stars: 120,
    category: "aptitude",
    isLocked: false,
  },
  {
    id: "data-science",
    title: "Data Science",
    icon: Database,
    iconColor: "text-violet-400",
    lessonsCompleted: 5,
    totalLessons: 20,
    difficulty: "Advanced",
    stars: 300,
    category: "domain",
    isLocked: false,
  },
]

const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function LearnPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const filteredCourses = activeTab === "all"
    ? courses
    : courses.filter(c => c.category === activeTab)

  const handleStartCourse = (course: Course) => {
    if (course.isLocked) {
      toast.error("Course Locked", {
        description: `Complete ${course.prerequisite} first to unlock this course.`,
      })
      return
    }
    router.push(`/learn/${course.id}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Course Library</h1>
        <p className="text-muted-foreground mt-2">Master programming, aptitude, and domain skills</p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="programming"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Programming
          </TabsTrigger>
          <TabsTrigger 
            value="aptitude"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Aptitude
          </TabsTrigger>
          <TabsTrigger 
            value="domain"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Domain
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const Icon = course.icon
          const progress = course.totalLessons > 0 
            ? Math.round((course.lessonsCompleted / course.totalLessons) * 100)
            : 0

          return (
            <GlassCard key={course.id} hover className="relative overflow-hidden group">
              {course.isLocked && (
                <div className="absolute inset-0 locked-overlay z-10 flex flex-col items-center justify-center gap-3 rounded-xl">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center px-4">
                    Complete <span className="text-primary font-medium">{course.prerequisite}</span> to unlock
                  </p>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  course.iconColor.replace("text-", "bg-").replace("400", "400/20")
                )}>
                  <Icon className={cn("h-6 w-6", course.iconColor)} />
                </div>
                <Badge variant="outline" className={cn("text-xs border", difficultyColors[course.difficulty])}>
                  {course.difficulty}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 font-serif text-foreground">{course.title}</h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {course.lessonsCompleted} of {course.totalLessons} lessons completed
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-foreground">{course.stars} stars</span>
                </div>
                
                {progress > 0 && (
                  <ProgressRing progress={progress} size={48} strokeWidth={4} />
                )}
              </div>
              
              <Button
                className={cn(
                  "w-full transition-all duration-300",
                  progress > 0 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
                disabled={course.isLocked}
                onClick={() => handleStartCourse(course)}
              >
                {progress > 0 ? "Continue" : "Start"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </GlassCard>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
          <p className="text-sm text-muted-foreground">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}
