"use client"

import { Button } from "@/components/ui/button"
import { SettingsIcon, Sun, Moon, LogOut } from "lucide-react"
import { animated, SpringValue } from "@react-spring/web"

interface Props {
  isDarkMode: boolean
  profile?: { avatar_url?: string; full_name?: string } | null
  iconAnimation: { transform: SpringValue<string> }
  onToggleDark: () => void
  onLogout: () => void
  onToggleSettings: () => void
}

export function PopupHeader({ isDarkMode, profile, iconAnimation, onToggleDark, onLogout, onToggleSettings }: Props) {
  return (
    <header className={`flex justify-between items-center p-4 ${isDarkMode ? "bg-[#282a36] text-[#f8f8f2]" : "bg-white text-[#1a1a1a]"} z-10`}>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] transition-all duration-300">AutoFill Arena</h1>
        {profile && (
          <div className="ml-2 flex items-center">
            {profile.avatar_url && (
              <img src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || ""} className="w-6 h-6 rounded-full ml-2 border border-[#44475a]" />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onToggleDark} aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} className={`${isDarkMode ? "text-[#f8f8f2] hover:bg-[#44475a]" : "text-[#1a1a1a] hover:bg-gray-100"} transition-all duration-300`}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Log out" className={`${isDarkMode ? "text-[#f8f8f2] hover:bg-[#44475a]" : "text-[#1a1a1a] hover:bg-gray-100"} transition-all duration-300`}>
          <LogOut className="h-5 w-5" />
        </Button>
        <animated.button style={iconAnimation} className={`p-2 rounded-full ${isDarkMode ? "hover:bg-[#44475a] text-[#f8f8f2]" : "hover:bg-gray-100 text-[#1a1a1a]"} transition-all duration-300`} onClick={onToggleSettings} aria-label="Settings">
          <SettingsIcon className="h-5 w-5" />
        </animated.button>
      </div>
    </header>
  )
}


