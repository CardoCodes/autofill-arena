"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsPageProps {
  onClose: () => void
  isDarkMode: boolean
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, isDarkMode }) => {
  return (
    <div className={`h-full overflow-y-auto p-4 ${isDarkMode ? "bg-[#282a36]" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}`}>Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={`${isDarkMode ? "text-[#f8f8f2] hover:bg-[#44475a]" : "text-gray-900 hover:bg-gray-100"} transition-all duration-300`}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <Card className={`${isDarkMode ? "bg-[#44475a] border-0" : "bg-white border border-gray-200"} shadow-none`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Push notifications</Label>
              <Switch
                id="push-notifications"
                className={`${isDarkMode ? "data-[state=checked]:bg-[#50fa7b]" : "data-[state=checked]:bg-purple-600"}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Email notifications</Label>
              <Switch
                id="email-notifications"
                className={`${isDarkMode ? "data-[state=checked]:bg-[#50fa7b]" : "data-[state=checked]:bg-purple-600"}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="job-alerts" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Job match alerts</Label>
              <Switch
                id="job-alerts"
                className={`${isDarkMode ? "data-[state=checked]:bg-[#50fa7b]" : "data-[state=checked]:bg-purple-600"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={`${isDarkMode ? "bg-[#44475a] border-0" : "bg-white border border-gray-200"} shadow-none`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-collection" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Allow data collection for personalization</Label>
              <Switch
                id="data-collection"
                className={`${isDarkMode ? "data-[state=checked]:bg-[#50fa7b]" : "data-[state=checked]:bg-purple-600"}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usage-stats" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Share usage statistics</Label>
              <Switch
                id="usage-stats"
                className={`${isDarkMode ? "data-[state=checked]:bg-[#50fa7b]" : "data-[state=checked]:bg-purple-600"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={`${isDarkMode ? "bg-[#44475a] border-0" : "bg-white border border-gray-200"} shadow-none`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-model" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>AI Model</Label>
              <Select defaultValue="gpt-3.5">
                <SelectTrigger 
                  id="ai-model"
                  className={`${
                    isDarkMode 
                      ? "bg-[#282a36] border-[#6272a4] text-[#f8f8f2] focus:ring-[#bd93f9] hover:border-[#bd93f9]" 
                      : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500 hover:border-purple-500"
                  } transition-all duration-300`}
                >
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? "bg-[#282a36] border-[#6272a4]" : "bg-white border-gray-200"}>
                  <SelectItem 
                    value="gpt-3.5" 
                    className={`${
                      isDarkMode 
                        ? "text-[#f8f8f2] focus:bg-[#44475a] hover:bg-[#44475a]" 
                        : "text-gray-900 focus:bg-purple-50 hover:bg-purple-50"
                    }`}
                  >
                    GPT-3.5
                  </SelectItem>
                  <SelectItem 
                    value="gpt-4" 
                    className={`${
                      isDarkMode 
                        ? "text-[#f8f8f2] focus:bg-[#44475a] hover:bg-[#44475a]" 
                        : "text-gray-900 focus:bg-purple-50 hover:bg-purple-50"
                    }`}
                  >
                    GPT-4
                  </SelectItem>
                  <SelectItem 
                    value="custom" 
                    className={`${
                      isDarkMode 
                        ? "text-[#f8f8f2] focus:bg-[#44475a] hover:bg-[#44475a]" 
                        : "text-gray-900 focus:bg-purple-50 hover:bg-purple-50"
                    }`}
                  >
                    Custom Model
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="resume-optimization" className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Use AI for resume optimization</Label>
              <Switch
                id="resume-optimization"
                className={`${isDarkMode ? "data-[state=checked]:bg-[#50fa7b]" : "data-[state=checked]:bg-purple-600"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={`${isDarkMode ? "bg-[#44475a] border-0" : "bg-white border border-gray-200"} shadow-none`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-[#f8f8f2]" : "text-gray-900"}>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="destructive" 
              className={`w-full ${
                isDarkMode 
                  ? "bg-[#ff5555] hover:bg-[#ff5555]/90 text-[#f8f8f2]" 
                  : "bg-red-500 hover:bg-red-600 text-white"
              } transition-all duration-300`}
            >
              Clear All Data
            </Button>
            <Button 
              className={`w-full ${
                isDarkMode 
                  ? "bg-[#bd93f9] hover:bg-[#bd93f9]/90 text-[#282a36]" 
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              } transition-all duration-300`}
            >
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
