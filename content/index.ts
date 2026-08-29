// Central registry for course lesson content.
// Add a new entry here when you create content/courses/<courseId>.ts
// Content is keyed by lesson order (1-based).

import pythonContent from "./courses/python"
import sqlContent from "./courses/sql-for-all"
import excelContent from "./courses/excel"
import dsaContent from "./courses/dsa"
import pandasContent from "./courses/pandas"
import numpyContent from "./courses/numpy"
import statisticsContent from "./courses/statistics"
import edaContent from "./courses/eda"
import genaiFundamentalsContent from "./courses/genai-fundamentals"

const courseContent: Record<string, Record<number, string>> = {
  python: pythonContent,
  "sql-for-all": sqlContent,
  excel: excelContent,
  dsa: dsaContent,
  pandas: pandasContent,
  numpy: numpyContent,
  statistics: statisticsContent,
  eda: edaContent,
  "genai-fundamentals": genaiFundamentalsContent,
}

export function getLessonContent(courseId: string, lessonOrder: number): string | null {
  return courseContent[courseId]?.[lessonOrder] ?? null
}
