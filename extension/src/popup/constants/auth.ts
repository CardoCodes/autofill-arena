export const GRADIENT_FROM_PRIMARY = '#ff79c6'
export const GRADIENT_TO_PRIMARY = '#bd93f9'

export const GRADIENT_FROM_SUBTITLE = '#6272a4'
export const GRADIENT_TO_SUBTITLE = '#8be9fd'

export type OAuthProvider = 'github' | 'google' | 'linkedin'

export const OAUTH_BUTTON_STYLES: Record<OAuthProvider, { bg: string; hoverOverlay: string }> = {
  github: {
    bg: 'bg-[#44475a] border-0 text-[#f8f8f2] transition-all duration-300 hover:shadow-[0_0_10px_rgba(80,250,123,0.3)] hover:bg-[#44475a]/80 hover:scale-105 active:scale-95 overflow-hidden',
    hoverOverlay: 'from-black via-white to-[#50fa7b]',
  },
  google: {
    bg: 'bg-[#44475a] border-0 text-[#f8f8f2] transition-all duration-300 hover:shadow-[0_0_10px_rgba(80,250,123,0.3)] hover:bg-[#44475a]/80 hover:scale-105 active:scale-95 overflow-hidden',
    hoverOverlay: 'from-[#4285f4] via-[#34a853] to-[#fbbc05]',
  },
  linkedin: {
    bg: 'bg-[#44475a] border-0 text-[#f8f8f2] transition-all duration-300 hover:shadow-[0_0_10px_rgba(80,250,123,0.3)] hover:bg-[#44475a]/80 hover:scale-105 active:scale-95 overflow-hidden',
    hoverOverlay: 'from-[#0a66c2] via-[#ffffff] to-[#0a66c2]',
  },
}


