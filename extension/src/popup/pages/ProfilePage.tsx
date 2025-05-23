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
          <div className={`text-sm ${saveMessage.includes("Error") ? "text-destructive" : "text-green-500"}`}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={user?.email || ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Job History */}
      <Card>
        <CardHeader>
          <CardTitle>Job History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobHistory.map((job, index) => (
            <div key={job.id} className="p-4 border rounded-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`company-${job.id}`}>Company</Label>
                <Input
                  type="text"
                  id={`company-${job.id}`}
                  value={job.company || ""}
                  onChange={(e) => {
                    const updatedJobs = [...jobHistory]
                    updatedJobs[index].company = e.target.value
                    setJobHistory(updatedJobs)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`position-${job.id}`}>Position</Label>
                <Input
                  type="text"
                  id={`position-${job.id}`}
                  value={job.position || ""}
                  onChange={(e) => {
                    const updatedJobs = [...jobHistory]
                    updatedJobs[index].position = e.target.value
                    setJobHistory(updatedJobs)
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${job.id}`}>Start Date</Label>
                  <Input
                    type="date"
                    id={`startDate-${job.id}`}
                    value={job.start_date || ""}
                    onChange={(e) => {
                      const updatedJobs = [...jobHistory]
                      updatedJobs[index].start_date = e.target.value
                      setJobHistory(updatedJobs)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${job.id}`}>End Date</Label>
                  <Input
                    type="date"
                    id={`endDate-${job.id}`}
                    value={job.end_date || ""}
                    onChange={(e) => {
                      const updatedJobs = [...jobHistory]
                      updatedJobs[index].end_date = e.target.value
                      setJobHistory(updatedJobs)
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`jobDescription-${job.id}`}>Description</Label>
                <Textarea
                  id={`jobDescription-${job.id}`}
                  value={job.description || ""}
                  onChange={(e) => {
                    const updatedJobs = [...jobHistory]
                    updatedJobs[index].description = e.target.value
                    setJobHistory(updatedJobs)
                  }}
                  rows={3}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(setJobHistory, jobHistory, job.id, "job")}
                className="mt-2"
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem(setJobHistory, jobHistory, "job")}>
            <Plus size={16} className="mr-1" />
            Add Job
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="skills">List your skills (comma-separated)</Label>
            <Input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="p-4 border rounded-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`projectName-${project.id}`}>Project Name</Label>
                <Input
                  type="text"
                  id={`projectName-${project.id}`}
                  value={project.name || ""}
                  onChange={(e) => {
                    const updatedProjects = [...projects]
                    updatedProjects[index].name = e.target.value
                    setProjects(updatedProjects)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`projectDescription-${project.id}`}>Description</Label>
                <Textarea
                  id={`projectDescription-${project.id}`}
                  value={project.description || ""}
                  onChange={(e) => {
                    const updatedProjects = [...projects]
                    updatedProjects[index].description = e.target.value
                    setProjects(updatedProjects)
                  }}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`projectTechnologies-${project.id}`}>Technologies Used</Label>
                <Input
                  type="text"
                  id={`projectTechnologies-${project.id}`}
                  value={project.technologies || ""}
                  onChange={(e) => {
                    const updatedProjects = [...projects]
                    updatedProjects[index].technologies = e.target.value
                    setProjects(updatedProjects)
                  }}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(setProjects, projects, project.id, "project")}
                className="mt-2"
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem(setProjects, projects, "project")}>
            <Plus size={16} className="mr-1" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id} className="p-4 border rounded-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`school-${edu.id}`}>School</Label>
                <Input
                  type="text"
                  id={`school-${edu.id}`}
                  value={edu.school || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].school = e.target.value
                    setEducation(updatedEducation)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                <Input
                  type="text"
                  id={`degree-${edu.id}`}
                  value={edu.degree || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].degree = e.target.value
                    setEducation(updatedEducation)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`fieldOfStudy-${edu.id}`}>Field of Study</Label>
                <Input
                  type="text"
                  id={`fieldOfStudy-${edu.id}`}
                  value={edu.field_of_study || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].field_of_study = e.target.value
                    setEducation(updatedEducation)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`graduationDate-${edu.id}`}>Graduation Date</Label>
                <Input
                  type="date"
                  id={`graduationDate-${edu.id}`}
                  value={edu.graduation_date || ""}
                  onChange={(e) => {
                    const updatedEducation = [...education]
                    updatedEducation[index].graduation_date = e.target.value
                    setEducation(updatedEducation)
                  }}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(setEducation, education, edu.id, "education")}
                className="mt-2"
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem(setEducation, education, "education")}>
            <Plus size={16} className="mr-1" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
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
