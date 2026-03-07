import { GlassCard } from "@/components/glass-card"
import { 
  CheckCircle, 
  Code, 
  FileQuestion, 
  Trophy, 
  Flame,
  BookOpen 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "mcq" | "coding" | "lesson" | "achievement" | "streak"
  title: string
  description: string
  timestamp: string
  points?: number
}

const activityIcons = {
  mcq: FileQuestion,
  coding: Code,
  lesson: BookOpen,
  achievement: Trophy,
  streak: Flame,
}

const activityColors = {
  mcq: "text-blue-400 bg-blue-400/10",
  coding: "text-primary bg-primary/10",
  lesson: "text-purple-400 bg-purple-400/10",
  achievement: "text-amber-400 bg-amber-400/10",
  streak: "text-orange-400 bg-orange-400/10",
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <GlassCard className="h-full">
      <h3 className="font-semibold font-serif mb-4 text-foreground">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type]
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg flex-shrink-0", activityColors[activity.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                {activity.points && (
                  <p className="text-xs text-primary font-medium">+{activity.points} pts</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground/70">Start learning to see your progress here</p>
        </div>
      )}
    </GlassCard>
  )
}
