"use client"

import { Button } from "@/components/ui/button"
import { useGame } from "@/lib/game-context"
import { getRandomCountry, getRandomCountries } from "@/lib/game-data"
import { Trophy, Target, Flame, RotateCcw, Home, Share2, Star } from "lucide-react"

export function GameOverScreen() {
  const {
    score,
    correctAnswers,
    wrongAnswers,
    streak,
    highScores,
    gameMode,
    difficulty,
    totalQuestions,
    setScreen,
    startGame,
  } = useGame()

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const isHighScore = score >= highScores[gameMode]

  const handleShare = () => {
    const text = `GeoBlitz Score: ${score} points!\n${accuracy}% accuracy\nBest streak: ${streak}\n\nCan you beat my score?`

    if (navigator.share) {
      navigator.share({
        title: "GeoBlitz Score",
        text,
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const handlePlayAgain = () => {
    const diff = difficulty === "blitz" ? undefined : difficulty
    const country = getRandomCountry(diff)
    const options = [country, ...getRandomCountries(3, country.name, diff)].sort(() => Math.random() - 0.5)
    const question = { country, options, type: gameMode }
    startGame(gameMode, question, difficulty)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 flex flex-col items-center justify-center p-4">
      {/* High Score Badge */}
      {isHighScore && (
        <div className="mb-6 animate-in zoom-in spin-in-180 duration-700">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <Star className="w-12 h-12 text-white fill-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              NEW!
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-2 animate-in slide-in-from-top duration-300">
        {isHighScore ? "New High Score!" : "Game Over"}
      </h1>

      {/* Score Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 mb-6 animate-in slide-in-from-bottom duration-500">
        {/* Main Score */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            {score}
          </div>
          <div className="text-slate-500 font-medium">points</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{accuracy}%</div>
            <div className="text-xs text-slate-500">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-amber-100 rounded-xl flex items-center justify-center mb-2">
              <Flame className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{streak}</div>
            <div className="text-xs text-slate-500">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-sky-100 rounded-xl flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{highScores[gameMode]}</div>
            <div className="text-xs text-slate-500">High Score</div>
          </div>
        </div>

        {/* Correct/Wrong breakdown */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">{correctAnswers} correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600">{wrongAnswers} wrong</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3 animate-in slide-in-from-bottom duration-700 delay-200">
        <Button
          onClick={handlePlayAgain}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Play Again
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleShare} variant="outline" className="h-12 border-2 bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={() => setScreen("home")} variant="outline" className="h-12 border-2">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
