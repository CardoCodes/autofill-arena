"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getProfile, saveProfile } from "../../services/localProfile"

interface SettingsPageProps {
  onClose: () => void
  isDarkMode: boolean
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, isDarkMode }) => {
  const [agentProvider, setAgentProvider] = useState<string>("openai")
  const [apiKey, setApiKey] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile()
      if (profile.agent_provider) setAgentProvider(profile.agent_provider as string)
      if (profile.agent_api_key) setApiKey(profile.agent_api_key as string)
    }
    load()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      await saveProfile({ agent_provider: agentProvider, agent_api_key: apiKey })
      setMessage("Saved")
      setTimeout(() => setMessage(""), 2000)
    } catch (e) {
      setMessage("Error saving settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={`h-full overflow-y-auto p-4 ${isDarkMode ? "bg-[#282a36]" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}`}>Settings</h2>
        <div className="flex items-center gap-2">
          {message && <span className="text-xs text-muted-foreground">{message}</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`${isDarkMode ? "text-[#f8f8f2] hover:bg-[#44475a]" : "text-gray-900 hover:bg-gray-100"} transition-all duration-300`}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className={`${isDarkMode ? "bg-[#282a36] border-0" : "bg-white border-0"} shadow-none`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-provider" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Provider</Label>
              <Select value={agentProvider} onValueChange={setAgentProvider}>
                <SelectTrigger id="agent-provider" className="bg-transparent">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-api-key" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>API Key</Label>
              <Input
                id="agent-api-key"
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-transparent"
                placeholder="sk-..."
              />
            </div>

            <Button onClick={handleSave} disabled={isSaving} className={`${isDarkMode ? "bg-[#bd93f9] hover:bg-[#bd93f9]/90 text-[#282a36]" : "bg-purple-600 hover:bg-purple-700 text-white"}`}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
