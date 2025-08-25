"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AUTOFILL_STATUS_MESSAGES, AUTOFILL_STATUS_ORDER, THEME_COLORS, type AutofillStatus } from "../constants/ui"
import { AutofillStatusButton } from "../components/AutofillStatusButton"

type T = AutofillStatus

interface Props { isDarkMode?: boolean }

const AutofillPage: React.FC<Props> = ({ isDarkMode = true }) => {
  const [status, setStatus] = useState<AutofillStatus>("neutral")
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string>("Checking page compatibility...")

  useEffect(() => {
    const updateFromDetection = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!tab?.id) return
        setStatus("neutral")
        setStatusMessage("Checking page compatibility...")
        const resp = await chrome.tabs.sendMessage(tab.id, { action: 'detectStatus' })
        if (!resp?.ok) {
          setStatus("neutral")
          setStatusMessage("Unable to check this page.")
          return
        }
        setCurrentUrl(resp.url || "")
        const det = resp.detection
        // Map backend response to UI status
        const score = Number(det?.score || 0)
        const fieldCount = Number(det?.details?.fieldCount || 0)
        const formCount = Number(det?.details?.formCount || 0)
        const detected = !!det?.detected
        let newStatus: AutofillStatus = "neutral"
        if (!fieldCount && !detected) {
          newStatus = "not-available"
        } else if (detected && (formCount >= 1 || score >= 0.6)) {
          newStatus = "ready"
        } else {
          newStatus = "in-progress"
        }
        setStatus(newStatus)
        setStatusMessage(AUTOFILL_STATUS_MESSAGES[newStatus])
      } catch (e) {
        setStatus("neutral")
        setStatusMessage("Unable to check this page.")
      }
    }

    updateFromDetection()
    const intervalId = setInterval(updateFromDetection, 10000)
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
      <Card className={`w-full max-w-md mx-auto border-0 shadow-none ${isDarkMode ? "bg-[#282a36]" : "bg-white"}`}>
        <CardHeader className="text-center">
          <CardTitle className={`${isDarkMode ? "text-[#f8f8f2]" : "text-[#1a1a1a]"}`}>Autofill Assistant</CardTitle>
          <CardDescription className={`${isDarkMode ? "text-[#6272a4]" : "text-gray-500"}`}>{currentUrl}</CardDescription>
          <p className={`text-sm ${isDarkMode ? "text-[#6272a4]" : "text-gray-500"}`}>{statusMessage}</p>
        </CardHeader>
        <CardContent className="flex justify-center pt-6">
          <div className="flex flex-col items-center gap-3">
            <AutofillStatusButton status={status} onClick={handleAutofill} isDarkMode={isDarkMode} />
            <span className={`font-semibold ${isDarkMode ? "text-[#f8f8f2]" : "text-[#1a1a1a]"}`}>{getButtonText()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className={`text-sm ${isDarkMode ? "text-[#6272a4]" : "text-gray-500"}`}>
          Your profile information will be used to fill out job applications automatically.
        </p>
      </div>
    </div>
  )
}

export default AutofillPage
