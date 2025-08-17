"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import type { ProfileWithDetails } from "../../services/profileService"
import { profileService } from "../../services/profileService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionCard } from "../components/profile/SectionCard"
import { PersonalInfoForm } from "../components/profile/PersonalInfoForm"
import { EditableList } from "../components/profile/EditableList"

interface ProfilePageProps {
  user: any
  profile: ProfileWithDetails | null
  onProfileUpdate: (profile: any) => Promise<void>
  isDarkMode: boolean
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, profile, onProfileUpdate, isDarkMode }) => {
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
          <div className={`text-sm ${saveMessage.includes("Error") ? "text-[#ff5555]" : "text-[#50fa7b]"}`}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Personal Information */}
      <SectionCard title="Personal Information" isDarkMode={isDarkMode}>
        <PersonalInfoForm
          fullName={fullName}
          email={user?.email || ""}
          phone={phone}
          location={location}
          onChange={(field, value) => {
            if (field === 'fullName') setFullName(value)
            if (field === 'phone') setPhone(value)
            if (field === 'location') setLocation(value)
          }}
        />
      </SectionCard>

      {/* Job History */}
      <SectionCard
        title="Job History"
        isDarkMode={isDarkMode}
        headerRight={(
          <Button variant="outline" size="icon" onClick={() => addItem(setJobHistory, jobHistory, "job")}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      >
        <EditableList
          items={jobHistory as any}
          kind="job"
          isDarkMode={isDarkMode}
          onChange={(next: any[]) => setJobHistory(next)}
          onRemove={(id: string) => removeItem(setJobHistory, jobHistory, id, "job")}
          onAdd={() => addItem(setJobHistory, jobHistory, "job")}
        />
      </SectionCard>

      {/* Skills */}
      <SectionCard title="Skills" isDarkMode={isDarkMode}>
        <div className="space-y-2">
          <Label htmlFor="skills">List your skills (comma-separated)</Label>
          <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. JavaScript, React, Node.js" className="bg-transparent" />
        </div>
      </SectionCard>

      {/* Projects */}
      <SectionCard title="Projects" isDarkMode={isDarkMode}>
        <EditableList
          items={projects as any}
          kind="project"
          isDarkMode={isDarkMode}
          onChange={(next: any[]) => setProjects(next)}
          onRemove={(id: string) => removeItem(setProjects, projects, id, "project")}
          onAdd={() => addItem(setProjects, projects, "project")}
        />
      </SectionCard>

      {/* Education */}
      <SectionCard title="Education" isDarkMode={isDarkMode}>
        <EditableList
          items={education as any}
          kind="education"
          isDarkMode={isDarkMode}
          onChange={(next: any[]) => setEducation(next)}
          onRemove={(id: string) => removeItem(setEducation, education, id, "education")}
          onAdd={() => addItem(setEducation, education, "education")}
        />
      </SectionCard>

      {/* Save Button */}
      <Button
        onClick={handleSaveProfile}
        disabled={isSaving}
        className="w-full bg-[#50fa7b] hover:bg-[#50fa7b]/90 text-[#282a36] transition-all duration-300"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </>
        )}
      </Button>
    </div>
  )
}

export default ProfilePage
