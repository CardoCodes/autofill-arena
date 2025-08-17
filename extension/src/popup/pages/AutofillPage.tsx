"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AUTOFILL_STATUS_MESSAGES, AUTOFILL_STATUS_ORDER, THEME_COLORS, type AutofillStatus } from "../constants/ui"
import { AutofillStatusButton } from "../components/AutofillStatusButton"

type T = AutofillStatus

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
      const randomStatus = AUTOFILL_STATUS_ORDER[Math.floor(Math.random() * AUTOFILL_STATUS_ORDER.length)]

      setStatus(randomStatus)

      setStatusMessage(AUTOFILL_STATUS_MESSAGES[randomStatus])

      // Simulate getting the current URL
      setCurrentUrl("https://example.com/jobs/application")
    }

    checkCurrentPage()

    // In a real extension, you would listen for tab changes
    const intervalId = setInterval(checkCurrentPage, 10000)
    return () => clearInterval(intervalId)
  }, [])

  const getButtonText = () => (
    status === "ready" ? "Autofill Form" : status === "not-available" ? "Cannot Autofill" : status === "in-progress" ? "Partial Autofill" : "Waiting for Form"
  )

  const handleAutofill = async () => {
    if (status !== "ready" && status !== "in-progress") return
    setStatusMessage("Filling form...")
    try {
      // send message to active tab content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, { action: 'scanAndFill' })
        setStatusMessage("Triggered autofill.")
      } else {
        setStatusMessage("No active tab found.")
      }
    } catch (e) {
      setStatusMessage("Failed to trigger autofill.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md mx-auto bg-[#282a36] border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-[#f8f8f2]">Autofill Assistant</CardTitle>
          <CardDescription className="text-[#6272a4]">{currentUrl}</CardDescription>
          <p className="text-sm text-[#6272a4]">{statusMessage}</p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <AutofillStatusButton status={status} onClick={handleAutofill} />
            <span className="font-semibold text-[#f8f8f2]">{getButtonText()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#6272a4]">
          Your profile information will be used to fill out job applications automatically.
        </p>
      </div>
    </div>
  )
}

export default AutofillPage
