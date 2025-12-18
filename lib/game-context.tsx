"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import type { Country } from "./game-data"

export type GameMode = "flag" | "outline" | "capital" | "map" | "daily"
export type Difficulty = "easy" | "medium" | "hard" | "blitz"
export type Screen = "home" | "modes" | "game" | "gameover" | "leaderboard" | "settings"

export interface GameQuestion {
  country: Country
  options: Country[]
  type: GameMode
}

interface GameState {
  currentScreen: Screen
  gameMode: GameMode
  difficulty: Difficulty
  soundEnabled: boolean
  score: number
  streak: number
  lives: number
  currentQuestion: GameQuestion | null
  questionIndex: number
  totalQuestions: number
  timeRemaining: number
  isGameActive: boolean
  correctAnswers: number
  wrongAnswers: number
  highScores: Record<GameMode, number>
  dailyStreak: number
  lastDailyDate: string | null
  totalGamesPlayed: number
  mapAnswer: { lat: number; lng: number } | null
}

interface GameContextType extends GameState {
  setScreen: (screen: Screen) => void
  setGameMode: (mode: GameMode) => void
  setDifficulty: (difficulty: Difficulty) => void
  toggleSound: () => void
  startGame: (mode: GameMode, question: GameQuestion, difficulty?: Difficulty) => void
  answerQuestion: (answer: Country, timeLeft: number) => boolean
  nextQuestion: (question: GameQuestion) => void
  endGame: () => void
  setTimeRemaining: (time: number) => void
  decrementTime: () => void
  setMapAnswer: (coords: { lat: number; lng: number } | null) => void
  calculateMapScore: (actual: [number, number], guess: { lat: number; lng: number }) => number
}

const GameContext = createContext<GameContextType | null>(null)

const STORAGE_KEY = "geoblitz-storage"

const defaultState: GameState = {
  currentScreen: "home",
  gameMode: "flag",
  difficulty: "easy",
  soundEnabled: true,
  score: 0,
  streak: 0,
  lives: 3,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 10,
  timeRemaining: 10,
  isGameActive: false,
  correctAnswers: 0,
  wrongAnswers: 0,
  highScores: { flag: 0, outline: 0, capital: 0, map: 0, daily: 0 },
  dailyStreak: 0,
  lastDailyDate: null,
  totalGamesPlayed: 0,
  mapAnswer: null,
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState)
  const [isHydrated, setIsHydrated] = useState(false)
  const currentQuestionRef = useRef<GameQuestion | null>(null)
  const correctCountryRef = useRef<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setState((prev) => ({
          ...prev,
          highScores: parsed.highScores || prev.highScores,
          dailyStreak: parsed.dailyStreak || prev.dailyStreak,
          lastDailyDate: parsed.lastDailyDate || prev.lastDailyDate,
          totalGamesPlayed: parsed.totalGamesPlayed || prev.totalGamesPlayed,
          soundEnabled: parsed.soundEnabled ?? prev.soundEnabled,
          difficulty: parsed.difficulty || prev.difficulty,
        }))
      }
    } catch (e) {
      console.error("Failed to load from localStorage:", e)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage
  const saveToStorage = useCallback((newState: GameState) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          highScores: newState.highScores,
          dailyStreak: newState.dailyStreak,
          lastDailyDate: newState.lastDailyDate,
          totalGamesPlayed: newState.totalGamesPlayed,
          soundEnabled: newState.soundEnabled,
          difficulty: newState.difficulty,
        }),
      )
    } catch (e) {
      console.error("Failed to save to localStorage:", e)
    }
  }, [])

  const setScreen = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, currentScreen: screen }))
  }, [])

  const setGameMode = useCallback((mode: GameMode) => {
    setState((prev) => ({ ...prev, gameMode: mode }))
  }, [])

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      setState((prev) => {
        const newState = { ...prev, difficulty }
        saveToStorage(newState)
        return newState
      })
    },
    [saveToStorage],
  )

  const toggleSound = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, soundEnabled: !prev.soundEnabled }
      saveToStorage(newState)
      return newState
    })
  }, [saveToStorage])

  const startGame = useCallback((mode: GameMode, question: GameQuestion, difficulty?: Difficulty) => {
    correctCountryRef.current = question.country.name
    console.log("[v0] Starting game, correct answer:", question.country.name)

    setState((prev) => {
      const diff = difficulty || prev.difficulty
      const timeLimit = diff === "hard" ? 5 : diff === "blitz" ? 3 : 10
      return {
        ...prev,
        gameMode: mode,
        difficulty: diff,
        score: 0,
        streak: 0,
        lives: mode === "daily" ? 1 : 3,
        currentQuestion: question,
        questionIndex: 0,
        totalQuestions: mode === "daily" ? 1 : 10,
        timeRemaining: timeLimit,
        isGameActive: true,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentScreen: "game",
        mapAnswer: null,
      }
    })
  }, [])

  const answerQuestion = useCallback((answer: Country, timeLeft: number): boolean => {
    const correctName = correctCountryRef.current
    const isCorrect = answer.name === correctName

    console.log("[v0] Answer check:", {
      answered: answer.name,
      correct: correctName,
      isCorrect,
    })

    setState((prev) => {
      if (!prev.currentQuestion) return prev

      if (isCorrect) {
        const basePoints = prev.difficulty === "easy" ? 5 : prev.difficulty === "medium" ? 10 : 20
        let timeBonus = 0
        if (timeLeft > 7) timeBonus = 20
        else if (timeLeft > 5) timeBonus = 10

        const newStreak = prev.streak + 1
        let multiplier = 1
        if (newStreak >= 20) multiplier = 3
        else if (newStreak >= 10) multiplier = 2
        else if (newStreak >= 5) multiplier = 1.5

        const points = Math.floor((basePoints + timeBonus) * multiplier)

        return {
          ...prev,
          score: prev.score + points,
          streak: newStreak,
          correctAnswers: prev.correctAnswers + 1,
        }
      } else {
        const newLives = prev.lives - 1
        return {
          ...prev,
          streak: 0,
          lives: newLives,
          score: Math.max(0, prev.score - 10),
          wrongAnswers: prev.wrongAnswers + 1,
        }
      }
    })
    return isCorrect
  }, [])

  const nextQuestion = useCallback(
    (question: GameQuestion) => {
      correctCountryRef.current = question.country.name
      console.log("[v0] Next question, correct answer:", question.country.name)

      setState((prev) => {
        if (prev.questionIndex >= prev.totalQuestions - 1 || prev.lives <= 0) {
          // End game
          const newHighScore = prev.score > prev.highScores[prev.gameMode] ? prev.score : prev.highScores[prev.gameMode]
          const newState = {
            ...prev,
            isGameActive: false,
            currentScreen: "gameover" as Screen,
            totalGamesPlayed: prev.totalGamesPlayed + 1,
            highScores: { ...prev.highScores, [prev.gameMode]: newHighScore },
          }
          saveToStorage(newState)
          return newState
        }

        const timeLimit = prev.difficulty === "hard" ? 5 : prev.difficulty === "blitz" ? 3 : 10
        return {
          ...prev,
          currentQuestion: question,
          questionIndex: prev.questionIndex + 1,
          timeRemaining: timeLimit,
          mapAnswer: null,
        }
      })
    },
    [saveToStorage],
  )

  const endGame = useCallback(() => {
    setState((prev) => {
      const newHighScore = prev.score > prev.highScores[prev.gameMode] ? prev.score : prev.highScores[prev.gameMode]
      const newState = {
        ...prev,
        isGameActive: false,
        currentScreen: "gameover" as Screen,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        highScores: { ...prev.highScores, [prev.gameMode]: newHighScore },
      }
      saveToStorage(newState)
      return newState
    })
  }, [saveToStorage])

  const setTimeRemaining = useCallback((time: number) => {
    setState((prev) => ({ ...prev, timeRemaining: time }))
  }, [])

  const decrementTime = useCallback(() => {
    setState((prev) => {
      if (prev.timeRemaining <= 1) {
        const newLives = prev.lives - 1
        if (newLives <= 0) {
          const newHighScore = prev.score > prev.highScores[prev.gameMode] ? prev.score : prev.highScores[prev.gameMode]
          const newState = {
            ...prev,
            lives: 0,
            streak: 0,
            timeRemaining: 0,
            isGameActive: false,
            currentScreen: "gameover" as Screen,
            totalGamesPlayed: prev.totalGamesPlayed + 1,
            highScores: { ...prev.highScores, [prev.gameMode]: newHighScore },
          }
          saveToStorage(newState)
          return newState
        }
        return { ...prev, lives: newLives, streak: 0, timeRemaining: 0 }
      }
      return { ...prev, timeRemaining: prev.timeRemaining - 1 }
    })
  }, [saveToStorage])

  const setMapAnswer = useCallback((coords: { lat: number; lng: number } | null) => {
    setState((prev) => ({ ...prev, mapAnswer: coords }))
  }, [])

  const calculateMapScore = useCallback((actual: [number, number], guess: { lat: number; lng: number }): number => {
    const R = 6371
    const dLat = ((guess.lat - actual[0]) * Math.PI) / 180
    const dLng = ((guess.lng - actual[1]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((actual[0] * Math.PI) / 180) *
        Math.cos((guess.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    const maxDistance = 5000
    return Math.max(0, Math.floor(100 * (1 - distance / maxDistance)))
  }, [])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading GeoBlitz...</p>
        </div>
      </div>
    )
  }

  return (
    <GameContext.Provider
      value={{
        ...state,
        setScreen,
        setGameMode,
        setDifficulty,
        toggleSound,
        startGame,
        answerQuestion,
        nextQuestion,
        endGame,
        setTimeRemaining,
        decrementTime,
        setMapAnswer,
        calculateMapScore,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
