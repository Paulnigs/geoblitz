"use client"

import { GameProvider } from "@/lib/game-context"
import { GameRouter } from "@/components/game/game-router"

export default function Home() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  )
}
