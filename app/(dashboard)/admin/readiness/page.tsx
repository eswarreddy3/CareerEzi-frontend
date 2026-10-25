"use client"

import { ReadinessDashboard } from "@/components/admin/readiness-dashboard"

export default function AdminReadinessPage() {
  return <ReadinessDashboard studentHref={(id) => `/admin/students/${id}`} />
}
