/// <reference types="chrome"/>

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  provider?: string
}

const USER_KEY = 'currentUser'
const USERS_DB_KEY = 'usersDb'

export const userService = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const result = await chrome.storage.local.get([USER_KEY])
      const user = result[USER_KEY]
      return user ? user as User : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  setCurrentUser: async (user: User): Promise<void> => {
    try {
      await chrome.storage.local.set({ [USER_KEY]: user })
    } catch (error) {
      console.error('Error setting current user:', error)
    }
  },

  saveUser: async (user: User): Promise<void> => {
    try {
      // Get existing users
      const result = await chrome.storage.local.get([USERS_DB_KEY])
      const usersDb: Record<string, User> = result[USERS_DB_KEY] || {}
      
      // Add or update user
      usersDb[user.id] = user
      
      // Save back to storage
      await chrome.storage.local.set({ [USERS_DB_KEY]: usersDb })
    } catch (error) {
      console.error('Error saving user:', error)
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const result = await chrome.storage.local.get([USERS_DB_KEY])
      const usersDb: Record<string, User> = result[USERS_DB_KEY] || {}
      return Object.values(usersDb)
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  },

  logout: async (): Promise<void> => {
    try {
      await chrome.storage.local.remove([USER_KEY])
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
}

export default userService
