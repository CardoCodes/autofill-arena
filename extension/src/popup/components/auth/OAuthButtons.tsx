"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Github, Linkedin } from 'lucide-react'
import { GoogleIcon } from '../../../components/icons/GoogleIcon'
import { OAUTH_BUTTON_STYLES } from '../../constants/auth'

interface Props {
  disabled?: boolean
  onClick: (provider: 'github' | 'google' | 'linkedin') => void
}

export function OAuthButtons({ disabled, onClick }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button variant="outline" onClick={() => onClick('github')} disabled={disabled} className={`group relative w-full ${OAUTH_BUTTON_STYLES.github.bg}`}>
        <span className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, ${OAUTH_BUTTON_STYLES.github.hoverOverlay})` }} />
        <span className="flex items-center justify-center gap-2 text-[#f8f8f2]">
          <Github className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-medium">GitHub</span>
        </span>
      </Button>
      <Button variant="outline" onClick={() => onClick('google')} disabled={disabled} className={`group relative w-full ${OAUTH_BUTTON_STYLES.google.bg}`}>
        <span className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, ${OAUTH_BUTTON_STYLES.google.hoverOverlay})` }} />
        <span className="flex items-center justify-center gap-2 text-[#f8f8f2]">
          <GoogleIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-medium">Google</span>
        </span>
      </Button>
      <Button variant="outline" onClick={() => onClick('linkedin')} disabled={disabled} className={`group relative w-full ${OAUTH_BUTTON_STYLES.linkedin.bg}`}>
        <span className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, ${OAUTH_BUTTON_STYLES.linkedin.hoverOverlay})` }} />
        <span className="flex items-center justify-center gap-2 text-[#f8f8f2]">
          <Linkedin className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
          <span className="text-sm font-medium">LinkedIn</span>
        </span>
      </Button>
    </div>
  )
}


