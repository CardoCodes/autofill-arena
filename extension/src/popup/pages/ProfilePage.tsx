"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import type { ProfileWithDetails } from "../../services/profileService"
import { profileService } from "../../services/profileService"

interface ProfilePageProps {
  user: any
  profile: ProfileWithDetails | null
  onProfileUpdate: (profile: any) => Promise<void>
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, profile, onProfileUpdate }) => {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [jobHistory, setJobHistory] = useState<any[]>([
    { id: "new-1", company: "", position: "", start_date: "", end_date: "", description: "", isNew: true },
  ])
  const [education, setEducation] = useState<any[]>([
    { id: "new-1", school: "", degree: "", field_of_study: "", graduation_date: "", isNew: true },
  ])
  const [projects, setProjects] = useState<any[]>([
    { id: "new-1", name: "", description: "", technologies: "", isNew: true },
  ])
  const [skills, setSkills] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setPhone(profile.phone || "")
      setLocation(profile.location || "")

      // Job history
      if (profile.jobHistory && profile.jobHistory.length > 0) {
        setJobHistory(profile.jobHistory)
      }

      // Education
      if (profile.education && profile.education.length > 0) {
        setEducation(profile.education)
      }

      // Projects
      if (profile.projects && profile.projects.length > 0) {
        setProjects(profile.projects)
      }

      // Skills
      if (profile.skills && profile.skills.length > 0) {
        setSkills(profile.skills.map((skill) => skill.name).join(", "))
      }
    }
  }, [profile])

  const addItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, items: any[], type: string) => {
    const newId = `new-${items.length + 1}`

    if (type === "job") {
      setter([
        ...items,
        { id: newId, company: "", position: "", start_date: "", end_date: "", description: "", isNew: true },
      ])
    } else if (type === "education") {
      setter([...items, { id: newId, school: "", degree: "", field_of_study: "", graduation_date: "", isNew: true }])
    } else if (type === "project") {
      setter([...items, { id: newId, name: "", description: "", technologies: "", isNew: true }])
    }
  }

  const removeItem = async (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    items: any[],
    id: string,
    type: string,
  ) => {
    // If it's a new item (not yet saved to DB), just remove it from state
    if (id.startsWith("new-")) {
      setter(items.filter((item) => item.id !== id))
      return
    }

    // Otherwise, delete from database
    try {
      let error = null

      if (type === "job") {
        const result = await profileService.deleteJobHistory(id)
        error = result.error
      } else if (type === "education") {
        const result = await profileService.deleteEducation(id)
        error = result.error
      } else if (type === "project") {
        const result = await profileService.deleteProject(id)
        error = result.error
      }

      if (error) throw error

      // Remove from state if successful
      setter(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      setSaveMessage(`Error deleting ${type}. Please try again.`)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setSaveMessage("")

    try {
      // Update basic profile
      await onProfileUpdate({
        full_name: fullName,
        phone,
        location,
      })

      // Process job history
      for (const job of jobHistory) {
        if (job.isNew) {
          // Add new job
          delete job.isNew
          await profileService.addJobHistory({
            user_id: user.id,
            company: job.company,
            position: job.position,
            start_date: job.start_date,
            end_date: job.end_date,
            description: job.description,
          })
        } else {
          // Update existing job
          await profileService.updateJobHistory(job.id, {
            company: job.company,
            position: job.position,
            start_date: job.start_date,
            end_date: job.end_date,
            description: job.description,
          })
        }
      }

      // Process education
      for (const edu of education) {
        if (edu.isNew) {
          // Add new education
          delete edu.isNew
          await profileService.addEducation({
            user_id: user.id,
            school: edu.school,
            degree: edu.degree,
            field_of_study: edu.field_of_study,
            graduation_date: edu.graduation_date,
          })
        } else {
          // Update existing education
          await profileService.updateEducation(edu.id, {
            school: edu.school,
            degree: edu.degree,
            field_of_study: edu.field_of_study,
            graduation_date: edu.graduation_date,
          })
        }
      }

      // Process projects
      for (const project of projects) {
        if (project.isNew) {
          // Add new project
          delete project.isNew
          await profileService.addProject({
            user_id: user.id,
            name: project.name,
            description: project.description,
            technologies: project.technologies,
          })
        } else {
          // Update existing project
          await profileService.updateProject(project.id, {
            name: project.name,
            description: project.description,
            technologies: project.technologies,
          })
        }
      }

      // Process skills
      if (profile?.skills) {
        // Delete existing skills
        for (const skill of profile.skills) {
          await profileService.deleteSkill(skill.id)
        }
      }

      // Add new skills
      const skillNames = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)

      if (skillNames.length > 0) {
        await profileService.addSkills(user.id, skillNames)
      }

      // Show success message
      setSaveMessage("Profile saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
      setSaveMessage("Error saving profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile</h2>
        {saveMessage && (
          <div className={`text-sm ${saveMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Personal Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ""}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Job History */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Job History</h3>
        {jobHistory.map((job, index) => (
          <div key={job.id} className="mb-4 p-4 border border-gray-200 rounded-md dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`company-${job.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Company
                </label>
                <input
                  type="text"
                  id={`company-${job.id}`}
                  value={job.company || ""}
                  onChange={(e) => {
                    const updatedJobs = [...jobHistory]
                    updatedJobs[index].company = e.target.value
                    setJobHistory(updatedJobs)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor={`position-${job.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Position
                </label>
                <input
                  type="text"
                  id={`position-${job.id}`}
                  value={job.position || ""}
                  onChange={(e) => {
                    const updatedJobs = [...jobHistory]
                    updatedJobs[index].position = e.target.value
                    setJobHistory(updatedJobs)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor={`startDate-${job.id}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id={`startDate-${job.id}`}
                    value={job.start_date || ""}
                    onChange={(e) => {
                      const updatedJobs = [...jobHistory]
                      updatedJobs[index].start_date = e.target.value
                      setJobHistory(updatedJobs)
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`endDate-${job.id}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id={`endDate-${job.id}`}
                    value={job.end_date || ""}
                    onChange={(e) => {
                      const updatedJobs = [...jobHistory]
                      updatedJobs[index].end_date = e.target.value
                      setJobHistory(updatedJobs)
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={`jobDescription-${job.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id={`jobDescription-${job.id}`}
                  value={job.description || ""}
                  onChange={(e) => {
                    const updatedJobs = [...jobHistory]
                    updatedJobs[index].description = e.target.value
                    setJobHistory(updatedJobs)
                  }}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>
            </div>
            <button
              onClick={() => removeItem(setJobHistory, jobHistory, job.id, "job")}
              className="mt-2 flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} className="mr-1" />
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem(setJobHistory, jobHistory, "job")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Job
        </button>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            List your skills (comma-separated)
          </label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g. JavaScript, React, Node.js"
          />
        </div>
      </section>

      {/* Projects */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        {projects.map((project, index) => (
          <div key={project.id} className="mb-4 p-4 border border-gray-200 rounded-md dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`projectName-${project.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id={`projectName-${project.id}`}
                  value={project.name || ""}
                  onChange={(e) => {
                    const updatedProjects = [...projects]
                    updatedProjects[index].name = e.target.value
                    setProjects(updatedProjects)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor={`projectDescription-${project.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id={`projectDescription-${project.id}`}
                  value={project.description || ""}
                  onChange={(e) => {
                    const updatedProjects = [...projects]
                    updatedProjects[index].description = e.target.value
                    setProjects(updatedProjects)
                  }}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor={`projectTechnologies-${project.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Technologies Used
                </label>
                <input
                  type="text"
                  id={`projectTechnologies-${project.id}`}
                  value={project.technologies || ""}
                  onChange={(e) => {
                    const updatedProjects = [...projects]
                    updatedProjects[index].technologies = e.target.value
                    setProjects(updatedProjects)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={() => removeItem(setProjects, projects, project.id, "project")}
              className="mt-2 flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} className="mr-1" />
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem(setProjects, projects, "project")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Project
        </button>
      </section>

      {/* Education */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        {education.map((edu, index) => (
          <div key={edu.id} className="mb-4 p-4 border border-gray-200 rounded-md dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`school-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  School
                </label>
                <input
                  type="text"
                  id={`school-${edu.id}`}
                  value={edu.school || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].school = e.target.value
                    setEducation(updatedEducation)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor={`degree-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Degree
                </label>
                <input
                  type="text"
                  id={`degree-${edu.id}`}
                  value={edu.degree || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].degree = e.target.value
                    setEducation(updatedEducation)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor={`fieldOfStudy-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Field of Study
                </label>
                <input
                  type="text"
                  id={`fieldOfStudy-${edu.id}`}
                  value={edu.field_of_study || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].field_of_study = e.target.value
                    setEducation(updatedEducation)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor={`graduationDate-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Graduation Date
                </label>
                <input
                  type="date"
                  id={`graduationDate-${edu.id}`}
                  value={edu.graduation_date || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].graduation_date = e.target.value
                    setEducation(updatedEducation)
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={() => removeItem(setEducation, education, edu.id, "education")}
              className="mt-2 flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} className="mr-1" />
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem(setEducation, education, "education")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Education
        </button>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSaveProfile}
        disabled={isSaving}
        className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
      >
        {isSaving ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save size={16} className="mr-2" />
            Save Profile
          </>
        )}
      </button>
    </div>
  )
}

export default ProfilePage
