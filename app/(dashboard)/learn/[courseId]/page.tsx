"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  Star,
  FileQuestion,
  ClipboardList,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
}

interface MCQTopic {
  id: string
  title: string
  questions: number
  attempted: number
  bestScore?: number
}

interface Assignment {
  id: string
  title: string
  dueDate: string
  totalQuestions: number
  completedQuestions: number
  status: "pending" | "in-progress" | "completed" | "overdue"
  points: number
}

interface CourseData {
  id: string
  title: string
  description: string
  iconColor: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  lessonsCompleted: number
  totalLessons: number
  stars: number
  lessons: Lesson[]
  mcqTopics: MCQTopic[]
  assignments: Assignment[]
}

// ── Mock data per course ──────────────────────────────────────────────────────
const courseData: Record<string, CourseData> = {
  python: {
    id: "python",
    title: "Python",
    description: "Learn Python from scratch — variables, loops, functions, OOP and more.",
    iconColor: "text-blue-400",
    difficulty: "Beginner",
    lessonsCompleted: 17,
    totalLessons: 25,
    stars: 150,
    lessons: [
      { id: "l1", title: "Introduction to Python", duration: "12 min", isCompleted: true, isLocked: false },
      { id: "l2", title: "Variables & Data Types", duration: "18 min", isCompleted: true, isLocked: false },
      { id: "l3", title: "String Operations", duration: "15 min", isCompleted: true, isLocked: false },
      { id: "l4", title: "Lists & Tuples", duration: "20 min", isCompleted: true, isLocked: false },
      { id: "l5", title: "Dictionaries & Sets", duration: "22 min", isCompleted: true, isLocked: false },
      { id: "l6", title: "Conditional Statements", duration: "14 min", isCompleted: true, isLocked: false },
      { id: "l7", title: "Loops — for & while", duration: "25 min", isCompleted: true, isLocked: false },
      { id: "l8", title: "Functions & Arguments", duration: "28 min", isCompleted: true, isLocked: false },
      { id: "l9", title: "Lambda & Map/Filter", duration: "20 min", isCompleted: true, isLocked: false },
      { id: "l10", title: "File Handling", duration: "18 min", isCompleted: true, isLocked: false },
      { id: "l11", title: "Exception Handling", duration: "22 min", isCompleted: true, isLocked: false },
      { id: "l12", title: "Modules & Packages", duration: "16 min", isCompleted: true, isLocked: false },
      { id: "l13", title: "OOP — Classes & Objects", duration: "30 min", isCompleted: true, isLocked: false },
      { id: "l14", title: "Inheritance & Polymorphism", duration: "28 min", isCompleted: true, isLocked: false },
      { id: "l15", title: "Decorators", duration: "20 min", isCompleted: true, isLocked: false },
      { id: "l16", title: "Generators & Iterators", duration: "22 min", isCompleted: true, isLocked: false },
      { id: "l17", title: "List Comprehensions", duration: "15 min", isCompleted: true, isLocked: false },
      { id: "l18", title: "Regular Expressions", duration: "25 min", isCompleted: false, isLocked: false },
      { id: "l19", title: "Working with JSON", duration: "14 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "API Requests with requests lib", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l21", title: "NumPy Basics", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l22", title: "Pandas Introduction", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l23", title: "Data Visualization", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l24", title: "Testing with pytest", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l25", title: "Capstone Project", duration: "60 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "Python Basics", questions: 40, attempted: 40, bestScore: 92 },
      { id: "m2", title: "Data Types & Operators", questions: 35, attempted: 35, bestScore: 88 },
      { id: "m3", title: "Control Flow", questions: 30, attempted: 28, bestScore: 76 },
      { id: "m4", title: "Functions", questions: 45, attempted: 20, bestScore: 80 },
      { id: "m5", title: "OOP Concepts", questions: 50, attempted: 0 },
      { id: "m6", title: "File & Exception Handling", questions: 35, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "Python Basics Assessment", dueDate: "Mar 10, 2026", totalQuestions: 20, completedQuestions: 20, status: "completed", points: 100 },
      { id: "a2", title: "OOP Design Challenge", dueDate: "Mar 18, 2026", totalQuestions: 15, completedQuestions: 6, status: "in-progress", points: 150 },
      { id: "a3", title: "Python Advanced — Functions", dueDate: "Mar 25, 2026", totalQuestions: 25, completedQuestions: 0, status: "pending", points: 200 },
    ],
  },

  sql: {
    id: "sql",
    title: "SQL",
    description: "Master SQL queries, joins, aggregation and database design.",
    iconColor: "text-cyan-400",
    difficulty: "Intermediate",
    lessonsCompleted: 8,
    totalLessons: 20,
    stars: 100,
    lessons: [
      { id: "l1", title: "Introduction to Databases", duration: "10 min", isCompleted: true, isLocked: false },
      { id: "l2", title: "SELECT Queries", duration: "15 min", isCompleted: true, isLocked: false },
      { id: "l3", title: "WHERE & Filtering", duration: "18 min", isCompleted: true, isLocked: false },
      { id: "l4", title: "ORDER BY & LIMIT", duration: "12 min", isCompleted: true, isLocked: false },
      { id: "l5", title: "Aggregate Functions", duration: "20 min", isCompleted: true, isLocked: false },
      { id: "l6", title: "GROUP BY & HAVING", duration: "22 min", isCompleted: true, isLocked: false },
      { id: "l7", title: "INNER JOIN", duration: "25 min", isCompleted: true, isLocked: false },
      { id: "l8", title: "LEFT, RIGHT & FULL JOINs", duration: "28 min", isCompleted: true, isLocked: false },
      { id: "l9", title: "Subqueries", duration: "30 min", isCompleted: false, isLocked: false },
      { id: "l10", title: "UNION & INTERSECT", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l11", title: "String Functions", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l12", title: "Date & Time Functions", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l13", title: "Window Functions", duration: "35 min", isCompleted: false, isLocked: true },
      { id: "l14", title: "Indexes & Performance", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l15", title: "Views", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l16", title: "Stored Procedures", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l17", title: "Transactions & ACID", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l18", title: "Normalization", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l19", title: "ER Diagrams", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "Capstone — DB Design Project", duration: "60 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "SELECT & Filtering", questions: 50, attempted: 50, bestScore: 90 },
      { id: "m2", title: "Joins", questions: 40, attempted: 32, bestScore: 82 },
      { id: "m3", title: "Aggregation & GROUP BY", questions: 35, attempted: 10, bestScore: 70 },
      { id: "m4", title: "Subqueries", questions: 30, attempted: 0 },
      { id: "m5", title: "Window Functions", questions: 25, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "SQL Joins Practice", dueDate: "Mar 12, 2026", totalQuestions: 15, completedQuestions: 8, status: "in-progress", points: 75 },
      { id: "a2", title: "Aggregation Challenge", dueDate: "Mar 20, 2026", totalQuestions: 20, completedQuestions: 0, status: "pending", points: 100 },
      { id: "a3", title: "Complex Query Assessment", dueDate: "Apr 1, 2026", totalQuestions: 25, completedQuestions: 0, status: "pending", points: 150 },
    ],
  },

  javascript: {
    id: "javascript",
    title: "JavaScript",
    description: "Build dynamic web applications with modern JavaScript (ES6+).",
    iconColor: "text-yellow-400",
    difficulty: "Beginner",
    lessonsCompleted: 0,
    totalLessons: 25,
    stars: 150,
    lessons: [
      { id: "l1", title: "Introduction to JavaScript", duration: "10 min", isCompleted: false, isLocked: false },
      { id: "l2", title: "Variables — var, let, const", duration: "12 min", isCompleted: false, isLocked: true },
      { id: "l3", title: "Data Types & Operators", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l4", title: "Functions & Arrow Functions", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l5", title: "Arrays & Array Methods", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l6", title: "Objects & Destructuring", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l7", title: "DOM Manipulation", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l8", title: "Events & Event Listeners", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l9", title: "Promises & Async/Await", duration: "35 min", isCompleted: false, isLocked: true },
      { id: "l10", title: "Fetch API", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l11", title: "ES6+ Features", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l12", title: "Classes & OOP", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l13", title: "Modules (import/export)", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l14", title: "Error Handling", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l15", title: "Local Storage & Sessions", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l16", title: "Regular Expressions", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l17", title: "Closures & Scope", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l18", title: "Prototypes & Inheritance", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l19", title: "Event Loop & Callbacks", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "Web APIs overview", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l21", title: "Testing with Jest basics", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l22", title: "Webpack & Bundlers intro", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l23", title: "TypeScript Introduction", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l24", title: "React intro (coming soon)", duration: "—", isCompleted: false, isLocked: true },
      { id: "l25", title: "Capstone: Build a Todo App", duration: "60 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "JS Fundamentals", questions: 45, attempted: 0 },
      { id: "m2", title: "Functions & Scope", questions: 35, attempted: 0 },
      { id: "m3", title: "DOM & Events", questions: 30, attempted: 0 },
      { id: "m4", title: "Async JS", questions: 25, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "JavaScript Fundamentals Quiz", dueDate: "Mar 18, 2026", totalQuestions: 20, completedQuestions: 0, status: "pending", points: 100 },
      { id: "a2", title: "DOM Manipulation Project", dueDate: "Apr 2, 2026", totalQuestions: 10, completedQuestions: 0, status: "pending", points: 150 },
    ],
  },

  "html-css": {
    id: "html-css",
    title: "HTML/CSS",
    description: "Build beautiful, responsive web pages from scratch.",
    iconColor: "text-pink-400",
    difficulty: "Beginner",
    lessonsCompleted: 0,
    totalLessons: 20,
    stars: 100,
    lessons: [
      { id: "l1", title: "HTML Document Structure", duration: "10 min", isCompleted: false, isLocked: false },
      { id: "l2", title: "Headings, Paragraphs & Text", duration: "12 min", isCompleted: false, isLocked: true },
      { id: "l3", title: "Links & Images", duration: "14 min", isCompleted: false, isLocked: true },
      { id: "l4", title: "Lists & Tables", duration: "16 min", isCompleted: false, isLocked: true },
      { id: "l5", title: "Forms & Input Elements", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l6", title: "Semantic HTML5 Elements", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l7", title: "CSS Selectors & Specificity", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l8", title: "Box Model", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l9", title: "Flexbox", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l10", title: "CSS Grid", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l11", title: "Responsive Design & Media Queries", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l12", title: "CSS Variables & Custom Properties", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l13", title: "Animations & Transitions", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l14", title: "Typography & Google Fonts", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l15", title: "Color Theory & Gradients", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l16", title: "Positioning & Z-index", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l17", title: "Pseudo-classes & Elements", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l18", title: "CSS Preprocessors (SCSS)", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l19", title: "Accessibility (a11y)", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "Capstone: Build a Portfolio Page", duration: "60 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "HTML Fundamentals", questions: 40, attempted: 0 },
      { id: "m2", title: "CSS Selectors & Box Model", questions: 35, attempted: 0 },
      { id: "m3", title: "Flexbox & Grid", questions: 30, attempted: 0 },
      { id: "m4", title: "Responsive Design", questions: 25, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "HTML Structure Assessment", dueDate: "Mar 22, 2026", totalQuestions: 15, completedQuestions: 0, status: "pending", points: 75 },
      { id: "a2", title: "CSS Layout Challenge", dueDate: "Apr 5, 2026", totalQuestions: 10, completedQuestions: 0, status: "pending", points: 100 },
    ],
  },

  java: {
    id: "java",
    title: "Java",
    description: "Learn Java — the industry-standard OOP language for backend and Android.",
    iconColor: "text-orange-400",
    difficulty: "Intermediate",
    lessonsCompleted: 0,
    totalLessons: 30,
    stars: 200,
    lessons: [
      { id: "l1", title: "Java Environment Setup & Hello World", duration: "12 min", isCompleted: false, isLocked: false },
      { id: "l2", title: "Data Types & Variables", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l3", title: "Operators & Expressions", duration: "14 min", isCompleted: false, isLocked: true },
      { id: "l4", title: "Control Statements", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l5", title: "Arrays", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l6", title: "Methods & Recursion", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l7", title: "Classes & Objects", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l8", title: "Constructors", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l9", title: "Inheritance", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l10", title: "Polymorphism", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l11", title: "Abstraction & Interfaces", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l12", title: "Encapsulation", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l13", title: "Exception Handling", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l14", title: "Collections Framework", duration: "35 min", isCompleted: false, isLocked: true },
      { id: "l15", title: "Generics", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l16", title: "File I/O", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l17", title: "Multithreading Basics", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l18", title: "Lambda & Streams (Java 8)", duration: "35 min", isCompleted: false, isLocked: true },
      { id: "l19", title: "String & StringBuilder", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "Wrapper Classes & Autoboxing", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l21", title: "JDBC — Database Connectivity", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l22", title: "Design Patterns — Singleton, Factory", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l23", title: "Maven & Build Tools", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l24", title: "Unit Testing with JUnit", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l25", title: "Spring Boot Introduction", duration: "40 min", isCompleted: false, isLocked: true },
      { id: "l26", title: "REST API with Spring Boot", duration: "45 min", isCompleted: false, isLocked: true },
      { id: "l27", title: "JPA & Hibernate", duration: "40 min", isCompleted: false, isLocked: true },
      { id: "l28", title: "Security Basics", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l29", title: "Deployment & Docker intro", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l30", title: "Capstone: REST API Project", duration: "90 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "Java Basics", questions: 50, attempted: 0 },
      { id: "m2", title: "OOP Concepts", questions: 45, attempted: 0 },
      { id: "m3", title: "Collections & Generics", questions: 35, attempted: 0 },
      { id: "m4", title: "Multithreading", questions: 30, attempted: 0 },
      { id: "m5", title: "Java 8 Features", questions: 30, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "Java OOP Assessment", dueDate: "Mar 28, 2026", totalQuestions: 20, completedQuestions: 0, status: "pending", points: 150 },
      { id: "a2", title: "Collections Challenge", dueDate: "Apr 10, 2026", totalQuestions: 15, completedQuestions: 0, status: "pending", points: 120 },
    ],
  },

  quantitative: {
    id: "quantitative",
    title: "Quantitative Aptitude",
    description: "Master quantitative reasoning for placements and competitive exams.",
    iconColor: "text-purple-400",
    difficulty: "Intermediate",
    lessonsCompleted: 5,
    totalLessons: 30,
    stars: 180,
    lessons: [
      { id: "l1", title: "Number Systems", duration: "20 min", isCompleted: true, isLocked: false },
      { id: "l2", title: "HCF & LCM", duration: "18 min", isCompleted: true, isLocked: false },
      { id: "l3", title: "Percentages", duration: "22 min", isCompleted: true, isLocked: false },
      { id: "l4", title: "Profit & Loss", duration: "25 min", isCompleted: true, isLocked: false },
      { id: "l5", title: "Simple & Compound Interest", duration: "28 min", isCompleted: true, isLocked: false },
      { id: "l6", title: "Ratio & Proportion", duration: "20 min", isCompleted: false, isLocked: false },
      { id: "l7", title: "Averages", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l8", title: "Time & Work", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l9", title: "Time, Speed & Distance", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l10", title: "Trains & Boats", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l11", title: "Mixtures & Alligation", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l12", title: "Pipes & Cisterns", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l13", title: "Permutations", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l14", title: "Combinations", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l15", title: "Probability", duration: "32 min", isCompleted: false, isLocked: true },
      { id: "l16", title: "Series & Sequences", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l17", title: "Algebra Basics", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l18", title: "Linear Equations", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l19", title: "Quadratic Equations", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "Geometry — Lines & Angles", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l21", title: "Triangles & Properties", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l22", title: "Circles", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l23", title: "Mensuration — 2D", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l24", title: "Mensuration — 3D", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l25", title: "Data Interpretation — Bar & Line", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l26", title: "Data Interpretation — Pie Charts", duration: "28 min", isCompleted: false, isLocked: true },
      { id: "l27", title: "Logical Reasoning Basics", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l28", title: "Syllogisms", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l29", title: "Blood Relations & Puzzles", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l30", title: "Full Mock Test", duration: "90 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "Percentages", questions: 50, attempted: 45, bestScore: 84 },
      { id: "m2", title: "Profit & Loss", questions: 45, attempted: 40, bestScore: 80 },
      { id: "m3", title: "Time & Work", questions: 40, attempted: 0 },
      { id: "m4", title: "Probability", questions: 35, attempted: 0 },
      { id: "m5", title: "Data Interpretation", questions: 30, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "Aptitude Test — Week 5", dueDate: "Mar 5, 2026", totalQuestions: 30, completedQuestions: 15, status: "overdue", points: 120 },
      { id: "a2", title: "Number Systems Test", dueDate: "Mar 30, 2026", totalQuestions: 25, completedQuestions: 0, status: "pending", points: 100 },
    ],
  },

  verbal: {
    id: "verbal",
    title: "Verbal Ability",
    description: "Strengthen your English language skills for placements.",
    iconColor: "text-teal-400",
    difficulty: "Beginner",
    lessonsCompleted: 0,
    totalLessons: 25,
    stars: 120,
    lessons: [
      { id: "l1", title: "Parts of Speech", duration: "15 min", isCompleted: false, isLocked: false },
      { id: "l2", title: "Tenses — Overview", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l3", title: "Subject-Verb Agreement", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l4", title: "Active & Passive Voice", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l5", title: "Direct & Indirect Speech", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l6", title: "Articles & Prepositions", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l7", title: "Synonyms & Antonyms", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l8", title: "One-Word Substitution", duration: "15 min", isCompleted: false, isLocked: true },
      { id: "l9", title: "Idioms & Phrases", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l10", title: "Sentence Completion", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l11", title: "Reading Comprehension — Strategy", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l12", title: "RC Practice — Set 1", duration: "35 min", isCompleted: false, isLocked: true },
      { id: "l13", title: "Para Jumbles", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l14", title: "Error Spotting", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l15", title: "Fill in the Blanks", duration: "18 min", isCompleted: false, isLocked: true },
      { id: "l16", title: "Cloze Tests", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l17", title: "Vocabulary Building", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l18", title: "Sentence Improvement", duration: "22 min", isCompleted: false, isLocked: true },
      { id: "l19", title: "Analytical Paragraph Writing", duration: "30 min", isCompleted: false, isLocked: true },
      { id: "l20", title: "Email & Formal Writing", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l21", title: "Group Discussion Tips", duration: "20 min", isCompleted: false, isLocked: true },
      { id: "l22", title: "Interview Communication", duration: "25 min", isCompleted: false, isLocked: true },
      { id: "l23", title: "RC Practice — Set 2", duration: "40 min", isCompleted: false, isLocked: true },
      { id: "l24", title: "Full Grammar Mock", duration: "45 min", isCompleted: false, isLocked: true },
      { id: "l25", title: "Final Verbal Mock Test", duration: "60 min", isCompleted: false, isLocked: true },
    ],
    mcqTopics: [
      { id: "m1", title: "Grammar Basics", questions: 55, attempted: 0 },
      { id: "m2", title: "Vocabulary", questions: 80, attempted: 0 },
      { id: "m3", title: "Reading Comprehension", questions: 60, attempted: 0 },
      { id: "m4", title: "Para Jumbles & Error Spotting", questions: 40, attempted: 0 },
    ],
    assignments: [
      { id: "a1", title: "Grammar Basics Test", dueDate: "Mar 25, 2026", totalQuestions: 25, completedQuestions: 0, status: "pending", points: 80 },
    ],
  },
}

// Fallback for courses without explicit data (nodejs, data-science)
const defaultCourse = (id: string): CourseData => ({
  id,
  title: id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
  description: "Course content coming soon.",
  iconColor: "text-primary",
  difficulty: "Intermediate",
  lessonsCompleted: 0,
  totalLessons: 10,
  stars: 100,
  lessons: Array.from({ length: 10 }, (_, i) => ({
    id: `l${i + 1}`,
    title: `Lesson ${i + 1}`,
    duration: "20 min",
    isCompleted: false,
    isLocked: i > 0,
  })),
  mcqTopics: [
    { id: "m1", title: "Topic 1", questions: 30, attempted: 0 },
    { id: "m2", title: "Topic 2", questions: 30, attempted: 0 },
  ],
  assignments: [
    { id: "a1", title: "Assessment 1", dueDate: "Apr 1, 2026", totalQuestions: 15, completedQuestions: 0, status: "pending", points: 100 },
  ],
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

const assignmentStatusConfig = {
  pending: { label: "Pending", className: "bg-secondary text-muted-foreground", icon: Clock },
  "in-progress": { label: "In Progress", className: "bg-amber-500/20 text-amber-400", icon: AlertCircle },
  completed: { label: "Completed", className: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle },
  overdue: { label: "Overdue", className: "bg-red-500/20 text-red-400", icon: AlertCircle },
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const course = courseData[courseId] ?? defaultCourse(courseId)
  const progress = Math.round((course.lessonsCompleted / course.totalLessons) * 100)

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(course.lessons.filter(l => l.isCompleted).map(l => l.id))
  )

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isLocked) {
      toast.error("Lesson locked", { description: "Complete the previous lesson first." })
      return
    }
    if (!completedLessons.has(lesson.id)) {
      setCompletedLessons(prev => new Set([...prev, lesson.id]))
      toast.success(`"${lesson.title}" completed!`, { description: "+10 points earned" })
    } else {
      toast.info(`Reviewing "${lesson.title}"`)
    }
  }

  const handleMCQAttempt = (topic: MCQTopic) => {
    toast.success(`Opening ${topic.title} practice`, { description: `${topic.questions} questions` })
    router.push(`/practice-mcq`)
  }

  const handleAssignment = (assignment: Assignment) => {
    if (assignment.status === "completed") {
      toast.info("Already completed!", { description: `You earned ${assignment.points} points` })
      return
    }
    router.push(`/assignments`)
  }

  const liveProgress = Math.round((completedLessons.size / course.totalLessons) * 100)

  return (
    <div className="space-y-6">
      {/* ── Back + Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/learn")}
          className="mt-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-serif text-foreground">{course.title}</h1>
            <Badge variant="outline" className={cn("text-xs self-start sm:self-auto", difficultyColors[course.difficulty])}>
              {course.difficulty}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{course.description}</p>
        </div>
      </div>

      {/* ── Progress overview card ────────────────────────────────────────── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <ProgressRing progress={liveProgress} size={72} strokeWidth={6} />
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{liveProgress}%</p>
              <p className="text-sm text-muted-foreground">
                {completedLessons.size} / {course.totalLessons} lessons
              </p>
            </div>
          </div>
          <div className="flex-1">
            <Progress value={liveProgress} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{completedLessons.size} completed</span>
              <span>{course.totalLessons - completedLessons.size} remaining</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="text-lg font-semibold text-foreground">{course.stars}</span>
            <span className="text-sm text-muted-foreground ml-1">stars</span>
          </div>
        </div>
      </GlassCard>

      {/* ── 3 Module Tabs ─────────────────────────────────────────────────── */}
      <Tabs defaultValue="lessons">
        <TabsList className="bg-secondary/50 w-full sm:w-auto">
          <TabsTrigger
            value="lessons"
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Lessons
            <Badge variant="outline" className="text-xs border-current ml-1 hidden sm:inline-flex">
              {course.totalLessons}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="mcq"
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <FileQuestion className="h-4 w-4" />
            Practice MCQ
            <Badge variant="outline" className="text-xs border-current ml-1 hidden sm:inline-flex">
              {course.mcqTopics.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            Assignments
            <Badge variant="outline" className="text-xs border-current ml-1 hidden sm:inline-flex">
              {course.assignments.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── MODULE 1: Lessons ──────────────────────────────────────────── */}
        <TabsContent value="lessons" className="mt-6">
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => {
              const isDone = completedLessons.has(lesson.id)
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    lesson.isLocked
                      ? "border-border/30 opacity-50 cursor-not-allowed"
                      : isDone
                      ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                      : "border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                  )}
                  disabled={lesson.isLocked}
                >
                  {/* Status icon */}
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold",
                      isDone
                        ? "bg-emerald-500/20 text-emerald-400"
                        : lesson.isLocked
                        ? "bg-secondary text-muted-foreground"
                        : "bg-primary/20 text-primary"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : lesson.isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-5 w-5" />
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isDone ? "text-emerald-300" : lesson.isLocked ? "text-muted-foreground" : "text-foreground"
                    )}>
                      <span className="text-muted-foreground mr-2">{String(index + 1).padStart(2, "0")}.</span>
                      {lesson.title}
                    </p>
                  </div>

                  {/* Duration + status */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}
                    </span>
                    {isDone && (
                      <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-0">
                        Done
                      </Badge>
                    )}
                    {!isDone && !lesson.isLocked && (
                      <ArrowRight className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>

        {/* ── MODULE 2: Practice MCQ ─────────────────────────────────────── */}
        <TabsContent value="mcq" className="mt-6">
          <div className="space-y-3">
            {course.mcqTopics.map((topic) => {
              const topicProgress = topic.questions > 0
                ? Math.round((topic.attempted / topic.questions) * 100)
                : 0
              return (
                <GlassCard key={topic.id} hover className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileQuestion className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm font-medium text-foreground">{topic.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>{topic.questions} questions</span>
                      {topic.bestScore !== undefined && (
                        <span className="text-emerald-400">Best: {topic.bestScore}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={topicProgress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {topic.attempted}/{topic.questions}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleMCQAttempt(topic)}
                    className={cn(
                      "flex-shrink-0",
                      topic.attempted === 0
                        ? "bg-primary hover:brightness-110 text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    )}
                  >
                    {topic.attempted === 0 ? "Start" : topic.attempted === topic.questions ? "Retry" : "Continue"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </GlassCard>
              )
            })}
          </div>
        </TabsContent>

        {/* ── MODULE 3: Assignments ──────────────────────────────────────── */}
        <TabsContent value="assignments" className="mt-6">
          {course.assignments.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No assignments yet for this course.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {course.assignments.map((assignment) => {
                const config = assignmentStatusConfig[assignment.status]
                const StatusIcon = config.icon
                const pct = assignment.totalQuestions > 0
                  ? Math.round((assignment.completedQuestions / assignment.totalQuestions) * 100)
                  : 0
                return (
                  <GlassCard key={assignment.id} hover className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <ClipboardList className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm font-medium text-foreground">{assignment.title}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due {assignment.dueDate}
                        </span>
                        <span className="text-primary font-medium">{assignment.points} pts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1 max-w-xs" />
                        <span className="text-xs text-muted-foreground">
                          {assignment.completedQuestions}/{assignment.totalQuestions}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge className={cn("flex items-center gap-1 text-xs border-0", config.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleAssignment(assignment)}
                        className={cn(
                          assignment.status === "completed"
                            ? "bg-secondary hover:bg-secondary/80 text-foreground"
                            : "bg-primary hover:brightness-110 text-primary-foreground"
                        )}
                      >
                        {assignment.status === "completed"
                          ? "Review"
                          : assignment.status === "in-progress"
                          ? "Continue"
                          : "Start"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
