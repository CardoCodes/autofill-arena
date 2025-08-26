"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { getProfile, saveProfile } from "../../services/localProfile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { BrandHeader } from "../components/auth/BrandHeader"
import { EmailForm } from "../components/auth/EmailForm"
import { OAuthButtons } from "../components/auth/OAuthButtons"

interface LandingPageProps {
  onAuthStateChange: () => void
}

type AuthMode = "signin" | "signup" | "reset-password"

const LandingPage: React.FC<LandingPageProps> = ({ onAuthStateChange }) => {
  const [authMode, setAuthMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const gradientStyle = {
    backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, var(--gradient-from) 0%, var(--gradient-to) 100%)`,
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      // Local-only: just persist email to local backend profile for now
      const profile = await getProfile()
      await saveProfile({ ...profile, email, full_name: fullName || profile.full_name })
      onAuthStateChange()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (_provider: any) => {
    setMessage("OAuth is disabled in local mode.")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <BrandHeader mouseGradientStyle={gradientStyle as React.CSSProperties} />

        <Card className="bg-[#282a36] border-0 shadow-none">
          <CardHeader className="pb-2">
            <Tabs defaultValue={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)}>
              <TabsList 
                className="grid w-full grid-cols-2 bg-[#44475a] p-1 rounded-lg border-0 relative overflow-hidden"
                style={{
                  '--gradient-from': '#bd93f9',
                  '--gradient-to': '#6272a4',
                  ...gradientStyle
                } as React.CSSProperties}
              >
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-[#bd93f9] data-[state=active]:text-[#282a36] transition-all duration-300 hover:shadow-[0_0_10px_rgba(80,250,123,0.3)] rounded-md border-0 relative z-10"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-[#bd93f9] data-[state=active]:text-[#282a36] transition-all duration-300 hover:shadow-[0_0_10px_rgba(80,250,123,0.3)] rounded-md border-0 relative z-10"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-2 bg-[#ff5555]/20 text-[#ff5555] rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-2 bg-[#50fa7b]/20 text-[#50fa7b] rounded">
                {message}
              </div>
            )}

            <EmailForm
              authMode={authMode}
              email={email}
              password={password}
              fullName={fullName}
              loading={loading}
              onChangeEmail={setEmail}
              onChangePassword={setPassword}
              onChangeFullName={setFullName}
              onSubmit={handleEmailAuth}
              onForgotPassword={() => setAuthMode("reset-password")}
            />


            {authMode !== "reset-password" && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-[#44475a]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#282a36] px-2 text-[#6272a4]">Or continue with</span>
                  </div>
                </div>

                <OAuthButtons disabled={loading} onClick={(p) => handleOAuthSignIn(p)} />
              </>
            )}

            {authMode === "reset-password" && (
              <Button 
                type="button" 
                variant="link" 
                className="mt-4 w-full text-[#8be9fd] hover:text-[#ff79c6] transition-all duration-300 border-0" 
                onClick={() => setAuthMode("signin")}
              >
                Back to sign in
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LandingPage
