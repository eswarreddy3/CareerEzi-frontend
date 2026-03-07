"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  XCircle,
  Flag,
  ArrowLeft,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Topic {
  id: string
  name: string
  subtopics: { id: string; name: string; questions: number }[]
}

const topics: Topic[] = [
  {
    id: "aptitude",
    name: "Aptitude",
    subtopics: [
      { id: "percentages", name: "Percentages", questions: 50 },
      { id: "profit-loss", name: "Profit & Loss", questions: 45 },
      { id: "time-work", name: "Time & Work", questions: 40 },
      { id: "probability", name: "Probability", questions: 35 },
    ],
  },
  {
    id: "verbal",
    name: "Verbal",
    subtopics: [
      { id: "reading", name: "Reading Comprehension", questions: 60 },
      { id: "grammar", name: "Grammar", questions: 55 },
      { id: "vocabulary", name: "Vocabulary", questions: 80 },
    ],
  },
  {
    id: "python",
    name: "Python",
    subtopics: [
      { id: "basics", name: "Basics", questions: 40 },
      { id: "data-types", name: "Data Types", questions: 35 },
      { id: "functions", name: "Functions", questions: 30 },
      { id: "oop", name: "OOP Concepts", questions: 45 },
    ],
  },
  {
    id: "sql",
    name: "SQL",
    subtopics: [
      { id: "select", name: "SELECT Queries", questions: 50 },
      { id: "joins", name: "Joins", questions: 40 },
      { id: "aggregation", name: "Aggregation", questions: 35 },
    ],
  },
  {
    id: "data-structures",
    name: "Data Structures",
    subtopics: [
      { id: "arrays", name: "Arrays", questions: 60 },
      { id: "linked-lists", name: "Linked Lists", questions: 45 },
      { id: "trees", name: "Trees", questions: 50 },
      { id: "graphs", name: "Graphs", questions: 40 },
    ],
  },
]

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "What is the output of print(type([]) is list) in Python?",
    options: ["True", "False", "Error", "None"],
    correctAnswer: 0,
    explanation: "The type() function returns the type of an object. [] is a list, so type([]) returns <class 'list'>. Comparing it with 'list' using 'is' returns True because they are the same type object.",
  },
  {
    id: 2,
    text: "Which of the following is NOT a valid Python data type?",
    options: ["int", "float", "char", "str"],
    correctAnswer: 2,
    explanation: "Python does not have a 'char' data type. Single characters are represented as strings of length 1. The valid data types shown are int, float, and str.",
  },
  {
    id: 3,
    text: "What will be the output of: len('Hello World'.split())?",
    options: ["11", "2", "10", "1"],
    correctAnswer: 1,
    explanation: "The split() method without arguments splits the string by whitespace. 'Hello World' has two words, so split() returns ['Hello', 'World'], and len() of this list is 2.",
  },
]

type QuestionStatus = "unattempted" | "answered" | "marked"

export default function PracticeMCQPage() {
  const [expandedTopics, setExpandedTopics] = useState<string[]>(["python"])
  const [selectedTopic, setSelectedTopic] = useState("python")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>(
    Array(sampleQuestions.length).fill("unattempted")
  )
  const [showTimer, setShowTimer] = useState(true)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes

  const currentQuestion = sampleQuestions[currentQuestionIndex]
  const totalQuestions = sampleQuestions.length

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(optionIndex)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer")
      return
    }
    
    setIsSubmitted(true)
    const newStatuses = [...questionStatuses]
    newStatuses[currentQuestionIndex] = "answered"
    setQuestionStatuses(newStatuses)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      toast.success("Correct!", {
        description: "+10 points earned",
      })
    } else {
      toast.error("Incorrect", {
        description: "Review the explanation below",
      })
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsSubmitted(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setSelectedAnswer(null)
      setIsSubmitted(false)
    }
  }

  const handleMarkForReview = () => {
    const newStatuses = [...questionStatuses]
    newStatuses[currentQuestionIndex] = "marked"
    setQuestionStatuses(newStatuses)
    toast.info("Marked for review")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: QuestionStatus, index: number) => {
    if (index === currentQuestionIndex) return "bg-primary text-primary-foreground"
    switch (status) {
      case "answered": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "marked": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default: return "bg-secondary/50 text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel - Topic Tree */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <GlassCard className="h-full overflow-y-auto">
          <h2 className="font-semibold font-serif mb-4 text-foreground">Topics</h2>
          <div className="space-y-1">
            {topics.map((topic) => (
              <div key={topic.id}>
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors text-foreground"
                >
                  <span className="text-sm font-medium">{topic.name}</span>
                  {expandedTopics.includes(topic.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                
                {expandedTopics.includes(topic.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {topic.subtopics.map((subtopic) => (
                      <button
                        key={subtopic.id}
                        onClick={() => setSelectedTopic(subtopic.id)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg text-sm transition-colors",
                          selectedTopic === subtopic.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{subtopic.name}</span>
                          <span className="text-xs">{subtopic.questions}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Right Panel - Question Card */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <Progress 
              value={((currentQuestionIndex + 1) / totalQuestions) * 100} 
              className="w-32 h-2"
            />
          </div>
          {showTimer && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Question Card */}
        <GlassCard className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-6 text-foreground">{currentQuestion.text}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer
                const isSelected = index === selectedAnswer
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isSubmitted}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200 border",
                      !isSubmitted && isSelected && "border-primary bg-primary/10 text-foreground",
                      !isSubmitted && !isSelected && "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground",
                      isSubmitted && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                      isSubmitted && isSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-400",
                      isSubmitted && !isSelected && !isCorrect && "border-border text-muted-foreground opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border",
                        !isSubmitted && isSelected && "border-primary bg-primary text-primary-foreground",
                        !isSubmitted && !isSelected && "border-border text-muted-foreground",
                        isSubmitted && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                        isSubmitted && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white",
                        isSubmitted && !isSelected && !isCorrect && "border-border text-muted-foreground"
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle className="h-5 w-5 ml-auto text-emerald-400" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 ml-auto text-red-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {isSubmitted && (
              <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
                <h4 className="font-medium mb-2 text-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Explanation
                </h4>
                <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkForReview}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <Flag className="h-4 w-4 mr-2" />
                Mark for Review
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {!isSubmitted ? (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Question Palette */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Question Palette</h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
                  <span>Review</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-secondary/50" />
                  <span>Unattempted</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {questionStatuses.map((status, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setSelectedAnswer(null)
                    setIsSubmitted(false)
                  }}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-all border",
                    getStatusColor(status, index)
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
