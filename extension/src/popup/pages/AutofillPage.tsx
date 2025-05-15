"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Zap } from "lucide-react"

type AutofillStatus = "ready" | "not-available" | "in-progress" | "neutral"

const AutofillPage: React.FC = () => {
  const [status, setStatus] = useState<AutofillStatus>("neutral")
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string>("Checking page compatibility...")

  // Simulate checking the current page for autofill compatibility
  useEffect(() => {
    const checkCurrentPage = async () => {
      // In a real extension, you would get the current tab URL and check if it's a job application page
      // For demo purposes, we'll simulate different states
      setStatus("neutral")
      setStatusMessage("Checking page compatibility...")

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Randomly select a status for demonstration
      const statuses: AutofillStatus[] = ["ready", "not-available", "in-progress", "neutral"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      setStatus(randomStatus)

      switch (randomStatus) {
        case "ready":
          setStatusMessage("This page can be autofilled! Click the button to fill the form.")
          break
        case "not-available":
          setStatusMessage("This page doesn't appear to be a job application form.")
          break
        case "in-progress":
          setStatusMessage("Partial match found. Some fields may be filled.")
          break
        default:
          setStatusMessage("Navigate to a job application page to use autofill.")
      }

      // Simulate getting the current URL
      setCurrentUrl("https://example.com/jobs/application")
    }

    checkCurrentPage()

    // In a real extension, you would listen for tab changes
    const intervalId = setInterval(checkCurrentPage, 10000)
    return () => clearInterval(intervalId)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case "ready":
        return "bg-green-500"
      case "not-available":
        return "bg-red-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-white dark:bg-gray-600"
    }
  }

  const getButtonText = () => {
    switch (status) {
      case "ready":
        return "Autofill Form"
      case "not-available":
        return "Cannot Autofill"
      case "in-progress":
        return "Partial Autofill"
      default:
        return "Waiting for Form"
    }
  }

  const handleAutofill = () => {
    if (status === "ready" || status === "in-progress") {
      // In a real extension, this would trigger the autofill process
      setStatusMessage("Filling form...")
      setTimeout(() => {
        setStatusMessage("Form filled successfully!")
      }, 1500)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">Autofill Assistant</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{currentUrl}</p>
        <p className="text-sm">{statusMessage}</p>
      </div>

      <div className={`relative group ${status === "not-available" ? "cursor-not-allowed" : "cursor-pointer"}`}>
        {/* Aura/glow effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300 ${getStatusColor()}`}
        ></div>

        {/* Inner glow */}
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-all duration-300 ${getStatusColor()}`}
        ></div>

        {/* Button */}
        <button
          onClick={handleAutofill}
          disabled={status === "not-available" || status === "neutral"}
          className={`relative z-10 flex items-center justify-center w-40 h-40 rounded-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${
            status !== "not-available" && status !== "neutral" ? "hover:scale-105 active:scale-95" : "opacity-80"
          }`}
        >
          <div className="flex flex-col items-center">
            <Zap
              size={48}
              className={`mb-2 ${
                status === "ready"
                  ? "text-green-500"
                  : status === "not-available"
                    ? "text-red-500"
                    : status === "in-progress"
                      ? "text-yellow-500"
                      : "text-gray-400"
              }`}
            />
            <span className="font-semibold">{getButtonText()}</span>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your profile information will be used to fill out job applications automatically.
        </p>
      </div>
    </div>
  )
}

export default AutofillPage
