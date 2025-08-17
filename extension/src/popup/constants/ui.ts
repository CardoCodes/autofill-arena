export type AutofillStatus = "ready" | "not-available" | "in-progress" | "neutral"

export const THEME_COLORS = {
  backgroundDark: "#282a36",
  backgroundCardDark: "#282a36",
  borderDark: "#44475a",
  textPrimaryDark: "#f8f8f2",
  textSecondaryDark: "#6272a4",
  accentPink: "#ff79c6",
  accentPurple: "#bd93f9",
  success: "#50fa7b",
  danger: "#ff5555",
  warn: "#f1fa8c",
}

export const AUTOFILL_STATUS_ORDER: AutofillStatus[] = [
  "ready",
  "not-available",
  "in-progress",
  "neutral",
]

export const AUTOFILL_STATUS_MESSAGES: Record<AutofillStatus, string> = {
  ready: "This page can be autofilled! Click the button to fill the form.",
  "not-available": "This page doesn't appear to be a job application form.",
  "in-progress": "Partial match found. Some fields may be filled.",
  neutral: "Navigate to a job application page to use autofill.",
}

export const AUTOFILL_STATUS_COLORS: Record<AutofillStatus, { aura: string; inner: string; icon: string; buttonBorder: string }> = {
  ready: {
    aura: THEME_COLORS.success,
    inner: THEME_COLORS.success,
    icon: THEME_COLORS.success,
    buttonBorder: THEME_COLORS.borderDark,
  },
  "not-available": {
    aura: THEME_COLORS.danger,
    inner: THEME_COLORS.danger,
    icon: THEME_COLORS.danger,
    buttonBorder: THEME_COLORS.borderDark,
  },
  "in-progress": {
    aura: THEME_COLORS.warn,
    inner: THEME_COLORS.warn,
    icon: THEME_COLORS.warn,
    buttonBorder: THEME_COLORS.borderDark,
  },
  neutral: {
    aura: THEME_COLORS.borderDark,
    inner: THEME_COLORS.borderDark,
    icon: THEME_COLORS.textSecondaryDark,
    buttonBorder: THEME_COLORS.borderDark,
  },
}


