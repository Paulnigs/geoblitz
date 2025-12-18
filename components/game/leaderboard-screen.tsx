"use client"

import { Button } from "@/components/ui/button"
import { useGame, type GameMode } from "@/lib/game-context"
import { ArrowLeft, Trophy, Flag, Globe, Building2, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const modeIcons: Record<GameMode, typeof Flag> = {
  flag: Flag,
  outline: Globe,
  capital: Building2,
  map: MapPin,
  daily: Calendar,
}

const modeNames: Record<GameMode, string> = {
  flag: "Guess the Flag",
  outline: "Outline Challenge",
  capital: "Capital Rush",
  map: "Map Pin",
  daily: "Daily Challenge",
}

export function LeaderboardScreen() {
  const { setScreen, highScores, dailyStreak, totalGamesPlayed } = useGame()

  const sortedModes = (Object.entries(highScores) as [GameMode, number][]).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setScreen("home")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-slate-800">Your Scores</h1>
      </header>

      <main className="px-4 pb-8">
        {/* Overall Stats */}
        <div className="bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl p-6 mb-6 text-white shadow-xl shadow-amber-500/25 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="text-4xl font-bold">{Math.max(...Object.values(highScores))}</div>
              <div className="text-amber-100">Best Overall Score</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-2xl font-bold">{dailyStreak}</div>
              <div className="text-sm text-amber-100">Day Streak</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="text-2xl font-bold">{totalGamesPlayed}</div>
              <div className="text-sm text-amber-100">Games Played</div>
            </div>
          </div>
        </div>

        {/* Mode Scores */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">High Scores by Mode</h2>
        <div className="space-y-3">
          {sortedModes.map(([mode, modeScore], i) => {
            const Icon = modeIcons[mode]
            return (
              <div
                key={mode}
                style={{ animationDelay: `${i * 100}ms` }}
                className={cn(
                  "bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4 animate-in slide-in-from-left duration-300",
                  i === 0 && "ring-2 ring-amber-400",
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      mode === "flag" && "bg-rose-100 text-rose-600",
                      mode === "outline" && "bg-emerald-100 text-emerald-600",
                      mode === "capital" && "bg-sky-100 text-sky-600",
                      mode === "map" && "bg-amber-100 text-amber-600",
                      mode === "daily" && "bg-purple-100 text-purple-600",
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {i === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{modeNames[mode]}</div>
                  <div className="text-sm text-slate-500">Best score</div>
                </div>
                <div className="text-2xl font-bold text-slate-800">{modeScore}</div>
              </div>
            )
          })}
        </div>

        {/* Play Button */}
        <div className="mt-8 animate-in fade-in duration-500 delay-500">
          <Button
            onClick={() => setScreen("modes")}
            className="w-full h-14 text-lg font-semibold bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25"
          >
            Play to Beat Your Scores!
          </Button>
        </div>
      </main>
    </div>
  )
}
