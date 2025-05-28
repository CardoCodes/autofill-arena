/// <reference types="chrome"/>
/// <reference types="webextension-polyfill" />

import { supabase } from "../lib/supabase"
import type { Provider } from "@supabase/supabase-js"
import browser from 'webextension-polyfill';

export interface AuthError {
  message: string
}

// Helper function to get extension URL in a cross-browser way
const getExtensionUrl = () => {
  try {
    // Try Firefox/WebExtension API first
    if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
      return browser.runtime.getURL('popup.html');
    }
    // Fallback to Chrome API
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL('popup.html');
    }
    // Fallback to window origin for development/testing
    return window.location.origin;
  } catch (error) {
    console.warn('Failed to get extension URL:', error);
    return window.location.origin;
  }
};

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
      const redirectTo = getExtensionUrl();
      console.log('OAuth redirect URL:', redirectTo); // Debug log
      
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
      console.error('OAuth error:', error); // Debug log
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
