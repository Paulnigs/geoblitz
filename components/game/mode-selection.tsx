"use client"

import { Button } from "@/components/ui/button"
import { useGame, type GameMode, type Difficulty } from "@/lib/game-context"
import { Flag, Globe, Building2, MapPin, ArrowLeft, Zap } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getRandomCountry, getRandomCountries } from "@/lib/game-data"

const gameModes: { mode: GameMode; icon: typeof Flag; title: string; description: string; color: string }[] = [
  {
    mode: "flag",
    icon: Flag,
    title: "Guess the Flag",
    description: "Identify countries by their flags",
    color: "from-rose-500 to-pink-500",
  },
  {
    mode: "outline",
    icon: Globe,
    title: "Outline Challenge",
    description: "Recognize country shapes",
    color: "from-emerald-500 to-teal-500",
  },
  {
    mode: "capital",
    icon: Building2,
    title: "Capital City Rush",
    description: "Name the capital cities",
    color: "from-sky-500 to-blue-500",
  },
  {
    mode: "map",
    icon: MapPin,
    title: "Map Pin Mode",
    description: "Tap the correct location",
    color: "from-amber-500 to-orange-500",
  },
]

const difficulties: { level: Difficulty; label: string; time: string; description: string }[] = [
  { level: "easy", label: "Easy", time: "10s", description: "30 common countries" },
  { level: "medium", label: "Medium", time: "10s", description: "100 countries" },
  { level: "hard", label: "Hard", time: "5s", description: "All countries" },
  { level: "blitz", label: "Blitz", time: "3s", description: "All countries, fast!" },
]

export function ModeSelection() {
  const { setScreen, startGame, difficulty, setDifficulty } = useGame()
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)

  const handleStartGame = () => {
    if (selectedMode) {
      const diff = difficulty === "blitz" ? undefined : difficulty
      const country = getRandomCountry(diff)
      const options = [country, ...getRandomCountries(3, country.name, diff)].sort(() => Math.random() - 0.5)
      const question = { country, options, type: selectedMode }
      startGame(selectedMode, question, difficulty)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setScreen("home")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-slate-800">Choose Game Mode</h1>
      </header>

      <main className="px-4 pb-8">
        {/* Game Modes */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {gameModes.map((mode, i) => (
            <button
              key={mode.mode}
              onClick={() => setSelectedMode(mode.mode)}
              style={{ animationDelay: `${i * 100}ms` }}
              className={cn(
                "relative p-4 rounded-2xl text-left transition-all animate-in slide-in-from-bottom duration-300",
                "bg-white shadow-lg hover:shadow-xl",
                selectedMode === mode.mode && "ring-2 ring-offset-2 ring-emerald-500",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center mb-3",
                  mode.color,
                )}
              >
                <mode.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{mode.title}</h3>
              <p className="text-xs text-slate-500">{mode.description}</p>
              {selectedMode === mode.mode && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Difficulty Selection */}
        <div className="animate-in slide-in-from-bottom duration-500 delay-300">
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Difficulty
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.level}
                onClick={() => setDifficulty(diff.level)}
                className={cn(
                  "p-3 rounded-xl text-left transition-all",
                  difficulty === diff.level
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-white text-slate-800 shadow hover:shadow-md",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{diff.label}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      difficulty === diff.level ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {diff.time}
                  </span>
                </div>
                <p className={cn("text-xs", difficulty === diff.level ? "text-emerald-100" : "text-slate-500")}>
                  {diff.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 animate-in fade-in duration-500 delay-500">
          <Button
            onClick={handleStartGame}
            disabled={!selectedMode}
            className="w-full h-14 text-lg font-semibold bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            Start Game
          </Button>
        </div>
      </main>
    </div>
  )
}
