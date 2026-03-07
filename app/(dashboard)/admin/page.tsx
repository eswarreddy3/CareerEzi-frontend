"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Users,
  TrendingUp,
  Flame,
  Crown,
  Search,
  Bell,
  Mail,
  AlertTriangle,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Student {
  id: string
  name: string
  rollNo: string
  branch: string
  section: string
  year: number
  points: number
  stars: number
  streak: number
  lastActive: string
  isInactive?: boolean
}

const students: Student[] = [
  { id: "1", name: "Priya Sharma", rollNo: "21CS001", branch: "CSE", section: "A", year: 3, points: 8750, stars: 15, streak: 28, lastActive: "2 hours ago" },
  { id: "2", name: "Arjun Patel", rollNo: "21CS002", branch: "CSE", section: "B", year: 3, points: 8420, stars: 14, streak: 21, lastActive: "1 hour ago" },
  { id: "3", name: "Sneha Reddy", rollNo: "21IT003", branch: "IT", section: "A", year: 3, points: 7890, stars: 12, streak: 18, lastActive: "Today" },
  { id: "4", name: "Vikram Singh", rollNo: "21CS004", branch: "CSE", section: "A", year: 3, points: 7650, stars: 11, streak: 15, lastActive: "Yesterday" },
  { id: "5", name: "Ananya Gupta", rollNo: "21ECE005", branch: "ECE", section: "A", year: 3, points: 7200, stars: 10, streak: 14, lastActive: "2 days ago" },
  { id: "6", name: "Rahul Kumar", rollNo: "21CS006", branch: "CSE", section: "C", year: 3, points: 4200, stars: 7, streak: 12, lastActive: "Today" },
  { id: "7", name: "Meera Joshi", rollNo: "21CS007", branch: "CSE", section: "B", year: 3, points: 6800, stars: 9, streak: 0, lastActive: "5 days ago", isInactive: true },
  { id: "8", name: "Karthik Nair", rollNo: "21IT008", branch: "IT", section: "B", year: 3, points: 6500, stars: 8, streak: 0, lastActive: "4 days ago", isInactive: true },
  { id: "9", name: "Divya Menon", rollNo: "21CS009", branch: "CSE", section: "A", year: 3, points: 6200, stars: 8, streak: 8, lastActive: "3 hours ago" },
  { id: "10", name: "Aditya Roy", rollNo: "21ECE010", branch: "ECE", section: "B", year: 3, points: 5900, stars: 7, streak: 0, lastActive: "6 days ago", isInactive: true },
]

const branchPointsData = [
  { branch: "CSE", avgPoints: 6850 },
  { branch: "IT", avgPoints: 5420 },
  { branch: "ECE", avgPoints: 4890 },
  { branch: "EEE", avgPoints: 4200 },
  { branch: "MECH", avgPoints: 3800 },
]

const weeklyActivityData = [
  { day: "Mon", activeUsers: 780 },
  { day: "Tue", activeUsers: 820 },
  { day: "Wed", activeUsers: 750 },
  { day: "Thu", activeUsers: 890 },
  { day: "Fri", activeUsers: 920 },
  { day: "Sat", activeUsers: 650 },
  { day: "Sun", activeUsers: 480 },
]

const moduleCompletionData = [
  { name: "Python", value: 35, color: "#3B82F6" },
  { name: "SQL", value: 25, color: "#00D4C8" },
  { name: "Aptitude", value: 20, color: "#F59E0B" },
  { name: "DSA", value: 12, color: "#8B5CF6" },
  { name: "Others", value: 8, color: "#6B7280" },
]

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  const inactiveStudents = students.filter(s => s.isInactive)

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBranch = branchFilter === "all" || student.branch === branchFilter
    const matchesSection = sectionFilter === "all" || student.section === sectionFilter
    const matchesYear = yearFilter === "all" || student.year.toString() === yearFilter
    return matchesSearch && matchesBranch && matchesSection && matchesYear
  })

  const handleSendReminder = (student: Student) => {
    toast.success(`Reminder sent to ${student.name}`, {
      description: "Email notification has been sent",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">College Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor student progress and engagement</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 self-start">
          <Crown className="h-4 w-4 mr-2" />
          Pro Package
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">1,240</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">834</p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">8.3</p>
              <p className="text-sm text-muted-foreground">Avg Streak (days)</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Star className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">5,420</p>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Branch-wise Avg Points */}
        <GlassCard className="lg:col-span-1">
          <h3 className="font-semibold font-serif mb-4 text-foreground">Branch-wise Avg Points</h3>
          <ChartContainer
            config={{
              avgPoints: {
                label: "Average Points",
                color: "#00D4C8",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPointsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#8B92A5" fontSize={12} />
                <YAxis dataKey="branch" type="category" stroke="#8B92A5" fontSize={12} width={50} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgPoints" fill="#00D4C8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </GlassCard>

        {/* Line Chart - Weekly Activity */}
        <GlassCard className="lg:col-span-1">
          <h3 className="font-semibold font-serif mb-4 text-foreground">Weekly Activity Trend</h3>
          <ChartContainer
            config={{
              activeUsers: {
                label: "Active Users",
                color: "#00D4C8",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#8B92A5" fontSize={12} />
                <YAxis stroke="#8B92A5" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#00D4C8" 
                  strokeWidth={2}
                  dot={{ fill: "#00D4C8", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </GlassCard>

        {/* Donut Chart - Module Completion */}
        <GlassCard className="lg:col-span-1">
          <h3 className="font-semibold font-serif mb-4 text-foreground">Module Completion</h3>
          <ChartContainer
            config={Object.fromEntries(
              moduleCompletionData.map(item => [
                item.name.toLowerCase(),
                { label: item.name, color: item.color }
              ])
            )}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moduleCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {moduleCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </GlassCard>
      </div>

      {/* Inactive Students Alert */}
      {inactiveStudents.length > 0 && (
        <GlassCard className="border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold font-serif text-foreground">Inactive Students Alert</h3>
            <Badge variant="outline" className="text-red-400 border-red-400/30">
              {inactiveStudents.length} students
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            The following students have been inactive for 3+ days
          </p>
          <div className="space-y-3">
            {inactiveStudents.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-red-500/20 text-red-400">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.branch} - {student.section} | Last active: {student.lastActive}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleSendReminder(student)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Student Table */}
      <GlassCard>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h3 className="font-semibold font-serif text-foreground">Student Directory</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full lg:w-64 bg-secondary/50 border-border text-foreground"
              />
            </div>
            
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[120px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="EEE">EEE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[120px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[100px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Roll No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Branch</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Points</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Stars</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Streak</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-secondary/30",
                    student.isInactive && "bg-red-500/5"
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn(
                          "text-xs",
                          student.isInactive 
                            ? "bg-red-500/20 text-red-400" 
                            : "bg-secondary text-foreground"
                        )}>
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {student.branch} - {student.section}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{student.rollNo}</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {student.branch} - {student.section}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium text-foreground">{student.points.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="h-3 w-3 text-amber-500" />
                      <span className="text-sm text-foreground">{student.stars}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Flame className={cn(
                        "h-3 w-3",
                        student.streak > 0 ? "text-orange-500" : "text-muted-foreground"
                      )} />
                      <span className="text-sm text-foreground">{student.streak}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "text-sm",
                      student.isInactive ? "text-red-400" : "text-muted-foreground"
                    )}>
                      {student.lastActive}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No students found</p>
            <p className="text-xs text-muted-foreground/70">Try adjusting your filters</p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
