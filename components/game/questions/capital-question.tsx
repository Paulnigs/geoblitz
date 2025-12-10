"use client"

import { cn } from "@/lib/utils"
import { Building2 } from "lucide-react"
import type { GameQuestion } from "@/lib/game-context"
import type { Country } from "@/lib/game-data"

interface CapitalQuestionProps {
  question: GameQuestion
  onAnswer: (country: Country) => void
  feedback: "correct" | "wrong" | null
  selectedAnswer: string | null
}

export function CapitalQuestion({ question, onAnswer, feedback, selectedAnswer }: CapitalQuestionProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Capital Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 bg-linear-to-br from-sky-500 to-blue-600 rounded-3xl shadow-xl flex items-center justify-center animate-in zoom-in duration-300">
          <Building2 className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-slate-700 mb-2 text-center animate-in slide-in-from-bottom duration-300">
        What is the capital of
      </h2>
      <div
        className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2 animate-in slide-in-from-bottom duration-300"
        style={{ animationDelay: "100ms" }}
      >
        <span className="text-4xl">{question.country.flag}</span>
        {question.country.name}?
      </div>

      {/* Answer Options - Show capitals instead of country names */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option.name
          const isCorrect = option.name === question.country.name
          const showCorrect = feedback && isCorrect
          const showWrong = feedback === "wrong" && isSelected

          return (
            <button
              key={option.code}
              onClick={() => onAnswer(option)}
              disabled={!!feedback}
              style={{ animationDelay: `${i * 100}ms` }}
              className={cn(
                "p-4 rounded-xl font-medium text-left transition-all animate-in slide-in-from-bottom duration-300",
                "bg-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
                "disabled:hover:scale-100",
                showCorrect && "bg-emerald-500 text-white shadow-emerald-500/25",
                showWrong && "bg-rose-500 text-white shadow-rose-500/25 animate-shake",
              )}
            >
              {option.capital}
            </button>
          )
        })}
      </div>
    </div>
  )
}
