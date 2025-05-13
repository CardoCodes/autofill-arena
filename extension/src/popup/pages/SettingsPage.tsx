import type React from "react"
import { X } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"
import { useDrag } from "react-use-gesture"

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
      className="h-full w-full bg-white dark:bg-gray-800 rounded-t-lg shadow-lg overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">General</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Enable push notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Job match alerts</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Privacy</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Allow data collection for personalization</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Share usage statistics</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Autofill Settings</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="autofill-speed"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Autofill Speed
                </label>
                <select
                  id="autofill-speed"
                  name="autofill-speed"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>Fast</option>
                  <option>Medium</option>
                  <option>Slow</option>
                </select>
              </div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Auto-submit forms after filling</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="ai-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  AI Model
                </label>
                <select
                  id="ai-model"
                  name="ai-model"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>GPT-3.5</option>
                  <option>GPT-4</option>
                  <option>Custom Model</option>
                </select>
              </div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Use AI for resume optimization</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Management</h3>
            <div className="space-y-4">
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200">
                Clear All Data
              </button>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}

export default SettingsPage
