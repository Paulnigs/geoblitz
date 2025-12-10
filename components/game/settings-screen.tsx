"use client"

import { Button } from "@/components/ui/button"
import { useGame, type Difficulty } from "@/lib/game-context"
import { ArrowLeft, Volume2, VolumeX, Zap, RotateCcw, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const difficulties: { level: Difficulty; label: string; description: string }[] = [
  { level: "easy", label: "Easy", description: "10 seconds, common countries" },
  { level: "medium", label: "Medium", description: "10 seconds, more countries" },
  { level: "hard", label: "Hard", description: "5 seconds, all countries" },
  { level: "blitz", label: "Blitz", description: "3 seconds, ultimate challenge" },
]

export function SettingsScreen() {
  const { setScreen, soundEnabled, toggleSound, difficulty, setDifficulty } = useGame()

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.removeItem("geoblitz-storage")
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setScreen("home")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
      </header>

      <main className="px-4 pb-8 space-y-6">
        {/* Sound Toggle */}
        <div className="bg-white rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Volume2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <VolumeX className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="font-semibold text-slate-800">Sound Effects</div>
                <div className="text-sm text-slate-500">{soundEnabled ? "On" : "Off"}</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={cn(
                "w-14 h-8 rounded-full transition-colors relative",
                soundEnabled ? "bg-emerald-500" : "bg-slate-300",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform",
                  soundEnabled ? "translate-x-7" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </div>

        {/* Default Difficulty */}
        <div
          className="bg-white rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom duration-300"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Default Difficulty</div>
              <div className="text-sm text-slate-500">Used when starting a new game</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.level}
                onClick={() => setDifficulty(diff.level)}
                className={cn(
                  "p-3 rounded-xl text-left transition-all",
                  difficulty === diff.level
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200",
                )}
              >
                <div className="font-semibold">{diff.label}</div>
                <div className={cn("text-xs", difficulty === diff.level ? "text-emerald-100" : "text-slate-500")}>
                  {diff.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div
          className="bg-white rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom duration-300"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">About GeoBlitz</div>
              <div className="text-sm text-slate-500">Version 1.0</div>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            GeoBlitz is a fast-paced geography quiz game designed to test and improve your knowledge of countries,
            flags, capitals, and world geography. Challenge yourself with different game modes and compete for high
            scores!
          </p>
        </div>

        {/* Reset Progress */}
        <div className="animate-in slide-in-from-bottom duration-300" style={{ animationDelay: "300ms" }}>
          <Button
            onClick={handleResetProgress}
            variant="outline"
            className="w-full h-12 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Progress
          </Button>
        </div>
      </main>
    </div>
  )
}
