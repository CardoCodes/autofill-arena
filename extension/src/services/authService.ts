/// <reference types="chrome"/>

import { supabase } from "../lib/supabase"
import type { Provider } from "@supabase/supabase-js"

export interface AuthError {
  message: string
}

export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error
      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: { message: error.message } }
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: { message: error.message } }
    }
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (provider: Provider) => {
    try {
      let redirectTo = window.location.origin;
      // Check if we're in a Chrome extension context
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        redirectTo = chrome.runtime.getURL('popup.html');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: { message: error.message } }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: { message: error.message } }
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  },
}
