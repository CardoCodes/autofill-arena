/// <reference types="chrome"/>

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSpring, animated } from "@react-spring/web"
import ProfilePage from "./pages/ProfilePage"
import AutofillPage from "./pages/AutofillPage"
import LandingGate from "./LandingGate"
import SettingsPage from "./pages/SettingsPage"
import LandingPage from "./pages/LandingPage"
import { getProfile, saveProfile, getAnswers, saveAnswers, signOutLocal } from "../services/localProfile"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PopupHeader } from "./components/layout/PopupHeader"
import { BottomNav } from "./components/layout/BottomNav"

type Page = "autofill" | "profile"

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("autofill")
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize and load dark mode preference
  useEffect(() => {
    const initializeDarkMode = async () => {
      // Check if we're in a browser extension environment
      if (typeof browser !== 'undefined' && browser.storage) {
        try {
          const result = await browser.storage.local.get(['darkMode'])
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
      if (typeof browser !== 'undefined' && browser.storage) {
        try {
          await browser.storage.local.set({ darkMode: isDarkMode })
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
    const loadLocal = async () => {
      setIsLoading(true)
      try {
        const p = await getProfile()
        setProfile(p)
        setUser(p?.email ? { email: p.email } : null)
      } catch (e) {
        console.warn('Failed to load local profile', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadLocal()
  }, [])

  const settingsAnimation = useSpring({
    transform: isSettingsOpen ? "translateY(0%)" : "translateY(100%)",
    opacity: isSettingsOpen ? 1 : 0,
  })

  const iconAnimation = useSpring({
    transform: isSettingsOpen ? "rotate(180deg)" : "rotate(0deg)",
  })

  const handleAuthStateChange = async () => {
    const p = await getProfile()
    setProfile(p)
    setUser(p?.email ? { email: p.email } : null)
  }

  const handleLogout = async () => {
    try {
      await signOutLocal()
      setUser(null)
      setProfile(null)
      setCurrentPage("autofill")
      setIsSettingsOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "autofill":
        return <AutofillPage isDarkMode={isDarkMode} />
      case "profile":
        return (
              <ProfilePage
                user={user}
                profile={profile}
                isDarkMode={isDarkMode}
                onProfileUpdate={async (updatedProfile) => {
                  await saveProfile(updatedProfile)
                  const p = await getProfile()
                  setProfile(p)
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
      <PopupHeader
        isDarkMode={isDarkMode}
        profile={profile}
        iconAnimation={iconAnimation}
        onToggleDark={toggleDarkMode}
        onLogout={handleLogout}
        onToggleSettings={toggleSettings}
      />

      {/* Main content */}
      <main className={`flex-grow p-4 overflow-y-auto ${isDarkMode ? "bg-[#282a36] text-[#f8f8f2]" : "bg-white text-[#1a1a1a]"}`}>
        {renderPage()}
      </main>

      {/* Footer */}
      <BottomNav isDarkMode={isDarkMode} currentPage={currentPage} onNavigate={setCurrentPage} />

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
