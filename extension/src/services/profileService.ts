import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type JobHistory = Database["public"]["Tables"]["job_history"]["Row"]
export type Education = Database["public"]["Tables"]["education"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Skill = Database["public"]["Tables"]["skills"]["Row"]

export interface ProfileWithDetails extends Profile {
  jobHistory?: JobHistory[]
  education?: Education[]
  projects?: Project[]
  skills?: Skill[]
}

export const profileService = {
  // Get user profile
  getProfile: async (userId: string): Promise<{ profile: Profile | null; error: any }> => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (error: any) {
      return { profile: null, error }
    }
  },

  // Update user profile
  updateProfile: async (
    userId: string,
    updates: Partial<Profile>,
  ): Promise<{ profile: Profile | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (error: any) {
      return { profile: null, error }
    }
  },

  // Get job history
  getJobHistory: async (userId: string): Promise<{ jobs: JobHistory[]; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("job_history")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false })

      if (error) throw error
      return { jobs: data || [], error: null }
    } catch (error: any) {
      return { jobs: [], error }
    }
  },

  // Add job history
  addJobHistory: async (
    job: Omit<JobHistory, "id" | "created_at" | "updated_at">,
  ): Promise<{ job: JobHistory | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("job_history")
        .insert([{ ...job, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single()

      if (error) throw error
      return { job: data, error: null }
    } catch (error: any) {
      return { job: null, error }
    }
  },

  // Update job history
  updateJobHistory: async (
    jobId: string,
    updates: Partial<JobHistory>,
  ): Promise<{ job: JobHistory | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("job_history")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", jobId)
        .select()
        .single()

      if (error) throw error
      return { job: data, error: null }
    } catch (error: any) {
      return { job: null, error }
    }
  },

  // Delete job history
  deleteJobHistory: async (jobId: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.from("job_history").delete().eq("id", jobId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  },

  // Get education
  getEducation: async (userId: string): Promise<{ education: Education[]; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", userId)
        .order("graduation_date", { ascending: false })

      if (error) throw error
      return { education: data || [], error: null }
    } catch (error: any) {
      return { education: [], error }
    }
  },

  // Add education
  addEducation: async (
    education: Omit<Education, "id" | "created_at" | "updated_at">,
  ): Promise<{ education: Education | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("education")
        .insert([{ ...education, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single()

      if (error) throw error
      return { education: data, error: null }
    } catch (error: any) {
      return { education: null, error }
    }
  },

  // Update education
  updateEducation: async (
    educationId: string,
    updates: Partial<Education>,
  ): Promise<{ education: Education | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("education")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", educationId)
        .select()
        .single()

      if (error) throw error
      return { education: data, error: null }
    } catch (error: any) {
      return { education: null, error }
    }
  },

  // Delete education
  deleteEducation: async (educationId: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.from("education").delete().eq("id", educationId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  },

  // Get projects
  getProjects: async (userId: string): Promise<{ projects: Project[]; error: any }> => {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("user_id", userId)

      if (error) throw error
      return { projects: data || [], error: null }
    } catch (error: any) {
      return { projects: [], error }
    }
  },

  // Add project
  addProject: async (
    project: Omit<Project, "id" | "created_at" | "updated_at">,
  ): Promise<{ project: Project | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single()

      if (error) throw error
      return { project: data, error: null }
    } catch (error: any) {
      return { project: null, error }
    }
  },

  // Update project
  updateProject: async (
    projectId: string,
    updates: Partial<Project>,
  ): Promise<{ project: Project | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", projectId)
        .select()
        .single()

      if (error) throw error
      return { project: data, error: null }
    } catch (error: any) {
      return { project: null, error }
    }
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  },

  // Get skills
  getSkills: async (userId: string): Promise<{ skills: Skill[]; error: any }> => {
    try {
      const { data, error } = await supabase.from("skills").select("*").eq("user_id", userId)

      if (error) throw error
      return { skills: data || [], error: null }
    } catch (error: any) {
      return { skills: [], error }
    }
  },

  // Add skills (multiple)
  addSkills: async (userId: string, skillNames: string[]): Promise<{ skills: Skill[]; error: any }> => {
    try {
      const skillsToInsert = skillNames.map((name) => ({
        user_id: userId,
        name,
        created_at: new Date().toISOString(),
      }))

      const { data, error } = await supabase.from("skills").insert(skillsToInsert).select()

      if (error) throw error
      return { skills: data || [], error: null }
    } catch (error: any) {
      return { skills: [], error }
    }
  },

  // Delete skill
  deleteSkill: async (skillId: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", skillId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  },

  // Get complete profile with all related data
  getCompleteProfile: async (userId: string): Promise<{ profile: ProfileWithDetails | null; error: any }> => {
    try {
      // Get basic profile
      const { profile, error: profileError } = await profileService.getProfile(userId)
      if (profileError) throw profileError
      if (!profile) throw new Error("Profile not found")

      // Get job history
      const { jobs, error: jobsError } = await profileService.getJobHistory(userId)
      if (jobsError) throw jobsError

      // Get education
      const { education, error: educationError } = await profileService.getEducation(userId)
      if (educationError) throw educationError

      // Get projects
      const { projects, error: projectsError } = await profileService.getProjects(userId)
      if (projectsError) throw projectsError

      // Get skills
      const { skills, error: skillsError } = await profileService.getSkills(userId)
      if (skillsError) throw skillsError

      return {
        profile: {
          ...profile,
          jobHistory: jobs,
          education,
          projects,
          skills,
        },
        error: null,
      }
    } catch (error: any) {
      return { profile: null, error }
    }
  },
}
