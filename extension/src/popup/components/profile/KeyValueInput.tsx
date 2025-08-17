"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}

export function KeyValueInput({ label, value, onChange, type = 'text' }: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent" />
    </div>
  )
}


