"use client"

import React from 'react'
import { GRADIENT_FROM_PRIMARY, GRADIENT_TO_PRIMARY, GRADIENT_FROM_SUBTITLE, GRADIENT_TO_SUBTITLE } from '../../constants/auth'

interface Props {
  mouseGradientStyle: React.CSSProperties
}

export function BrandHeader({ mouseGradientStyle }: Props) {
  return (
    <div className="text-center space-y-2">
      <h1
        className="text-4xl font-bold bg-clip-text text-transparent transition-all duration-300 relative"
        style={{ '--gradient-from': GRADIENT_FROM_PRIMARY, '--gradient-to': GRADIENT_TO_PRIMARY, ...mouseGradientStyle } as React.CSSProperties}
      >
        AutoFill Arena
      </h1>
      <p
        className="transition-all duration-300 bg-clip-text text-transparent"
        style={{ '--gradient-from': GRADIENT_FROM_SUBTITLE, '--gradient-to': GRADIENT_TO_SUBTITLE, ...mouseGradientStyle } as React.CSSProperties}
      >
        Its You vs The Form
      </p>
    </div>
  )
}


