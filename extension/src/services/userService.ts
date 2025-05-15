// Types for user data
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  provider: string
  jobHistory?: JobHistory[]
  education?: Education[]
  skills?: string[]
  projects?: Project[]
  location?: string
  phone?: string
}

export interface JobHistory {
  id: number
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  id: number
  school: string
  degree: string
  fieldOfStudy: string
  graduationDate: string
}

export interface Project {
  id: number
  name: string
  description: string
  technologies: string
}

// Local storage keys
const USER_KEY = "middleai_user"
const USERS_DB_KEY = "middleai_users_db"

// User service functions
export const userService = {
  // Get current user from local storage
  getCurrentUser: (): UserProfile | null => {
    if (typeof window === "undefined") return null
    const userJson = localStorage.getItem(USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  },

  // Save user to local storage and "database"
  saveUser: (user: UserProfile): void => {
    if (typeof window === "undefined") return

    // Save current user
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    // Update user in "database"
    const usersDb = userService.getAllUsers()
    const existingUserIndex = usersDb.findIndex((u) => u.id === user.id)

    if (existingUserIndex >= 0) {
      usersDb[existingUserIndex] = user
    } else {
      usersDb.push(user)
    }

    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb))
  },

  // Get all users from "database"
  getAllUsers: (): UserProfile[] => {
    if (typeof window === "undefined") return []
    const usersJson = localStorage.getItem(USERS_DB_KEY)
    return usersJson ? JSON.parse(usersJson) : []
  },

  // Login user
  login: (userData: UserProfile): void => {
    userService.saveUser(userData)
  },

  // Logout user
  logout: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
  },

  // Update user profile
  updateProfile: (profileData: Partial<UserProfile>): UserProfile | null => {
    const currentUser = userService.getCurrentUser()
    if (!currentUser) return null

    const updatedUser = { ...currentUser, ...profileData }
    userService.saveUser(updatedUser)
    return updatedUser
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!userService.getCurrentUser()
  },
}

// In a real application, this would be replaced with actual API calls to your backend
export const apiService = {
  // Simulate API call to save user data to database
  saveUserToDatabase: async (user: UserProfile): Promise<UserProfile> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would be an API call to your backend
    userService.saveUser(user)

    return user
  },

  // Simulate API call to get user data from database
  getUserFromDatabase: async (userId: string): Promise<UserProfile | null> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would be an API call to your backend
    const users = userService.getAllUsers()
    return users.find((u) => u.id === userId) || null
  },
}
