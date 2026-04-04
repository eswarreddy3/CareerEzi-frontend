import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  photoUrl?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  fallbackClassName?: string
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

function initials(name: string) {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function UserAvatar({ name, photoUrl, size = "sm", className, fallbackClassName }: UserAvatarProps) {
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
