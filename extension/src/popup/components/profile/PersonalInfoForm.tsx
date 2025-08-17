"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  fullName: string
  email: string
  phone: string
  location: string
  onChange: (field: 'fullName' | 'phone' | 'location', value: string) => void
}

export function PersonalInfoForm({ fullName, email, phone, location, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => onChange('fullName', e.target.value)} className="bg-transparent" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled className="bg-transparent" />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={phone} onChange={(e) => onChange('phone', e.target.value)} className="bg-transparent" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => onChange('location', e.target.value)} className="bg-transparent" />
      </div>
    </div>
  )
}


