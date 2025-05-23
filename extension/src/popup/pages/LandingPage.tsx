"use client"

import type React from "react"
import { useState } from "react"
import { Github, Linkedin, ArrowRight, Loader2 } from "lucide-react"
import { GoogleIcon } from "../../components/icons/GoogleIcon"
import { authService } from "../../services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (authMode === "signin") {
        const { user, error } = await authService.signInWithEmail(email, password)
        if (error) throw new Error(error.message)
        if (user) {
          onAuthStateChange()
        }
      } else if (authMode === "signup") {
        const { user, error } = await authService.signUp(email, password, fullName)
        if (error) throw new Error(error.message)
        if (user) {
          setMessage("Check your email to confirm your account")
          setAuthMode("signin")
        }
      } else if (authMode === "reset-password") {
        const { error } = await authService.resetPassword(email)
        if (error) throw new Error(error.message)
        setMessage("Check your email for password reset instructions")
        setAuthMode("signin")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "github" | "google" | "linkedin") => {
    setError(null)
    setLoading(true)

    try {
      await authService.signInWithOAuth(provider)
      // OAuth redirects to the provider's site, so we don't need to call onAuthStateChange here
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">MiddleAI</h1>
          <p className="text-muted-foreground">Your AI-powered job application assistant</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <Tabs defaultValue={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-2 bg-destructive/10 text-destructive rounded">{error}</div>}
            {message && (
              <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
                {message}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={authMode === "signup"}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {authMode !== "reset-password" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    {authMode === "signin" && (
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs"
                        onClick={() => setAuthMode("reset-password")}
                      >
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={authMode !== "reset-password"}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    {authMode === "signin" ? "Sign In" : authMode === "signup" ? "Create Account" : "Reset Password"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {authMode !== "reset-password" && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("github")}
                    disabled={loading}
                    className="w-full"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={loading}
                    className="w-full"
                  >
                    <GoogleIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("linkedin")}
                    disabled={loading}
                    className="w-full"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}

            {authMode === "reset-password" && (
              <Button type="button" variant="link" className="mt-4 w-full" onClick={() => setAuthMode("signin")}>
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
