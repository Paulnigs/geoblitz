"use client"

import { useGame } from "@/lib/game-context"
import { HomeScreen } from "./home-screen"
import { ModeSelection } from "./mode-selection"
import { GameScreen } from "./game-screen"
import { GameOverScreen } from "./game-over-screen"
import { LeaderboardScreen } from "./leaderboard-screen"
import { SettingsScreen } from "./settings-screen"

export function GameRouter() {
  const { currentScreen } = useGame()

  return (
    <div className="animate-in fade-in duration-200">
      {currentScreen === "home" && <HomeScreen />}
      {currentScreen === "modes" && <ModeSelection />}
      {currentScreen === "game" && <GameScreen />}
      {currentScreen === "gameover" && <GameOverScreen />}
      {currentScreen === "leaderboard" && <LeaderboardScreen />}
      {currentScreen === "settings" && <SettingsScreen />}
    </div>
  )
}
