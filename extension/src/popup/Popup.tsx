"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SettingsIcon, User, FileText, Sun, Moon } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"
import ProfilePage from "./pages/ProfilePage"
import AutofillPage from "./pages/AutofillPage"
import SettingsPage from "./pages/SettingsPage"

type Page = "autofill" | "profile"

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("autofill")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  const renderPage = () => {
    switch (currentPage) {
      case "autofill":
        return <AutofillPage />
      case "profile":
        return <ProfilePage />
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

  return (
    <div className="flex flex-col h-[600px] w-[400px] relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-blue-600 dark:bg-blue-800 text-white transition-colors duration-300 z-10">
        <h1 className="text-2xl font-bold">MiddleAI</h1>
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors duration-300"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun size={24} className="transition-transform duration-300 rotate-0" />
            ) : (
              <Moon size={24} className="transition-transform duration-300 rotate-180" />
            )}
          </button>
          <animated.button
            style={iconAnimation}
            className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors duration-300"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <SettingsIcon size={24} />
          </animated.button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 overflow-y-auto bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="flex justify-around items-center p-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300 z-10">
        <button
          className={`flex flex-col items-center ${currentPage === "autofill" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage("autofill")}
          aria-label="Autofill"
        >
          <FileText size={24} />
          <span className="text-xs mt-1">Autofill</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === "profile" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage("profile")}
          aria-label="Profile"
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </footer>

      {/* Settings Panel */}
      <animated.div
        style={settingsAnimation}
        className="absolute top-[64px] bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-20"
      >
        <SettingsPage onClose={toggleSettings} />
      </animated.div>
    </div>
  )
}

export default Popup
