/// <reference types="chrome"/>

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
import { Card } from "@/components/ui/card"

type Page = "autofill" | "profile"

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("autofill")
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize and load dark mode preference
  useEffect(() => {
    const initializeDarkMode = async () => {
      // Check if we're in a browser extension environment
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          const result = await chrome.storage.local.get(['darkMode'])
          setIsDarkMode(result.darkMode ?? true) // Default to true if not set
        } catch (error) {
          console.error('Error loading dark mode preference:', error)
          setIsDarkMode(true) // Default to dark mode on error
        }
      } else {
        // We're not in an extension environment (e.g., during build)
        setIsDarkMode(true) // Default to dark mode
      }
    }

    initializeDarkMode()
  }, [])

  // Save dark mode preference and apply theme
  useEffect(() => {
    const updateDarkMode = async () => {
      // Check if we're in a browser extension environment
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          await chrome.storage.local.set({ darkMode: isDarkMode })
        } catch (error) {
          console.error('Error saving dark mode preference:', error)
        }
      }
      
      // Apply theme (this works in any environment)
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
        document.documentElement.style.backgroundColor = "#282a36"
        document.documentElement.style.color = "#f8f8f2"
      } else {
        document.documentElement.classList.remove("dark")
        document.documentElement.style.backgroundColor = "#ffffff"
        document.documentElement.style.color = "#1a1a1a"
      }
    }

    updateDarkMode()
  }, [isDarkMode])

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
        // Redirect to landing page on sign out
        setCurrentPage("autofill")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

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
    try {
      await authService.signOut()
      setUser(null)
      setProfile(null)
      setCurrentPage("autofill")
      // Close settings if open
      setIsSettingsOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
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
      <div className="flex items-center justify-center h-[600px] w-[400px] bg-[#282a36]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff79c6]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`h-[600px] w-[400px] ${isDarkMode ? "bg-[#282a36]" : "bg-white"}`}>
        <LandingPage onAuthStateChange={handleAuthStateChange} />
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-[600px] w-[400px] relative overflow-hidden ${isDarkMode ? "bg-[#282a36]" : "bg-white"}`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-4 ${isDarkMode ? "bg-[#282a36] text-[#f8f8f2]" : "bg-white text-[#1a1a1a]"} z-10`}>
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] transition-all duration-300"
          >
            AutoFill Arena
          </h1>
          {profile && (
            <div className="ml-2 flex items-center">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || ""}
                  className="w-6 h-6 rounded-full ml-2 border border-[#44475a]"
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
            className={`${isDarkMode ? "text-[#f8f8f2] hover:bg-[#44475a]" : "text-[#1a1a1a] hover:bg-gray-100"} transition-all duration-300`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Log out"
            className={`${isDarkMode ? "text-[#f8f8f2] hover:bg-[#44475a]" : "text-[#1a1a1a] hover:bg-gray-100"} transition-all duration-300`}
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <animated.button
            style={iconAnimation}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-[#44475a] text-[#f8f8f2]" : "hover:bg-gray-100 text-[#1a1a1a]"} transition-all duration-300`}
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </animated.button>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-grow p-4 overflow-y-auto ${isDarkMode ? "bg-[#282a36] text-[#f8f8f2]" : "bg-white text-[#1a1a1a]"}`}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className={`flex w-full ${isDarkMode ? "bg-[#282a36]" : "bg-white"} z-10`}>
        <Button
          variant="ghost"
          className={`flex flex-1 flex-col items-center h-auto py-4 rounded-none transition-all duration-300 ${
            currentPage === "autofill"
              ? isDarkMode
                ? "bg-gradient-to-r from-[#bd93f9]/20 to-[#bd93f9]/10 text-[#bd93f9] shadow-[0_0_10px_rgba(189,147,249,0.2)]"
                : "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-600 shadow-sm"
              : isDarkMode
                ? "text-[#6272a4] hover:text-[#f8f8f2] hover:bg-[#44475a]/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => setCurrentPage("autofill")}
          aria-label="Autofill"
        >
          <FileText className={`h-5 w-5 mb-1 transition-all duration-300 ${
            currentPage === "autofill" ? "transform scale-110" : ""
          }`} />
          <span className="text-xs font-medium">Autofill</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-1 flex-col items-center h-auto py-4 rounded-none transition-all duration-300 ${
            currentPage === "profile"
              ? isDarkMode
                ? "bg-gradient-to-r from-[#bd93f9]/20 to-[#bd93f9]/10 text-[#bd93f9] shadow-[0_0_10px_rgba(189,147,249,0.2)]"
                : "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-600 shadow-sm"
              : isDarkMode
                ? "text-[#6272a4] hover:text-[#f8f8f2] hover:bg-[#44475a]/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => setCurrentPage("profile")}
          aria-label="Profile"
        >
          <User className={`h-5 w-5 mb-1 transition-all duration-300 ${
            currentPage === "profile" ? "transform scale-110" : ""
          }`} />
          <span className="text-xs font-medium">Profile</span>
        </Button>
      </footer>

      {/* Settings Panel */}
      <animated.div
        style={settingsAnimation}
        className={`absolute top-[64px] bottom-0 left-0 right-0 ${isDarkMode ? "bg-[#282a36]" : "bg-white"} shadow-lg z-20`}
      >
        <SettingsPage onClose={toggleSettings} isDarkMode={isDarkMode} />
      </animated.div>
    </div>
  )
}

export default Popup
