import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getShield } from "@/lib/shields"

interface UserAvatarProps {
  name: string
  photoUrl?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  fallbackClassName?: string
  /** When provided, renders a shield-tier gradient ring around the avatar */
  points?: number
}

const SIZE_MAP = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
}

const TEXT_MAP = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
}

/** Ring thickness per size (px) */
const RING_MAP = {
  xs: 2,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 4,
}

function initials(name: string) {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function UserAvatar({
  name,
  photoUrl,
  size = "sm",
  className,
  fallbackClassName,
  points,
}: UserAvatarProps) {
  const shield = points !== undefined ? getShield(points) : null
  const hasShield = shield !== null && shield.tier > 0

  const avatarNode = (
    <Avatar className={cn(SIZE_MAP[size], hasShield ? "" : "flex-shrink-0")}>
      {photoUrl && <AvatarImage src={photoUrl} alt={name} className="object-cover" />}
      <AvatarFallback
        className={cn(
          hasShield ? "bg-card" : "bg-primary/15",
          "text-primary font-semibold",
          TEXT_MAP[size],
          fallbackClassName
        )}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )

  if (!hasShield) {
    return (
      <Avatar className={cn(SIZE_MAP[size], "flex-shrink-0", className)}>
        {photoUrl && <AvatarImage src={photoUrl} alt={name} className="object-cover" />}
        <AvatarFallback
          className={cn(
            "bg-primary/15 text-primary font-semibold",
            TEXT_MAP[size],
            fallbackClassName
          )}
        >
          {initials(name)}
        </AvatarFallback>
      </Avatar>
    )
  }

  const ring = RING_MAP[size]

  return (
    <div
      className={cn("rounded-full flex-shrink-0 inline-flex items-center justify-center", className)}
      style={{
        padding: `${ring}px`,
        background: `linear-gradient(135deg, ${shield.gradientFrom}, ${shield.gradientTo}, ${shield.gradientFrom})`,
        boxShadow: `0 0 ${ring * 4}px ${shield.glowColor}`,
      }}
    >
      {avatarNode}
    </div>
  )
}
