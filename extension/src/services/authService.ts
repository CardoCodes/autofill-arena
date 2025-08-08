/// <reference types="chrome"/>
/// <reference types="webextension-polyfill" />

import { getProfile, saveProfile } from "./localProfile"

// Conditionally import webextension-polyfill only in browser extension environment
let browser: any = null;
if (typeof window !== 'undefined') {
  try {
    // Only try to access webextension-polyfill in browser environment
    const webextPolyfill = (globalThis as any).browser;
    if (webextPolyfill) {
      browser = webextPolyfill;
    }
  } catch (error) {
    console.warn('webextension-polyfill not available:', error);
  }
}

export interface AuthError {
  message: string
}

// Helper function to get extension URL in a cross-browser way
const getExtensionUrl = () => {
  try {
    // Try Firefox/WebExtension API first
    if (browser && browser.runtime && browser.runtime.getURL) {
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
  signUp: async (email: string, _password: string, fullName: string) => {
    try {
      const profile = await getProfile()
      await saveProfile({ ...profile, email, full_name: fullName })
      return { user: { email } as any, error: null }
    } catch (error: any) {
      return { user: null, error: { message: error.message } }
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, _password: string) => {
    try {
      const profile = await getProfile()
      if (!profile.email) await saveProfile({ ...profile, email })
      return { user: { email } as any, error: null }
    } catch (error: any) {
      return { user: null, error: { message: error.message } }
    }
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (_provider: any) => {
    return { data: null, error: { message: 'OAuth disabled in local mode' } }
  },

  // Sign out
  signOut: async () => ({ error: null }),

  // Get current user
  getCurrentUser: async () => ({ user: { email: 'local@example.com' } as any, error: null }),

  // Reset password
  resetPassword: async (_email: string) => ({ error: { message: 'Not available in local mode' } }),
}
