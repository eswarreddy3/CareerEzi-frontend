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
import llmTransformersContent from "./courses/llm-transformers"
import promptEngineeringContent from "./courses/prompt-engineering"
import embeddingsRagContent from "./courses/embeddings-vectordb-rag"
import llmAppDevContent from "./courses/llm-application-dev"
import pythonForGenAIContent from "./courses/python-for-ai"
import finetuningLLMContent from "./courses/finetuning-llm"
import multimodalGenAIContent from "./courses/multimodal-genai"
import genaiEvalProductionContent from "./courses/genai-evaluation-production"
import powerBIContent from "./courses/power-bi"
import htmlContent from "./courses/html"
import cssContent from "./courses/css"
import javascript1Content from "./courses/javascript-1"
import javascript2Content from "./courses/javascript-2"

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
  "llm-transformers": llmTransformersContent,
  "prompt-engineering": promptEngineeringContent,
  "embeddings-vectordb-rag": embeddingsRagContent,
  "llm-application-dev": llmAppDevContent,
  "python-for-ai": pythonForGenAIContent,
  "finetuning-llm": finetuningLLMContent,
  "multimodal-genai": multimodalGenAIContent,
  "genai-evaluation-production": genaiEvalProductionContent,
  "power-bi": powerBIContent,
  html: htmlContent,
  css: cssContent,
  "javascript-1": javascript1Content,
  "javascript-2": javascript2Content,
}

export function getLessonContent(courseId: string, lessonOrder: number): string | null {
  return courseContent[courseId]?.[lessonOrder] ?? null
}
