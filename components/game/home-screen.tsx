"use client"

import { Button } from "@/components/ui/button"
import { useGame } from "@/lib/game-context"
import { getRandomCountry, getRandomCountries } from "@/lib/game-data"
import { Globe, Flag, MapPin, Building2, Calendar, Trophy, Settings, Sparkles } from "lucide-react"

export function HomeScreen() {
  const { setScreen, dailyStreak, highScores, totalGamesPlayed, startGame } = useGame()

  const handleDailyChallenge = () => {
    const country = getRandomCountry()
    const options = [country, ...getRandomCountries(3, country.name)].sort(() => Math.random() - 0.5)
    const question = { country, options, type: "daily" as const }
    startGame("daily", question)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-sky-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">GeoBlitz</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setScreen("settings")} className="text-slate-600">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Logo */}
        <div className="mb-8 animate-in zoom-in duration-500">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-emerald-500 via-cyan-500 to-sky-500 flex items-center justify-center shadow-2xl shadow-emerald-500/25">
              <Globe className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-900" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom duration-300">
          <h1 className="text-5xl font-bold bg-linear-to-r from-emerald-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent mb-2">
            GeoBlitz
          </h1>
          <p className="text-slate-500 text-lg">Test your geography knowledge!</p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mb-8 animate-in slide-in-from-bottom duration-500 delay-100">
          <div className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-lg shadow-slate-200/50">
            <div className="text-2xl font-bold text-emerald-600">{dailyStreak}</div>
            <div className="text-xs text-slate-500">Day Streak</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-lg shadow-slate-200/50">
            <div className="text-2xl font-bold text-cyan-600">{Math.max(...Object.values(highScores))}</div>
            <div className="text-xs text-slate-500">High Score</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-lg shadow-slate-200/50">
            <div className="text-2xl font-bold text-sky-600">{totalGamesPlayed}</div>
            <div className="text-xs text-slate-500">Games</div>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="w-full max-w-sm space-y-3 animate-in slide-in-from-bottom duration-500 delay-200">
          <Button
            onClick={() => setScreen("modes")}
            className="w-full h-14 text-lg font-semibold bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25"
          >
            <Flag className="w-5 h-5 mr-2" />
            Play Now
          </Button>

          <Button
            onClick={handleDailyChallenge}
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2 border-amber-400 text-amber-600 hover:bg-amber-50 bg-transparent"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Daily Challenge
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setScreen("leaderboard")}
              variant="outline"
              className="h-12 border-2 border-slate-200 hover:bg-slate-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Scores
            </Button>
            <Button
              onClick={() => setScreen("settings")}
              variant="outline"
              className="h-12 border-2 border-slate-200 hover:bg-slate-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Game Mode Icons Preview */}
        <div className="mt-8 flex gap-6 animate-in slide-in-from-bottom duration-700 delay-300">
          {[
            { icon: Flag, label: "Flags", color: "text-rose-500" },
            { icon: Globe, label: "Outlines", color: "text-emerald-500" },
            { icon: Building2, label: "Capitals", color: "text-sky-500" },
            { icon: MapPin, label: "Map", color: "text-amber-500" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
