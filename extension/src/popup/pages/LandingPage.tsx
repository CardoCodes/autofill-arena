"use client"

import type React from "react"
import { useState } from "react"
import { Github, Linkedin, ArrowRight, Loader2 } from "lucide-react"
import { GoogleIcon } from "../../components/icons/GoogleIcon"
import { authService } from "../../services/authService"

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
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">MiddleAI</h1>
          <p className="text-gray-600 dark:text-gray-300">Your AI-powered job application assistant</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setAuthMode("signin")}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                authMode === "signin"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                authMode === "signup"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">{error}</div>
          )}
          {message && (
            <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
              {message}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === "signup" && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required={authMode === "signup"}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {authMode !== "reset-password" && (
              <div>
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  {authMode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setAuthMode("reset-password")}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required={authMode !== "reset-password"}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <>
                  {authMode === "signin" ? "Sign In" : authMode === "signup" ? "Create Account" : "Reset Password"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {authMode !== "reset-password" && (
            <>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <Github className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <GoogleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleOAuthSignIn("linkedin")}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
            </>
          )}

          {authMode === "reset-password" && (
            <button
              type="button"
              onClick={() => setAuthMode("signin")}
              className="mt-4 w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
