import Link from "next/link"
import { UserX } from "lucide-react"

export default function ProfileNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center mx-auto mb-5">
          <UserX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-foreground">Profile not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          This profile doesn&apos;t exist or hasn&apos;t been made public yet.
        </p>
        <Link href="https://www.careerezi.com"
          className="inline-block mt-6 text-sm text-primary hover:underline">
          Go to CareerEzi →
        </Link>
      </div>
    </main>
  )
}
