// Single source of truth that links course lessons ↔ Practice MCQ ↔ Assignments

export interface TopicMeta {
  lesson: number
  topic: string          // MCQ topic grouping
  subtopic: string       // MCQ subtopic (matches mcq-data.ts)
  moduleId: string       // Which assignment module covers this lesson
  moduleTitle: string
}

// Keep old name as alias for backwards compatibility
export type PythonTopicMeta = TopicMeta

export const PYTHON_TOPIC_META: Record<number, TopicMeta> = {
  1:  { lesson: 1,  topic: "Python", subtopic: "Introduction & Variables",  moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  2:  { lesson: 2,  topic: "Python", subtopic: "Data Structures",           moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  3:  { lesson: 3,  topic: "Python", subtopic: "Strings & Methods",         moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  4:  { lesson: 4,  topic: "Python", subtopic: "Control Flow",              moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  5:  { lesson: 5,  topic: "Python", subtopic: "Loops",                     moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  6:  { lesson: 6,  topic: "Python", subtopic: "Functions",                 moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  7:  { lesson: 7,  topic: "Python", subtopic: "Built-in Modules",          moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  8:  { lesson: 8,  topic: "Python", subtopic: "File I/O",                  moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  9:  { lesson: 9,  topic: "Python", subtopic: "OOP Basics",                moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
  10: { lesson: 10, topic: "Python", subtopic: "Inheritance",               moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
  11: { lesson: 11, topic: "Python", subtopic: "Exception Handling",        moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
  12: { lesson: 12, topic: "Python", subtopic: "List Comprehensions",       moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
}

export const SQL_TOPIC_META: Record<number, TopicMeta> = {
  1:  { lesson: 1,  topic: "SQL", subtopic: "SELECT & FROM",         moduleId: "sql-basics",        moduleTitle: "SQL Basics Assessment"        },
  2:  { lesson: 2,  topic: "SQL", subtopic: "WHERE Clause",          moduleId: "sql-basics",        moduleTitle: "SQL Basics Assessment"        },
  3:  { lesson: 3,  topic: "SQL", subtopic: "ORDER BY & LIMIT",      moduleId: "sql-basics",        moduleTitle: "SQL Basics Assessment"        },
  4:  { lesson: 4,  topic: "SQL", subtopic: "NULL & CASE WHEN",      moduleId: "sql-basics",        moduleTitle: "SQL Basics Assessment"        },
  5:  { lesson: 5,  topic: "SQL", subtopic: "Aggregate Functions",   moduleId: "sql-intermediate",  moduleTitle: "SQL Intermediate Assessment"  },
  6:  { lesson: 6,  topic: "SQL", subtopic: "GROUP BY & HAVING",     moduleId: "sql-intermediate",  moduleTitle: "SQL Intermediate Assessment"  },
  7:  { lesson: 7,  topic: "SQL", subtopic: "JOINs",                 moduleId: "sql-intermediate",  moduleTitle: "SQL Intermediate Assessment"  },
  8:  { lesson: 8,  topic: "SQL", subtopic: "Subqueries",            moduleId: "sql-intermediate",  moduleTitle: "SQL Intermediate Assessment"  },
  9:  { lesson: 9,  topic: "SQL", subtopic: "DML Operations",        moduleId: "sql-advanced",      moduleTitle: "SQL Advanced Assessment"      },
  10: { lesson: 10, topic: "SQL", subtopic: "Window Functions",      moduleId: "sql-advanced",      moduleTitle: "SQL Advanced Assessment"      },
  11: { lesson: 11, topic: "SQL", subtopic: "CTEs",                  moduleId: "sql-advanced",      moduleTitle: "SQL Advanced Assessment"      },
  12: { lesson: 12, topic: "SQL", subtopic: "Indexes & Performance", moduleId: "sql-advanced",      moduleTitle: "SQL Advanced Assessment"      },
}

export const HTML_CSS_TOPIC_META: Record<number, TopicMeta> = {
  1:  { lesson: 1,  topic: "HTML", subtopic: "Structure",           moduleId: "html-basics",        moduleTitle: "HTML Basics Assessment"        },
  2:  { lesson: 2,  topic: "HTML", subtopic: "Text & Headings",     moduleId: "html-basics",        moduleTitle: "HTML Basics Assessment"        },
  3:  { lesson: 3,  topic: "HTML", subtopic: "Links & Images",      moduleId: "html-basics",        moduleTitle: "HTML Basics Assessment"        },
  4:  { lesson: 4,  topic: "HTML", subtopic: "Lists & Forms",       moduleId: "html-basics",        moduleTitle: "HTML Basics Assessment"        },
  5:  { lesson: 5,  topic: "HTML", subtopic: "Semantic HTML",       moduleId: "html-intermediate",  moduleTitle: "HTML Intermediate Assessment"  },
  6:  { lesson: 6,  topic: "CSS",  subtopic: "Selectors",           moduleId: "css-basics",         moduleTitle: "CSS Basics Assessment"         },
  7:  { lesson: 7,  topic: "CSS",  subtopic: "Box Model",           moduleId: "css-basics",         moduleTitle: "CSS Basics Assessment"         },
  8:  { lesson: 8,  topic: "CSS",  subtopic: "Colors & Typography", moduleId: "css-basics",         moduleTitle: "CSS Basics Assessment"         },
  9:  { lesson: 9,  topic: "CSS",  subtopic: "Flexbox",             moduleId: "css-intermediate",   moduleTitle: "CSS Intermediate Assessment"   },
  10: { lesson: 10, topic: "CSS",  subtopic: "Grid",                moduleId: "css-intermediate",   moduleTitle: "CSS Intermediate Assessment"   },
  11: { lesson: 11, topic: "CSS",  subtopic: "Positioning",         moduleId: "css-intermediate",   moduleTitle: "CSS Intermediate Assessment"   },
  12: { lesson: 12, topic: "CSS",  subtopic: "Responsive Design",   moduleId: "css-intermediate",   moduleTitle: "CSS Intermediate Assessment"   },
  13: { lesson: 13, topic: "CSS",  subtopic: "Animations",          moduleId: "css-advanced",       moduleTitle: "CSS Advanced Assessment"       },
  14: { lesson: 14, topic: "CSS",  subtopic: "Custom Properties",   moduleId: "css-advanced",       moduleTitle: "CSS Advanced Assessment"       },
  15: { lesson: 15, topic: "CSS",  subtopic: "Modern CSS",          moduleId: "css-advanced",       moduleTitle: "CSS Advanced Assessment"       },
}

export const COURSE_TOPIC_META: Record<string, Record<number, TopicMeta>> = {
  python: PYTHON_TOPIC_META,
  sql: SQL_TOPIC_META,
  "html-css": HTML_CSS_TOPIC_META,
}
