"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SettingsIcon, User, FileText, Sun, Moon, LogOut } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"
import ProfilePage from "./pages/ProfilePage"
import AutofillPage from "./pages/AutofillPage"
import SettingsPage from "./pages/SettingsPage"
import LandingPage from "./pages/LandingPage"
import { authService } from "../services/authService"
import { profileService, type ProfileWithDetails } from "../services/profileService"
import { supabase } from "../lib/supabase"
import { Button } from "@/components/ui/button"

type Page = "autofill" | "profile"

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("autofill")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for authentication state changes
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true)
      const { user } = await authService.getCurrentUser()
      setUser(user)

      if (user) {
        // Fetch user profile data
        const { profile } = await profileService.getCompleteProfile(user.id)
        setProfile(profile)
      }

      setIsLoading(false)
    }

    checkUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user || null)
        if (session?.user) {
          const { profile } = await profileService.getCompleteProfile(session.user.id)
          setProfile(profile)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const settingsAnimation = useSpring({
    transform: isSettingsOpen ? "translateY(0%)" : "translateY(100%)",
    opacity: isSettingsOpen ? 1 : 0,
  })

  const iconAnimation = useSpring({
    transform: isSettingsOpen ? "rotate(180deg)" : "rotate(0deg)",
  })

  const handleAuthStateChange = async () => {
    const { user } = await authService.getCurrentUser()
    setUser(user)

    if (user) {
      const { profile } = await profileService.getCompleteProfile(user.id)
      setProfile(profile)
    }
  }

  const handleLogout = async () => {
    await authService.signOut()
    setUser(null)
    setProfile(null)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "autofill":
        return <AutofillPage />
      case "profile":
        return (
          <ProfilePage
            user={user}
            profile={profile}
            onProfileUpdate={async (updatedProfile) => {
              if (user) {
                // Update profile in database
                const { profile: newProfile } = await profileService.updateProfile(user.id, updatedProfile)
                if (newProfile) {
                  // Refresh complete profile
                  const { profile: completeProfile } = await profileService.getCompleteProfile(user.id)
                  setProfile(completeProfile)
                }
              }
            }}
          />
        )
      default:
        return <AutofillPage />
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-[400px] bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-[600px] w-[400px] bg-background">
        <LandingPage onAuthStateChange={handleAuthStateChange} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] w-[400px] relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">MiddleAI</h1>
          {profile && (
            <div className="ml-2 flex items-center">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || ""}
                  className="w-6 h-6 rounded-full ml-2"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="text-primary-foreground hover:bg-primary/90"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Log out"
            className="text-primary-foreground hover:bg-primary/90"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <animated.button
            style={iconAnimation}
            className="p-2 rounded-full hover:bg-primary/90 transition-colors duration-300 text-primary-foreground"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </animated.button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 overflow-y-auto bg-background text-foreground">{renderPage()}</main>

      {/* Footer */}
      <footer className="flex justify-around items-center p-4 bg-muted border-t border-border z-10">
        <Button
          variant={currentPage === "autofill" ? "default" : "ghost"}
          className="flex flex-col items-center h-auto py-2"
          onClick={() => setCurrentPage("autofill")}
          aria-label="Autofill"
        >
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-xs">Autofill</span>
        </Button>
        <Button
          variant={currentPage === "profile" ? "default" : "ghost"}
          className="flex flex-col items-center h-auto py-2"
          onClick={() => setCurrentPage("profile")}
          aria-label="Profile"
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </footer>

      {/* Settings Panel */}
      <animated.div
        style={settingsAnimation}
        className="absolute top-[64px] bottom-0 left-0 right-0 bg-background shadow-lg z-20"
      >
        <SettingsPage onClose={toggleSettings} />
      </animated.div>
    </div>
  )
}

export default Popup
