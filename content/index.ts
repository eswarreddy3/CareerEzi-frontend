// Central registry for course lesson content.
// Add a new entry here when you create content/courses/<courseId>.ts
// Content is keyed by lesson order (1-based).

import pythonContent from "./courses/python"
import sqlContent from "./courses/sql"
import htmlCssContent from "./courses/html-css"
import excelContent from "./courses/excel"

const courseContent: Record<string, Record<number, string>> = {
  python: pythonContent,
  sql: sqlContent,
  "html-css": htmlCssContent,
  excel: excelContent,
}

export function getLessonContent(courseId: string, lessonOrder: number): string | null {
  return courseContent[courseId]?.[lessonOrder] ?? null
}
