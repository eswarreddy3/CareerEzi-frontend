"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  FileQuestion, 
  Code, 
  FileText, 
  MessageSquare,
  Building2,
  ExternalLink,
  CheckCircle,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Company {
  id: string
  name: string
  logo: string
  color: string
  mcqCount: number
  codingCount: number
  papersCount: number
  tipsCount: number
}

const companies: Company[] = [
  { id: "tcs", name: "TCS", logo: "T", color: "from-blue-500 to-blue-700", mcqCount: 250, codingCount: 80, papersCount: 15, tipsCount: 20 },
  { id: "infosys", name: "Infosys", logo: "I", color: "from-blue-400 to-cyan-500", mcqCount: 200, codingCount: 60, papersCount: 12, tipsCount: 18 },
  { id: "wipro", name: "Wipro", logo: "W", color: "from-purple-500 to-violet-600", mcqCount: 180, codingCount: 50, papersCount: 10, tipsCount: 15 },
  { id: "accenture", name: "Accenture", logo: "A", color: "from-purple-600 to-pink-500", mcqCount: 220, codingCount: 70, papersCount: 14, tipsCount: 22 },
  { id: "capgemini", name: "Capgemini", logo: "C", color: "from-blue-600 to-indigo-600", mcqCount: 190, codingCount: 55, papersCount: 11, tipsCount: 16 },
  { id: "cognizant", name: "Cognizant", logo: "C", color: "from-blue-500 to-blue-700", mcqCount: 210, codingCount: 65, papersCount: 13, tipsCount: 19 },
  { id: "amazon", name: "Amazon", logo: "A", color: "from-orange-400 to-orange-600", mcqCount: 300, codingCount: 150, papersCount: 20, tipsCount: 30 },
]

interface ContentItem {
  id: string
  title: string
  difficulty?: "Easy" | "Medium" | "Hard"
  completed?: boolean
  year?: string
  duration?: string
}

const mockContent = {
  mcq: [
    { id: "1", title: "Quantitative Aptitude - Set 1", difficulty: "Easy" as const, completed: true },
    { id: "2", title: "Logical Reasoning - Set 1", difficulty: "Medium" as const, completed: true },
    { id: "3", title: "Verbal Ability - Set 1", difficulty: "Easy" as const, completed: false },
    { id: "4", title: "Technical MCQs - Programming", difficulty: "Medium" as const, completed: false },
    { id: "5", title: "Advanced Aptitude - Set 1", difficulty: "Hard" as const, completed: false },
  ],
  coding: [
    { id: "1", title: "Array Manipulation", difficulty: "Easy" as const, completed: true },
    { id: "2", title: "String Processing", difficulty: "Medium" as const, completed: false },
    { id: "3", title: "Dynamic Programming Basics", difficulty: "Hard" as const, completed: false },
    { id: "4", title: "Graph Traversals", difficulty: "Medium" as const, completed: false },
  ],
  papers: [
    { id: "1", title: "2024 Campus Recruitment Paper", year: "2024", duration: "90 min" },
    { id: "2", title: "2023 Off-Campus Paper", year: "2023", duration: "120 min" },
    { id: "3", title: "2023 Campus Recruitment Paper", year: "2023", duration: "90 min" },
    { id: "4", title: "2022 Campus Recruitment Paper", year: "2022", duration: "90 min" },
  ],
  tips: [
    { id: "1", title: "Resume Preparation Guide" },
    { id: "2", title: "Common HR Interview Questions" },
    { id: "3", title: "Technical Interview Tips" },
    { id: "4", title: "Group Discussion Strategies" },
    { id: "5", title: "Salary Negotiation Tips" },
  ],
}

const difficultyColors = {
  Easy: "bg-emerald-500/20 text-emerald-400",
  Medium: "bg-amber-500/20 text-amber-400",
  Hard: "bg-red-500/20 text-red-400",
}

export default function CompanyPrepPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [activeTab, setActiveTab] = useState("mcq")

  if (selectedCompany) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedCompany(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl font-bold text-white",
              selectedCompany.color
            )}>
              {selectedCompany.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold font-serif text-foreground">{selectedCompany.name}</h1>
              <p className="text-muted-foreground">Placement Preparation Resources</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <FileQuestion className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold font-serif text-foreground">{selectedCompany.mcqCount}</p>
            <p className="text-sm text-muted-foreground">MCQ Questions</p>
          </GlassCard>
          <GlassCard className="text-center">
            <Code className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold font-serif text-foreground">{selectedCompany.codingCount}</p>
            <p className="text-sm text-muted-foreground">Coding Problems</p>
          </GlassCard>
          <GlassCard className="text-center">
            <FileText className="h-6 w-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold font-serif text-foreground">{selectedCompany.papersCount}</p>
            <p className="text-sm text-muted-foreground">Previous Papers</p>
          </GlassCard>
          <GlassCard className="text-center">
            <MessageSquare className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold font-serif text-foreground">{selectedCompany.tipsCount}</p>
            <p className="text-sm text-muted-foreground">Interview Tips</p>
          </GlassCard>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/50 mb-6">
            <TabsTrigger 
              value="mcq"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileQuestion className="h-4 w-4 mr-2" />
              MCQ Bank
            </TabsTrigger>
            <TabsTrigger 
              value="coding"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Code className="h-4 w-4 mr-2" />
              Coding
            </TabsTrigger>
            <TabsTrigger 
              value="papers"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              Previous Papers
            </TabsTrigger>
            <TabsTrigger 
              value="tips"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Interview Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mcq" className="space-y-3">
            {mockContent.mcq.map((item) => (
              <GlassCard key={item.id} hover className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="text-foreground">{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.difficulty && (
                    <Badge className={difficultyColors[item.difficulty]}>
                      {item.difficulty}
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" className="text-foreground">
                    {item.completed ? "Review" : "Start"}
                  </Button>
                </div>
              </GlassCard>
            ))}
          </TabsContent>

          <TabsContent value="coding" className="space-y-3">
            {mockContent.coding.map((item) => (
              <GlassCard key={item.id} hover className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="text-foreground">{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.difficulty && (
                    <Badge className={difficultyColors[item.difficulty]}>
                      {item.difficulty}
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" className="text-foreground">
                    {item.completed ? "Review" : "Solve"}
                  </Button>
                </div>
              </GlassCard>
            ))}
          </TabsContent>

          <TabsContent value="papers" className="space-y-3">
            {mockContent.papers.map((item) => (
              <GlassCard key={item.id} hover className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-400" />
                  <div>
                    <span className="text-foreground">{item.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {item.year}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Attempt
                </Button>
              </GlassCard>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-3">
            {mockContent.tips.map((item) => (
              <GlassCard key={item.id} hover className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <span className="text-foreground">{item.title}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read
                </Button>
              </GlassCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Company Preparation</h1>
        <p className="text-muted-foreground mt-2">Prepare for top recruiters with curated resources</p>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {companies.map((company) => (
          <GlassCard 
            key={company.id} 
            hover 
            className="cursor-pointer group"
            onClick={() => setSelectedCompany(company)}
          >
            <div className="flex flex-col items-center text-center">
              <div className={cn(
                "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white mb-4 transition-transform group-hover:scale-105",
                company.color
              )}>
                {company.logo}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">{company.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {company.mcqCount + company.codingCount}+ questions
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileQuestion className="h-3 w-3" />
                  {company.mcqCount}
                </span>
                <span className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  {company.codingCount}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Empty State */}
      {companies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No companies available</h3>
          <p className="text-sm text-muted-foreground">Check back later for company prep resources</p>
        </div>
      )}
    </div>
  )
}
