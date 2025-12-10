"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { GameQuestion } from "@/lib/game-context"
import type { Country } from "@/lib/game-data"
import { countries } from "@/lib/game-data"

interface MapQuestionProps {
  question: GameQuestion
  onMapClick: (country: Country) => void
  feedback: "correct" | "wrong" | null
}

const countryMapData: Record<string, { path: string; center: [number, number] }> = {
  // North America
  US: {
    path: "M50,120 L180,100 L200,130 L190,160 L140,180 L80,170 L40,150 Z M25,170 L60,165 L55,190 L30,195 Z",
    center: [120, 140],
  },
  CA: { path: "M40,50 L200,30 L220,80 L200,110 L150,100 L100,110 L50,100 L30,80 Z", center: [130, 70] },
  MX: { path: "M60,180 L140,175 L160,220 L130,260 L80,250 L50,210 Z", center: [105, 215] },

  // South America
  BR: { path: "M220,280 L300,260 L320,340 L290,420 L230,430 L200,380 L210,320 Z", center: [260, 350] },
  AR: { path: "M200,420 L250,410 L260,500 L240,570 L210,560 L190,490 Z", center: [225, 490] },
  CO: { path: "M180,270 L230,260 L250,300 L220,340 L180,330 Z", center: [210, 300] },
  PE: { path: "M160,320 L210,310 L220,370 L190,410 L150,390 Z", center: [185, 360] },
  CL: { path: "M190,410 L210,420 L205,520 L195,570 L185,560 L190,480 Z", center: [195, 490] },

  // Europe
  GB: { path: "M415,90 L440,85 L445,110 L435,130 L420,120 Z", center: [430, 105] },
  FR: { path: "M420,130 L460,120 L475,155 L455,175 L420,170 L410,150 Z", center: [440, 150] },
  DE: { path: "M450,100 L490,95 L500,130 L485,150 L455,145 L445,120 Z", center: [470, 120] },
  IT: { path: "M465,150 L490,145 L500,190 L480,230 L465,220 L460,180 Z", center: [475, 185] },
  ES: { path: "M395,155 L450,145 L460,180 L435,200 L395,195 L385,175 Z", center: [420, 175] },
  PL: { path: "M490,95 L540,90 L550,120 L535,140 L495,135 L485,115 Z", center: [515, 115] },
  RU: { path: "M520,40 L780,20 L800,90 L750,120 L650,110 L580,100 L530,90 Z", center: [660, 70] },
  UA: { path: "M530,105 L600,95 L620,130 L590,150 L540,145 L520,125 Z", center: [565, 125] },
  SE: { path: "M480,40 L505,35 L515,80 L500,95 L485,85 L480,55 Z", center: [495, 65] },
  NO: { path: "M455,30 L485,25 L495,65 L480,90 L460,80 L455,50 Z", center: [475, 55] },

  // Asia
  CN: { path: "M620,140 L780,120 L800,200 L760,250 L680,260 L620,220 L600,180 Z", center: [700, 190] },
  JP: { path: "M810,160 L840,155 L845,200 L830,230 L810,220 L805,190 Z", center: [825, 190] },
  IN: { path: "M620,220 L700,210 L720,280 L680,340 L620,330 L590,280 Z", center: [655, 275] },
  KR: { path: "M795,175 L815,170 L820,200 L805,215 L790,205 Z", center: [805, 190] },
  TH: { path: "M710,270 L740,265 L750,320 L730,360 L710,340 Z", center: [730, 310] },
  VN: { path: "M740,260 L765,255 L770,320 L755,370 L735,350 L740,300 Z", center: [752, 310] },
  ID: { path: "M720,360 L820,355 L840,390 L800,410 L740,405 L710,385 Z", center: [775, 380] },
  PH: { path: "M790,290 L815,285 L820,330 L800,350 L785,340 Z", center: [800, 315] },
  SA: { path: "M550,220 L620,210 L640,270 L600,310 L550,290 L535,255 Z", center: [585, 260] },
  TR: { path: "M510,155 L590,145 L605,175 L580,195 L520,190 L500,175 Z", center: [550, 170] },
  IR: { path: "M580,185 L650,175 L670,230 L640,260 L590,250 L565,220 Z", center: [615, 215] },

  // Africa
  EG: { path: "M510,215 L560,205 L575,260 L545,290 L510,280 L495,250 Z", center: [535, 250] },
  NG: { path: "M440,300 L500,290 L515,340 L485,370 L445,360 L430,330 Z", center: [470, 330] },
  ZA: { path: "M490,420 L550,410 L565,470 L530,510 L480,500 L465,460 Z", center: [515, 460] },
  KE: { path: "M545,330 L585,320 L600,370 L575,410 L545,400 L530,365 Z", center: [565, 365] },
  ET: { path: "M545,295 L600,285 L620,330 L590,360 L550,350 L530,320 Z", center: [570, 325] },
  MA: { path: "M395,210 L445,200 L460,240 L440,270 L400,265 L385,240 Z", center: [420, 235] },

  // Oceania
  AU: { path: "M740,420 L860,400 L890,470 L850,530 L770,540 L720,500 L730,450 Z", center: [805, 470] },
  NZ: { path: "M890,520 L920,515 L925,560 L905,590 L885,580 L880,545 Z", center: [902, 555] },
}

export function MapQuestion({ question, onMapClick, feedback }: MapQuestionProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [clickedCountry, setClickedCountry] = useState<string | null>(null)

  const handleCountryClick = useCallback(
    (countryCode: string) => {
      if (feedback) return

      setClickedCountry(countryCode)
      const country = countries.find((c) => c.code === countryCode)
      if (country) {
        onMapClick(country)
      }
    },
    [feedback, onMapClick],
  )

  const targetCountry = question.country

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Question */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Find <span className="text-emerald-600 font-bold">{targetCountry.name}</span> on the map
        </h2>
        <p className="text-sm text-slate-500">Click on the country to answer</p>
      </div>

      {/* World Map */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-4 animate-in zoom-in duration-300">
        <svg viewBox="0 0 950 600" className="w-full h-auto" style={{ minHeight: "300px" }}>
          {/* Ocean background */}
          <rect x="0" y="0" width="950" height="600" fill="#e0f2fe" rx="12" />

          {/* Grid lines for reference */}
          {[100, 200, 300, 400, 500, 600, 700, 800].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" stroke="#bae6fd" strokeWidth="0.5" />
          ))}
          {[100, 200, 300, 400, 500].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="950" y2={y} stroke="#bae6fd" strokeWidth="0.5" />
          ))}

          {/* Countries */}
          {Object.entries(countryMapData).map(([code, data]) => {
            const isTarget = code === targetCountry.code
            const isHovered = hoveredCountry === code
            const isClicked = clickedCountry === code
            const isCorrectAnswer = feedback === "correct" && isClicked
            const isWrongAnswer = feedback === "wrong" && isClicked
            const showCorrectHighlight = feedback && isTarget

            return (
              <g key={code}>
                <path
                  d={data.path}
                  fill={
                    isCorrectAnswer
                      ? "#22c55e"
                      : isWrongAnswer
                        ? "#ef4444"
                        : showCorrectHighlight
                          ? "#22c55e"
                          : isHovered
                            ? "#fbbf24"
                            : "#d1d5db"
                  }
                  stroke={
                    isCorrectAnswer || showCorrectHighlight
                      ? "#15803d"
                      : isWrongAnswer
                        ? "#b91c1c"
                        : isHovered
                          ? "#d97706"
                          : "#6b7280"
                  }
                  strokeWidth={isHovered || isClicked ? 2 : 1}
                  className={cn("transition-all duration-200", !feedback && "cursor-pointer hover:brightness-110")}
                  onMouseEnter={() => !feedback && setHoveredCountry(code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => handleCountryClick(code)}
                />
                {/* Country label on hover */}
                {isHovered && !feedback && (
                  <text
                    x={data.center[0]}
                    y={data.center[1] - 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-slate-700 pointer-events-none"
                  >
                    {countries.find((c) => c.code === code)?.name || code}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Hint - show region */}
      <div className="mt-4 text-center">
        <span className="text-sm text-slate-400">
          Hint: This country is in <span className="font-medium text-slate-600">{targetCountry.region}</span>
        </span>
      </div>
    </div>
  )
}
