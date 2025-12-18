"use client"

import { useEffect, useState, useCallback } from "react"
import { useGame } from "@/lib/game-context"
import { getRandomCountry, getRandomCountries } from "@/lib/game-data"
import { soundManager } from "@/lib/sounds"
import { Button } from "@/components/ui/button"
import { Heart, Flame, Clock, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FlagQuestion } from "./questions/flag-question"
import { OutlineQuestion } from "./questions/outline-question"
import { CapitalQuestion } from "./questions/capital-question"
import { MapQuestion } from "./questions/map-question"
import { ConfettiEffect } from "./confetti-effect"
import type { Country } from "@/lib/game-data"

export function GameScreen() {
  const {
    gameMode,
    difficulty,
    score,
    streak,
    lives,
    currentQuestion,
    questionIndex,
    totalQuestions,
    timeRemaining,
    isGameActive,
    soundEnabled,
    answerQuestion,
    nextQuestion,
    decrementTime,
    endGame,
  } = useGame()

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!isGameActive || feedback) return

    const timer = setInterval(() => {
      decrementTime()
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive, feedback, decrementTime])

  // Warning sound for last 3 seconds
  useEffect(() => {
    if (timeRemaining <= 3 && timeRemaining > 0 && soundEnabled && !feedback) {
      soundManager.playWarning()
    }
  }, [timeRemaining, soundEnabled, feedback])

  // Sound enabled sync
  useEffect(() => {
    soundManager.setEnabled(soundEnabled)
  }, [soundEnabled])

  const generateNextQuestion = useCallback(() => {
    const diff = difficulty === "blitz" ? undefined : difficulty
    const country = getRandomCountry(diff)
    const options = [country, ...getRandomCountries(3, country.name, diff)].sort(() => Math.random() - 0.5)
    return { country, options, type: gameMode }
  }, [difficulty, gameMode])

  const handleAnswer = useCallback(
    (answer: Country) => {
      if (feedback || !currentQuestion) return

      setSelectedAnswer(answer.name)
      const isCorrect = answerQuestion(answer, timeRemaining)

      if (isCorrect) {
        setFeedback("correct")
        soundManager.playCorrect()

        // Check for streak milestones
        const newStreak = streak + 1
        if (newStreak === 5 || newStreak === 10 || newStreak === 20) {
          soundManager.playStreak()
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 2000)
        }
      } else {
        setFeedback("wrong")
        soundManager.playWrong()
      }

      setTimeout(() => {
        setFeedback(null)
        setSelectedAnswer(null)
        const newQuestion = generateNextQuestion()
        nextQuestion(newQuestion)
      }, 1500)
    },
    [feedback, currentQuestion, answerQuestion, timeRemaining, streak, nextQuestion, generateNextQuestion],
  )

  const handleMapClick = useCallback(
    (clickedCountry: Country) => {
      handleAnswer(clickedCountry)
    },
    [handleAnswer],
  )

  if (!currentQuestion) return null

  const timerPercentage = (timeRemaining / (difficulty === "hard" ? 5 : difficulty === "blitz" ? 3 : 10)) * 100

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-sky-50 flex flex-col">
      {/* Confetti */}
      {showConfetti && <ConfettiEffect />}

      {/* Header */}
      <header className="p-4">
        <div className="flex items-center justify-between mb-3">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  i < lives ? "bg-rose-100 scale-100" : "scale-0",
                )}
              >
                {i < lives && <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
              </div>
            ))}
          </div>

          {/* Score */}
          <div className="bg-white rounded-xl px-4 py-2 shadow-lg transition-transform hover:scale-105">
            <span className="text-2xl font-bold text-emerald-600">{score}</span>
          </div>

          {/* Close Button */}
          <Button variant="ghost" size="icon" onClick={() => endGame()} className="text-slate-400">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Timer Bar */}
        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
              timeRemaining <= 3 ? "bg-rose-500" : "bg-emerald-500",
            )}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>

        {/* Progress & Streak */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>
              Question {questionIndex + 1}/{totalQuestions}
            </span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold animate-in zoom-in">
              <Flame className="w-4 h-4" />
              {streak} streak
              {streak >= 5 && (
                <span className="text-xs ml-1">({streak >= 20 ? "3x" : streak >= 10 ? "2x" : "1.5x"})</span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Question Area */}
      <main className="flex-1 flex flex-col p-4">
        <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
          {gameMode === "flag" && (
            <FlagQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              feedback={feedback}
              selectedAnswer={selectedAnswer}
            />
          )}
          {gameMode === "outline" && (
            <OutlineQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              feedback={feedback}
              selectedAnswer={selectedAnswer}
            />
          )}
          {gameMode === "capital" && (
            <CapitalQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              feedback={feedback}
              selectedAnswer={selectedAnswer}
            />
          )}
          {gameMode === "map" && (
            <MapQuestion question={currentQuestion} onMapClick={handleMapClick} feedback={feedback} />
          )}
          {gameMode === "daily" && (
            <FlagQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              feedback={feedback}
              selectedAnswer={selectedAnswer}
            />
          )}
        </div>
      </main>

      {feedback && (
        <div
          className={cn(
            "fixed inset-0 pointer-events-none flex items-center justify-center animate-in fade-in duration-150",
            feedback === "correct" ? "bg-emerald-500/20" : "bg-rose-500/20",
          )}
        >
          <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-200">
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center",
                feedback === "correct" ? "bg-emerald-500" : "bg-rose-500",
              )}
            >
              {feedback === "correct" ? (
                <Check className="w-14 h-14 text-white stroke-3" />
              ) : (
                <X className="w-14 h-14 text-white stroke-3" />
              )}
            </div>
            <span className={cn("text-2xl font-bold", feedback === "correct" ? "text-emerald-600" : "text-rose-600")}>
              {feedback === "correct" ? "Correct!" : "Wrong!"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
