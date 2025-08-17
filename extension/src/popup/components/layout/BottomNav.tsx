"use client"

import { Button } from "@/components/ui/button"
import { User, FileText } from "lucide-react"

type Page = "autofill" | "profile"

interface Props {
  isDarkMode: boolean
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function BottomNav({ isDarkMode, currentPage, onNavigate }: Props) {
  return (
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
        onClick={() => onNavigate("autofill")}
        aria-label="Autofill"
      >
        <FileText className={`h-5 w-5 mb-1 transition-all duration-300 ${currentPage === "autofill" ? "transform scale-110" : ""}`} />
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
        onClick={() => onNavigate("profile")}
        aria-label="Profile"
      >
        <User className={`h-5 w-5 mb-1 transition-all duration-300 ${currentPage === "profile" ? "transform scale-110" : ""}`} />
        <span className="text-xs font-medium">Profile</span>
      </Button>
    </footer>
  )
}


