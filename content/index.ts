// Central registry for course lesson content.
// Add a new entry here when you create content/courses/<courseId>.ts
// Content is keyed by lesson order (1-based).

import pythonContent from "./courses/python"
import sqlContent from "./courses/sql"

const courseContent: Record<string, Record<number, string>> = {
  python: pythonContent,
  sql: sqlContent,
}

export function getLessonContent(courseId: string, lessonOrder: number): string | null {
  return courseContent[courseId]?.[lessonOrder] ?? null
}
