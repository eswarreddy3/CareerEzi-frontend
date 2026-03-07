"use client"

import { StatsCard } from "@/components/stats-card"
import { CourseCard } from "@/components/course-card"
import { ActivityFeed } from "@/components/activity-feed"
import { StreakCalendar } from "@/components/streak-calendar"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Flame, Hash, Code, FileQuestion, BarChart3 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const mockActivities = [
  {
    id: "1",
    type: "mcq" as const,
    title: "Completed Python Quiz",
    description: "Scored 8/10 in Data Types quiz",
    timestamp: "2 min ago",
    points: 50,
  },
  {
    id: "2",
    type: "coding" as const,
    title: "Solved Two Sum",
    description: "Easy difficulty - Arrays",
    timestamp: "1 hour ago",
    points: 100,
  },
  {
    id: "3",
    type: "streak" as const,
    title: "Streak Extended!",
    description: "12 day streak maintained",
    timestamp: "Today",
    points: 25,
  },
  {
    id: "4",
    type: "lesson" as const,
    title: "SQL Joins Lesson",
    description: "Completed Module 3",
    timestamp: "Yesterday",
    points: 75,
  },
  {
    id: "5",
    type: "achievement" as const,
    title: "First Week Champion",
    description: "Completed 7-day streak",
    timestamp: "2 days ago",
    points: 200,
  },
]

const activeDays = [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30]

// Course icons with their colors
const PythonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 6c-1.1 0-2 .9-2 2v2h4V8c0-1.1-.9-2-2-2zm-2 6v4c0 1.1.9 2 2 2s2-.9 2-2v-2h-4z"/>
  </svg>
)

const SQLIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17z"/>
  </svg>
)

const DataScienceIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
)

export default function DashboardPage() {
  const handleQuickAction = (action: string) => {
    toast.success(`Starting ${action}...`, {
      description: "Redirecting you now",
    })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">
          Welcome back, <span className="gradient-text">Rahul</span> 
        </h1>
        <p className="text-muted-foreground mt-2">Continue your placement preparation journey</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Points"
          value="4,200"
          icon={Star}
          iconColor="text-amber-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Stars Earned"
          value="7"
          icon={Star}
          iconColor="text-amber-500"
        />
        <StatsCard
          title="Current Streak"
          value="12"
          suffix="days"
          icon={Flame}
          iconColor="text-orange-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Leaderboard Rank"
          value="#34"
          icon={Trophy}
          iconColor="text-primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-serif text-foreground">Continue Learning</h2>
            <Link href="/learn">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <CourseCard
              title="Python"
              icon={Code}
              iconColor="text-blue-400"
              lessonsCompleted={17}
              totalLessons={25}
              difficulty="Beginner"
              stars={150}
              progress={68}
              onContinue={() => handleQuickAction("Python course")}
            />
            <CourseCard
              title="SQL"
              icon={BarChart3}
              iconColor="text-cyan-400"
              lessonsCompleted={8}
              totalLessons={20}
              difficulty="Intermediate"
              stars={100}
              progress={40}
              onContinue={() => handleQuickAction("SQL course")}
            />
            <CourseCard
              title="Data Science"
              icon={BarChart3}
              iconColor="text-purple-400"
              lessonsCompleted={5}
              totalLessons={20}
              difficulty="Advanced"
              stars={200}
              progress={25}
              onContinue={() => handleQuickAction("Data Science course")}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Calendar */}
        <StreakCalendar activeDays={activeDays} currentStreak={12} />

        {/* Quick Actions */}
        <GlassCard>
          <h3 className="font-semibold font-serif mb-4 text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/coding">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-foreground"
              >
                <Code className="h-6 w-6 text-primary" />
                <span className="text-sm">Solve a Problem</span>
              </Button>
            </Link>
            <Link href="/practice-mcq">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-foreground"
              >
                <FileQuestion className="h-6 w-6 text-amber-500" />
                <span className="text-sm">Practice MCQ</span>
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-foreground"
              >
                <Trophy className="h-6 w-6 text-purple-400" />
                <span className="text-sm">View Leaderboard</span>
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
