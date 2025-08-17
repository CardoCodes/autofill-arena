"use client"

import { Zap } from "lucide-react"
import { AUTOFILL_STATUS_COLORS, THEME_COLORS, type AutofillStatus } from "../constants/ui"

interface Props {
  status: AutofillStatus
  onClick: () => void
  disabled?: boolean
}

export function AutofillStatusButton({ status, onClick, disabled }: Props) {
  const colors = AUTOFILL_STATUS_COLORS[status]
  const isDisabled = disabled || status === "not-available" || status === "neutral"

  return (
    <div className={`relative group ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300"
        style={{ backgroundColor: colors.aura }}
      />
      <div
        className="absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-all duration-300"
        style={{ backgroundColor: colors.inner }}
      />
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`relative z-10 flex items-center justify-center w-40 h-40 rounded-full shadow-lg transform transition-all duration-300 ${
          !isDisabled ? "hover:scale-105 active:scale-95" : "opacity-80"
        }`}
        style={{ backgroundColor: THEME_COLORS.backgroundDark, border: `1px solid ${colors.buttonBorder}` }}
      >
        <div className="flex flex-col items-center">
          <Zap size={48} style={{ color: colors.icon }} className="mb-2 transition-all duration-300" />
        </div>
      </button>
    </div>
  )
}


