// Local mode shim: we only expose getCompleteProfile/updateProfile with our backend
import { getProfile as getLocalProfile, saveProfile as saveLocalProfile } from './localProfile'

export type Profile = any
export type JobHistory = any
export type Education = any
export type Project = any
export type Skill = any

export interface ProfileWithDetails extends Profile {
  jobHistory?: JobHistory[]
  education?: Education[]
  projects?: Project[]
  skills?: Skill[]
}

export const profileService = {
  getProfile: async (_userId: string): Promise<{ profile: Profile | null; error: any }> => {
    try {
      const data = await getLocalProfile()
      return { profile: data as any, error: null }
    } catch (error: any) {
      return { profile: null, error }
    }
  },

  // Update user profile
  updateProfile: async (_userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: any }> => {
    try {
      await saveLocalProfile(updates as any)
      const data = await getLocalProfile()
      return { profile: data as any, error: null }
    } catch (error: any) {
      return { profile: null, error }
    }
  },

  // Get job history
  getJobHistory: async (_userId: string): Promise<{ jobs: JobHistory[]; error: any }> => ({ jobs: [], error: null }),

  // Add job history
  addJobHistory: async (_job: any) => ({ job: null, error: null }),

  // Update job history
  updateJobHistory: async (_jobId: string, _updates: any) => ({ job: null, error: null }),

  // Delete job history
  deleteJobHistory: async (_jobId: string): Promise<{ error: any }> => ({ error: null }),

  // Get education
  getEducation: async (_userId: string): Promise<{ education: Education[]; error: any }> => ({ education: [], error: null }),

  // Add education
  addEducation: async (_education: any) => ({ education: null, error: null }),

  // Update education
  updateEducation: async (_educationId: string, _updates: any) => ({ education: null, error: null }),

  // Delete education
  deleteEducation: async (_educationId: string): Promise<{ error: any }> => ({ error: null }),

  // Get projects
  getProjects: async (_userId: string): Promise<{ projects: Project[]; error: any }> => ({ projects: [], error: null }),

  // Add project
  addProject: async (_project: any) => ({ project: null, error: null }),

  // Update project
  updateProject: async (_projectId: string, _updates: any) => ({ project: null, error: null }),

  // Delete project
  deleteProject: async (_projectId: string): Promise<{ error: any }> => ({ error: null }),

  // Get skills
  getSkills: async (_userId: string): Promise<{ skills: Skill[]; error: any }> => ({ skills: [], error: null }),

  // Add skills (multiple)
  addSkills: async (_userId: string, _skillNames: string[]): Promise<{ skills: Skill[]; error: any }> => ({ skills: [], error: null }),

  // Delete skill
  deleteSkill: async (_skillId: string): Promise<{ error: any }> => ({ error: null }),

  // Get complete profile with all related data
  getCompleteProfile: async (_userId: string): Promise<{ profile: ProfileWithDetails | null; error: any }> => {
    try {
      const profile = await getLocalProfile()
      return { profile: profile as any, error: null }
    } catch (error: any) {
      return { profile: null, error }
    }
  },
}
