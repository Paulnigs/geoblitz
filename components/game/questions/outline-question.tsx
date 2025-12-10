"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { GameQuestion } from "@/lib/game-context"
import type { Country } from "@/lib/game-data"

interface OutlineQuestionProps {
  question: GameQuestion
  onAnswer: (country: Country) => void
  feedback: "correct" | "wrong" | null
  selectedAnswer: string | null
}

const countryOutlines: Record<string, string> = {
  // Americas
  US: "M10,35 L15,30 L25,32 L35,28 L45,30 L55,25 L65,28 L75,30 L85,28 L90,32 L88,38 L80,42 L70,40 L60,45 L50,42 L40,48 L30,45 L20,50 L12,45 L10,35 M5,55 L15,50 L20,55 L15,60 L5,58 Z",
  CA: "M5,10 L15,8 L30,12 L45,8 L60,10 L75,5 L90,10 L95,20 L90,35 L80,30 L70,35 L55,30 L40,35 L25,32 L10,38 L5,25 Z",
  MX: "M15,30 L25,25 L40,28 L50,35 L55,50 L45,60 L35,55 L25,60 L15,50 L10,40 Z",
  BR: "M35,20 L55,15 L75,25 L85,40 L80,60 L70,75 L55,80 L40,70 L30,55 L25,40 L35,20 Z",
  AR: "M35,15 L50,12 L55,30 L60,50 L55,70 L50,85 L40,90 L35,75 L30,55 L35,35 Z",
  CO: "M25,30 L40,25 L55,35 L50,55 L35,60 L20,50 L25,30 Z",
  PE: "M20,30 L35,25 L45,40 L40,60 L25,65 L15,50 L20,30 Z",
  CL: "M40,10 L50,15 L52,35 L48,55 L45,75 L42,90 L38,85 L40,65 L42,45 L40,25 Z",

  // Europe
  GB: "M35,15 L50,10 L55,25 L60,40 L50,50 L40,45 L35,55 L25,45 L30,30 L35,15 M60,55 L70,50 L75,60 L65,65 Z",
  FR: "M30,20 L50,15 L70,25 L75,45 L65,60 L45,65 L30,55 L25,40 L30,20 Z",
  DE: "M35,20 L55,15 L70,25 L75,45 L65,55 L50,60 L35,50 L30,35 Z",
  IT: "M40,15 L55,10 L60,25 L55,45 L45,70 L40,80 L35,70 L40,50 L45,30 Z",
  ES: "M15,30 L40,20 L70,30 L75,50 L60,65 L35,70 L15,55 L10,40 Z",
  PT: "M20,25 L35,20 L40,45 L35,70 L20,65 L15,45 Z",
  NL: "M35,25 L55,20 L60,40 L50,50 L35,45 L30,35 Z",
  BE: "M30,30 L50,25 L55,45 L45,55 L30,50 L25,40 Z",
  CH: "M30,30 L50,25 L55,45 L45,55 L30,50 L25,40 Z",
  AT: "M25,35 L75,30 L80,45 L70,55 L30,55 L20,45 Z",
  PL: "M25,25 L75,20 L80,50 L70,60 L30,60 L20,45 Z",
  SE: "M40,5 L55,10 L60,35 L55,60 L50,80 L45,70 L40,50 L42,25 Z",
  NO: "M35,5 L50,8 L55,25 L50,50 L45,75 L40,60 L38,35 L35,15 Z",
  FI: "M40,10 L60,15 L65,40 L55,65 L45,60 L35,40 L40,10 Z",
  DK: "M35,35 L55,30 L60,50 L45,60 L30,50 Z M65,25 L75,20 L80,35 L70,40 Z",
  IE: "M25,25 L45,20 L55,35 L50,55 L35,60 L20,45 Z",
  GR: "M25,30 L50,20 L70,35 L65,55 L45,65 L30,55 L20,45 Z M75,55 L85,50 L88,60 L80,65 Z",
  RU: "M5,20 L95,15 L98,45 L90,55 L70,50 L50,55 L30,50 L10,55 L5,40 Z",
  UA: "M15,30 L85,25 L90,50 L75,60 L45,55 L20,60 L10,45 Z",
  RO: "M20,30 L80,25 L85,55 L70,65 L30,60 L15,50 Z",
  CZ: "M20,35 L80,30 L85,50 L75,55 L25,55 L15,45 Z",
  HU: "M15,35 L85,30 L88,55 L75,60 L25,60 L12,50 Z",

  // Asia
  CN: "M15,20 L85,15 L95,45 L85,70 L60,75 L35,65 L20,50 L10,35 Z",
  JP: "M55,15 L70,20 L75,40 L70,60 L60,75 L50,70 L45,50 L50,30 Z M30,45 L40,40 L45,55 L35,60 Z",
  IN: "M30,15 L70,20 L80,45 L65,75 L45,85 L25,70 L20,45 Z",
  KR: "M35,25 L55,20 L65,45 L55,70 L40,65 L30,45 Z",
  TH: "M35,15 L55,20 L60,45 L55,70 L45,80 L40,65 L35,45 Z",
  VN: "M45,10 L60,20 L55,45 L50,70 L40,85 L35,65 L40,40 Z",
  ID: "M10,40 L30,35 L55,40 L80,35 L95,45 L85,55 L60,50 L35,55 L15,50 Z",
  PH: "M40,15 L60,20 L65,45 L55,70 L45,65 L35,45 Z M70,50 L80,55 L75,70 L65,65 Z",
  MY: "M25,40 L50,35 L55,55 L40,60 L20,50 Z M65,35 L85,40 L80,55 L60,50 Z",
  SG: "M40,40 L60,38 L62,52 L55,58 L42,55 L38,48 Z",
  PK: "M20,25 L60,20 L75,35 L70,55 L45,65 L25,55 L15,40 Z",
  BD: "M30,30 L55,25 L65,45 L55,65 L35,60 L25,45 Z",

  // Middle East
  SA: "M20,25 L75,20 L85,50 L70,75 L40,80 L20,60 L15,40 Z",
  AE: "M30,35 L70,30 L75,50 L60,60 L35,55 L25,45 Z",
  TR: "M10,35 L90,30 L95,50 L80,55 L50,58 L20,55 L5,48 Z",
  IR: "M20,25 L80,20 L90,50 L75,70 L40,65 L15,50 Z",
  IQ: "M25,25 L70,20 L80,50 L65,65 L35,60 L20,45 Z",
  IL: "M40,20 L55,18 L58,50 L52,75 L42,70 L38,45 Z",
  EG: "M25,20 L75,15 L80,55 L60,80 L30,75 L20,50 Z",

  // Africa
  ZA: "M25,25 L75,20 L85,50 L70,80 L30,85 L15,55 Z",
  NG: "M20,25 L80,20 L85,55 L70,70 L30,65 L15,45 Z",
  KE: "M30,20 L70,25 L75,55 L60,80 L40,75 L25,50 Z",
  ET: "M20,30 L80,25 L85,55 L65,70 L35,65 L15,50 Z",
  GH: "M30,20 L60,18 L65,55 L55,80 L35,75 L25,50 Z",
  TZ: "M25,25 L75,20 L80,55 L65,80 L35,75 L20,50 Z",
  MA: "M15,30 L60,20 L75,40 L70,65 L40,70 L20,55 Z",
  DZ: "M20,15 L80,10 L90,50 L75,80 L30,75 L10,45 Z",

  // Oceania
  AU: "M15,25 L85,20 L95,50 L80,75 L50,80 L20,70 L10,45 Z M75,60 L90,55 L92,70 L82,75 Z",
  NZ: "M55,25 L70,30 L75,55 L65,75 L55,70 L50,50 Z M30,55 L45,60 L40,80 L25,75 Z",
}

export function OutlineQuestion({ question, onAnswer, feedback, selectedAnswer }: OutlineQuestionProps) {
  const [path, setPath] = useState<string>("")

  useEffect(() => {
    // Get the country outline path
    const countryPath = countryOutlines[question.country.code] || countryOutlines["US"]
    setPath(countryPath)
  }, [question.country.code])

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Country Outline */}
      <div className="mb-8">
        <div className="w-56 h-56 bg-white rounded-3xl shadow-xl flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Shadow/depth effect */}
            <path
              d={path}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinejoin="round"
              transform="translate(2, 2)"
              opacity="0.3"
            />
            {/* Main outline fill */}
            <path d={path} fill="#e2e8f0" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-slate-700 mb-6 text-center">Identify this country by its shape</h2>

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
