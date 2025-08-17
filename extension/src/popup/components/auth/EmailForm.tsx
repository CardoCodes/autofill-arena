"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowRight } from 'lucide-react'

interface Props {
  authMode: 'signin' | 'signup' | 'reset-password'
  email: string
  password: string
  fullName: string
  loading: boolean
  onChangeEmail: (v: string) => void
  onChangePassword: (v: string) => void
  onChangeFullName: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onForgotPassword: () => void
}

export function EmailForm({ authMode, email, password, fullName, loading, onChangeEmail, onChangePassword, onChangeFullName, onSubmit, onForgotPassword }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {authMode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[#f8f8f2]">Full Name</Label>
          <Input id="fullName" type="text" value={fullName} onChange={(e) => onChangeFullName(e.target.value)} required={authMode === 'signup'} className="bg-[#44475a] border-0 focus:ring-2 focus:ring-[#bd93f9] text-[#f8f8f2] transition-all duration-300" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#f8f8f2]">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => onChangeEmail(e.target.value)} required className="bg-[#44475a] border-0 focus:ring-2 focus:ring-[#bd93f9] text-[#f8f8f2] transition-all duration-300" />
      </div>

      {authMode !== 'reset-password' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-[#f8f8f2]">Password</Label>
            {authMode === 'signin' && (
              <Button type="button" variant="link" className="p-0 h-auto text-xs text-[#8be9fd] hover:text-[#ff79c6] transition-all duration-300" onClick={onForgotPassword}>
                Forgot password?
              </Button>
            )}
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => onChangePassword(e.target.value)} required className="bg-[#44475a] border-0 focus:ring-2 focus:ring-[#bd93f9] text-[#f8f8f2] transition-all duration-300" />
        </div>
      )}

      <Button type="submit" className="w-full text-[#282a36] transition-all duration-300 hover:shadow-[0_0_15px_rgba(80,250,123,0.4)] border-0 relative overflow-hidden">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          <>
            {authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}


