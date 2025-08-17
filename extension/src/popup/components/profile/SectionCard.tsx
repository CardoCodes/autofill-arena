"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SectionCardProps {
  title: string
  isDarkMode: boolean
  headerRight?: React.ReactNode
  children: React.ReactNode
}

export function SectionCard({ title, isDarkMode, headerRight, children }: SectionCardProps) {
  return (
    <Card className={`${isDarkMode ? "bg-[#282a36] border-0" : "bg-white border-0"} shadow-none`}>
      <CardHeader className={headerRight ? "flex flex-row justify-between items-center" : undefined}>
        <CardTitle>{title}</CardTitle>
        {headerRight}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}


