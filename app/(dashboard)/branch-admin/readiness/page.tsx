"use client"

import { ReadinessDashboard } from "@/components/admin/readiness-dashboard"

// The backend limits a branch admin to their own branch.
export default function BranchReadinessPage() {
  return <ReadinessDashboard />
}
