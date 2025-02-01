import React from "react"
import { useState, useEffect } from "react"
import { SettingsIcon, Home, CarIcon as AutofillIcon, Sparkles, User, Sun, Moon } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"
import HomePage from "./pages/HomePage.tsx"
import AutofillPage from "./pages/AutofillPage.tsx"
import AIPage from "./pages/AIPage.tsx"
import ProfilePage from "./pages/ProfilePage.tsx"
import JobDetailsPage from "./pages/JobDetailsPage.tsx"
import SettingsPage from "./pages/SettingsPage.tsx"



type Page = "home" | "autofill" | "ai" | "profile" | "job-details"

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
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
      case "home":
        return (
          <HomePage
            onSelectJob={(jobId) => {
              setSelectedJobId(jobId)
              setCurrentPage("job-details")
            }}
          />
        )
      case "autofill":
        return <AutofillPage />
      case "ai":
        return <AIPage />
      case "profile":
        return <ProfilePage />
      case "job-details":
        return selectedJobId ? <JobDetailsPage jobId={selectedJobId} onBack={() => setCurrentPage("home")} /> : null
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
          className={`flex flex-col items-center ${currentPage === "home" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage("home")}
          aria-label="Home"
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === "autofill" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage("autofill")}
          aria-label="Autofill"
        >
          <AutofillIcon size={24} />
          <span className="text-xs mt-1">Autofill</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === "ai" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage("ai")}
          aria-label="AI"
        >
          <Sparkles size={24} />
          <span className="text-xs mt-1">AI</span>
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

