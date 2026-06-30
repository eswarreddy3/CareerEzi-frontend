import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { API, media, type PublicProfile } from "@/lib/public-profile"
import { PublicProfileView } from "@/components/public-profile-view"

// Always render fresh so profile edits / synced stats show instantly (no ISR cache).
export const dynamic = "force-dynamic"

async function getProfile(username: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API}/public/profile/${encodeURIComponent(username)}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as PublicProfile
  } catch {
    return null
  }
}

// ─── SEO ────────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params
  const p = await getProfile(username)
  if (!p) return { title: "Profile not found · CareerEzi" }

  const title = `${p.name} · CareerEzi`
  const bits = [p.branch, p.college_name].filter(Boolean).join(" · ")
  const description = bits
    ? `${p.name} — ${bits}. View coding stats, achievements and contact on CareerEzi.`
    : `${p.name}'s placement portfolio on CareerEzi.`
  const image = media(p.avatar)

  return {
    title,
    description,
    openGraph: {
      title, description, type: "profile",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary", title, description, images: image ? [image] : undefined },
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function PublicProfilePage(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const p = await getProfile(username)
  if (!p) notFound()

  return <PublicProfileView p={p} />
}
