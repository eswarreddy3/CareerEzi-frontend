"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Trophy, Star, Flame, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  branch: string
  section: string
  points: number
  stars: number
  streak: number
  isCurrentUser?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Priya Sharma", branch: "CSE", section: "A", points: 8750, stars: 15, streak: 28 },
  { rank: 2, name: "Arjun Patel", branch: "CSE", section: "B", points: 8420, stars: 14, streak: 21 },
  { rank: 3, name: "Sneha Reddy", branch: "IT", section: "A", points: 7890, stars: 12, streak: 18 },
  { rank: 4, name: "Vikram Singh", branch: "CSE", section: "A", points: 7650, stars: 11, streak: 15 },
  { rank: 5, name: "Ananya Gupta", branch: "ECE", section: "A", points: 7200, stars: 10, streak: 14 },
  { rank: 6, name: "Rahul Kumar", branch: "CSE", section: "C", points: 4200, stars: 7, streak: 12, isCurrentUser: true },
  { rank: 7, name: "Meera Joshi", branch: "CSE", section: "B", points: 6800, stars: 9, streak: 10 },
  { rank: 8, name: "Karthik Nair", branch: "IT", section: "B", points: 6500, stars: 8, streak: 9 },
  { rank: 9, name: "Divya Menon", branch: "CSE", section: "A", points: 6200, stars: 8, streak: 8 },
  { rank: 10, name: "Aditya Roy", branch: "ECE", section: "B", points: 5900, stars: 7, streak: 7 },
  { rank: 11, name: "Pooja Verma", branch: "CSE", section: "C", points: 5600, stars: 6, streak: 5 },
  { rank: 12, name: "Rohan Das", branch: "IT", section: "A", points: 5300, stars: 6, streak: 4 },
]

const podiumColors = {
  1: "from-amber-400 to-amber-600",
  2: "from-slate-300 to-slate-500",
  3: "from-orange-400 to-orange-600",
}

const podiumBorders = {
  1: "border-amber-400",
  2: "border-slate-400",
  3: "border-orange-400",
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("college")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = leaderboardData.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topThree = filteredData.slice(0, 3)
  const restOfList = filteredData.slice(3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Compete with your peers and climb the ranks</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/50">
            <TabsTrigger 
              value="college"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              College-wide
            </TabsTrigger>
            <TabsTrigger 
              value="branch"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Branch
            </TabsTrigger>
            <TabsTrigger 
              value="section"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Section
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <GlassCard className="order-2 md:order-1 relative overflow-hidden">
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
              podiumColors[2]
            )} />
            <div className="flex flex-col items-center text-center pt-4">
              <div className="relative mb-4">
                <Avatar className={cn("h-20 w-20 border-4", podiumBorders[2])}>
                  <AvatarImage src={topThree[1].avatar} />
                  <AvatarFallback className="bg-secondary text-foreground text-xl">
                    {topThree[1].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-slate-300 to-slate-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-900">2</span>
                </div>
              </div>
              <h3 className="font-semibold text-foreground">{topThree[1].name}</h3>
              <p className="text-sm text-muted-foreground">{topThree[1].branch} - {topThree[1].section}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-foreground">{topThree[1].stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{topThree[1].points.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <GlassCard className="order-1 md:order-2 relative overflow-hidden teal-glow">
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
              podiumColors[1]
            )} />
            <div className="flex flex-col items-center text-center pt-4">
              <div className="relative mb-4">
                <Avatar className={cn("h-24 w-24 border-4", podiumBorders[1])}>
                  <AvatarImage src={topThree[0].avatar} />
                  <AvatarFallback className="bg-secondary text-foreground text-2xl">
                    {topThree[0].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                  <Medal className="h-5 w-5 text-amber-900" />
                </div>
              </div>
              <h3 className="font-semibold text-lg text-foreground">{topThree[0].name}</h3>
              <p className="text-sm text-muted-foreground">{topThree[0].branch} - {topThree[0].section}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-foreground">{topThree[0].stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{topThree[0].points.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-foreground">{topThree[0].streak}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <GlassCard className="order-3 relative overflow-hidden">
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
              podiumColors[3]
            )} />
            <div className="flex flex-col items-center text-center pt-4">
              <div className="relative mb-4">
                <Avatar className={cn("h-20 w-20 border-4", podiumBorders[3])}>
                  <AvatarImage src={topThree[2].avatar} />
                  <AvatarFallback className="bg-secondary text-foreground text-xl">
                    {topThree[2].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-900">3</span>
                </div>
              </div>
              <h3 className="font-semibold text-foreground">{topThree[2].name}</h3>
              <p className="text-sm text-muted-foreground">{topThree[2].branch} - {topThree[2].section}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-foreground">{topThree[2].stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{topThree[2].points.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Rest of Leaderboard */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Branch</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Points</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Stars</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Streak</th>
              </tr>
            </thead>
            <tbody>
              {restOfList.map((entry) => (
                <tr 
                  key={entry.rank}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-secondary/30",
                    entry.isCurrentUser && "bg-primary/10 border-primary/30"
                  )}
                >
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-sm font-medium",
                      entry.isCurrentUser ? "text-primary" : "text-foreground"
                    )}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback className="bg-secondary text-foreground text-xs">
                          {entry.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          entry.isCurrentUser ? "text-primary" : "text-foreground"
                        )}>
                          {entry.name}
                          {entry.isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {entry.branch} - {entry.section}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{entry.branch} - {entry.section}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium text-foreground">{entry.points.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-sm text-foreground">{entry.stars}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span className="text-sm text-foreground">{entry.streak}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
