"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight,
  Brain,
  BarChart3,
  Database,
  Cpu,
  LineChart,
  Lock,
  CheckCircle,
  Clock,
  Star,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { LucideIcon } from "lucide-react"

interface DomainProgram {
  id: string
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  skills: string[]
  totalModules: number
  completedModules: number
  enrolled: boolean
  points: number
}

interface RoadmapNode {
  id: string
  title: string
  description: string
  estimatedHours: number
  points: number
  isLocked: boolean
  isCompleted: boolean
  skills: string[]
}

const domainPrograms: DomainProgram[] = [
  {
    id: "data-science",
    title: "Data Science",
    description: "Master data analysis, visualization, and machine learning fundamentals",
    icon: Database,
    iconColor: "text-blue-400",
    skills: ["Python", "SQL", "Pandas", "NumPy", "Matplotlib", "Statistics"],
    totalModules: 12,
    completedModules: 5,
    enrolled: true,
    points: 1500,
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Learn supervised, unsupervised learning and neural network basics",
    icon: Brain,
    iconColor: "text-purple-400",
    skills: ["Python", "Scikit-learn", "TensorFlow", "Deep Learning", "Math"],
    totalModules: 15,
    completedModules: 0,
    enrolled: false,
    points: 2000,
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    description: "Excel in business intelligence and data-driven decision making",
    icon: BarChart3,
    iconColor: "text-cyan-400",
    skills: ["Excel", "SQL", "Tableau", "Power BI", "Statistics"],
    totalModules: 10,
    completedModules: 0,
    enrolled: false,
    points: 1200,
  },
  {
    id: "business-analytics",
    title: "Business Analytics",
    description: "Apply analytics to solve real-world business problems",
    icon: LineChart,
    iconColor: "text-amber-400",
    skills: ["Statistics", "R", "Python", "Business Strategy", "Visualization"],
    totalModules: 11,
    completedModules: 0,
    enrolled: false,
    points: 1400,
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    description: "Explore AI concepts from basics to advanced applications",
    icon: Cpu,
    iconColor: "text-emerald-400",
    skills: ["Python", "Neural Networks", "NLP", "Computer Vision", "Ethics"],
    totalModules: 18,
    completedModules: 0,
    enrolled: false,
    points: 2500,
  },
]

const dataScienceRoadmap: RoadmapNode[] = [
  {
    id: "1",
    title: "Python Fundamentals",
    description: "Learn Python basics including syntax, data types, and control flow",
    estimatedHours: 15,
    points: 150,
    isLocked: false,
    isCompleted: true,
    skills: ["Python", "Programming Basics"],
  },
  {
    id: "2",
    title: "NumPy & Pandas",
    description: "Master data manipulation with NumPy arrays and Pandas DataFrames",
    estimatedHours: 20,
    points: 200,
    isLocked: false,
    isCompleted: true,
    skills: ["NumPy", "Pandas", "Data Manipulation"],
  },
  {
    id: "3",
    title: "SQL for Data Science",
    description: "Learn SQL queries, joins, and database operations for data analysis",
    estimatedHours: 18,
    points: 180,
    isLocked: false,
    isCompleted: true,
    skills: ["SQL", "Database", "Queries"],
  },
  {
    id: "4",
    title: "Data Visualization",
    description: "Create compelling visualizations with Matplotlib and Seaborn",
    estimatedHours: 12,
    points: 150,
    isLocked: false,
    isCompleted: true,
    skills: ["Matplotlib", "Seaborn", "Visualization"],
  },
  {
    id: "5",
    title: "Statistics & Probability",
    description: "Understand statistical concepts essential for data science",
    estimatedHours: 25,
    points: 250,
    isLocked: false,
    isCompleted: true,
    skills: ["Statistics", "Probability", "Hypothesis Testing"],
  },
  {
    id: "6",
    title: "Exploratory Data Analysis",
    description: "Learn techniques for exploring and understanding datasets",
    estimatedHours: 15,
    points: 180,
    isLocked: false,
    isCompleted: false,
    skills: ["EDA", "Data Cleaning", "Feature Engineering"],
  },
  {
    id: "7",
    title: "Machine Learning Basics",
    description: "Introduction to ML algorithms and scikit-learn",
    estimatedHours: 30,
    points: 300,
    isLocked: true,
    isCompleted: false,
    skills: ["Scikit-learn", "Regression", "Classification"],
  },
  {
    id: "8",
    title: "Advanced ML Techniques",
    description: "Deep dive into ensemble methods and model optimization",
    estimatedHours: 25,
    points: 280,
    isLocked: true,
    isCompleted: false,
    skills: ["Random Forest", "XGBoost", "Hyperparameter Tuning"],
  },
  {
    id: "9",
    title: "Deep Learning Intro",
    description: "Neural networks fundamentals with TensorFlow/Keras",
    estimatedHours: 35,
    points: 350,
    isLocked: true,
    isCompleted: false,
    skills: ["Neural Networks", "TensorFlow", "Keras"],
  },
  {
    id: "10",
    title: "Capstone Project",
    description: "Apply all skills in a comprehensive data science project",
    estimatedHours: 40,
    points: 500,
    isLocked: true,
    isCompleted: false,
    skills: ["End-to-End ML", "Deployment", "Presentation"],
  },
]

export default function DomainProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<DomainProgram | null>(null)

  const handleEnroll = (program: DomainProgram) => {
    toast.success(`Enrolled in ${program.title}!`, {
      description: "Start your learning journey now",
    })
  }

  if (selectedProgram) {
    const progress = (selectedProgram.completedModules / selectedProgram.totalModules) * 100
    const roadmap = selectedProgram.id === "data-science" ? dataScienceRoadmap : []

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedProgram(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4 flex-1">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              selectedProgram.iconColor.replace("text-", "bg-").replace("400", "400/20")
            )}>
              <selectedProgram.icon className={cn("h-8 w-8", selectedProgram.iconColor)} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-serif text-foreground">{selectedProgram.title}</h1>
              <p className="text-muted-foreground">{selectedProgram.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <GlassCard>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Course Progress</span>
                <span className="text-sm font-medium text-foreground">
                  {selectedProgram.completedModules}/{selectedProgram.totalModules} modules
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold font-serif text-primary">{selectedProgram.points}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {selectedProgram.skills.map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              className="bg-primary/10 border-primary/30 text-primary"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-xl font-semibold font-serif mb-6 text-foreground">Learning Roadmap</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-border" />
            
            <div className="space-y-6">
              {roadmap.map((node, index) => (
                <div key={node.id} className="relative flex gap-6">
                  {/* Node indicator */}
                  <div className={cn(
                    "relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                    node.isCompleted && "bg-primary text-primary-foreground",
                    !node.isCompleted && !node.isLocked && "bg-primary/20 border-2 border-primary text-primary",
                    node.isLocked && "bg-secondary text-muted-foreground border-2 border-border"
                  )}>
                    {node.isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : node.isLocked ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Node content */}
                  <GlassCard 
                    hover={!node.isLocked} 
                    className={cn(
                      "flex-1",
                      node.isLocked && "opacity-60"
                    )}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{node.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{node.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {node.skills.map((skill) => (
                            <Badge 
                              key={skill} 
                              variant="outline" 
                              className="text-xs text-muted-foreground"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {node.estimatedHours}h
                          </span>
                          <span className="flex items-center gap-1 text-primary">
                            <Star className="h-4 w-4" />
                            {node.points} pts
                          </span>
                        </div>
                        <Button 
                          size="sm"
                          disabled={node.isLocked}
                          className={cn(
                            node.isCompleted 
                              ? "bg-secondary hover:bg-secondary/80 text-foreground" 
                              : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          )}
                        >
                          {node.isCompleted ? "Review" : node.isLocked ? "Locked" : "Start"}
                          {!node.isLocked && !node.isCompleted && <ArrowRight className="h-4 w-4 ml-2" />}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Domain Programs</h1>
        <p className="text-muted-foreground mt-2">Specialized learning paths for in-demand skills</p>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domainPrograms.map((program) => {
          const Icon = program.icon
          const progress = program.enrolled 
            ? (program.completedModules / program.totalModules) * 100 
            : 0

          return (
            <GlassCard 
              key={program.id} 
              hover 
              className="cursor-pointer group"
              onClick={() => setSelectedProgram(program)}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105",
                program.iconColor.replace("text-", "bg-").replace("400", "400/20")
              )}>
                <Icon className={cn("h-7 w-7", program.iconColor)} />
              </div>

              <h3 className="font-semibold text-lg font-serif text-foreground mb-2">{program.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{program.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {program.skills.slice(0, 4).map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    className="text-xs text-muted-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
                {program.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{program.skills.length - 4}
                  </Badge>
                )}
              </div>

              {program.enrolled && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium text-foreground">
                      {program.completedModules}/{program.totalModules}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">{program.points} pts</span>
                </div>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!program.enrolled) {
                      handleEnroll(program)
                    } else {
                      setSelectedProgram(program)
                    }
                  }}
                  className={cn(
                    program.enrolled 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  )}
                >
                  {program.enrolled ? "Continue" : "Enroll"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
