"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { GameQuestion } from "@/lib/game-context"
import type { Country } from "@/lib/game-data"

interface FlagQuestionProps {
  question: GameQuestion
  onAnswer: (country: Country) => void
  feedback: "correct" | "wrong" | null
  selectedAnswer: string | null
}

export function FlagQuestion({ question, onAnswer, feedback, selectedAnswer }: FlagQuestionProps) {
  const [imageError, setImageError] = useState(false)

  const flagUrl = `https://flagcdn.com/w320/${question.country.code.toLowerCase()}.png`

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Flag Display - Using real flag images */}
      <div className="mb-8">
        <div className="w-64 h-44 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 animate-in zoom-in duration-300 overflow-hidden">
          {imageError ? (
            // Fallback to emoji if image fails
            <span className="text-8xl">{question.country.flag}</span>
          ) : (
            <Image
              src={flagUrl || "/placeholder.svg"}
              alt={`Flag of ${question.country.name}`}
              width={320}
              height={213}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
              priority
            />
          )}
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-slate-700 mb-6 text-center">Which country does this flag belong to?</h2>

      {/* Answer Options */}
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
                showWrong && "bg-rose-500 text-white shadow-rose-500/25",
              )}
            >
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
