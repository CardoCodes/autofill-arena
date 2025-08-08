// Local mode: Supabase disabled. This file remains to satisfy imports.
export const supabase = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } } as any),
    getUser: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: { message: 'disabled' } }),
    signInWithPassword: async () => ({ data: { user: null }, error: { message: 'disabled' } }),
    signInWithOAuth: async () => ({ data: null, error: { message: 'disabled' } }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: { message: 'disabled' } })
  }
} as any
