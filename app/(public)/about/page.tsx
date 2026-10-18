import type { Metadata } from "next"
import { AboutContent } from "@/components/landing/about-content"
import { LEGAL } from "@/lib/legal"

export const metadata: Metadata = {
  title: `About | ${LEGAL.product}`,
  description: `${LEGAL.product} is India's campus placement-preparation platform — what it is, who it is for, and who builds it.`,
}

export default function AboutPage() {
  return <AboutContent />
}
