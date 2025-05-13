import type React from "react"
import { X } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"
import { useDrag } from "react-use-gesture"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Checkbox } from "../../../components/ui/checkbox"
import { cn } from "../../../lib/utils"
import { Separator } from "../../../components/ui/separator"

interface SettingsPageProps {
  onClose: () => void
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }))

  const bind = useDrag(
    ({ down, movement: [, my], velocity }) => {
      if (down && my > 0) {
        api.start({ y: my, immediate: down })
      } else {
        if (my > window.innerHeight * 0.2 || velocity > 0.5) {
          onClose()
        } else {
          api.start({ y: 0 })
        }
      }
    },
    { axis: "y", bounds: { top: 0 } },
  )

  return (
    <animated.div
      {...bind()}
      style={{
        y,
        touchAction: "none",
      }}
      className="h-full w-full bg-background rounded-t-lg shadow-lg overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X size={24} />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">General</h3>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="push-notifications" />
                <Label htmlFor="push-notifications">Enable push notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="email-notifications" />
                <Label htmlFor="email-notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="job-match-alerts" />
                <Label htmlFor="job-match-alerts">Job match alerts</Label>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="data-collection" />
                <Label htmlFor="data-collection">Allow data collection for personalization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="usage-statistics" />
                <Label htmlFor="usage-statistics">Share usage statistics</Label>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Autofill Settings</h3>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="autofill-speed">Autofill Speed</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-submit" />
                <Label htmlFor="auto-submit">Auto-submit forms after filling</Label>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT-3.5</SelectItem>
                    <SelectItem value="gpt4">GPT-4</SelectItem>
                    <SelectItem value="custom">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="resume-optimization" />
                <Label htmlFor="resume-optimization">Use AI for resume optimization</Label>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Management</h3>
            <div className="space-y-4">
              <Button variant="destructive" className="w-full">
                Clear All Data
              </Button>
              <Button className="w-full">
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}

export default SettingsPage
