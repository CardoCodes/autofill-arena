export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          phone: string | null
          location: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
        }
      }
      job_history: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          start_date: string | null
          end_date: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      education: {
        Row: {
          id: string
          user_id: string
          school: string
          degree: string | null
          field_of_study: string | null
          graduation_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          school: string
          degree?: string | null
          field_of_study?: string | null
          graduation_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          school?: string
          degree?: string | null
          field_of_study?: string | null
          graduation_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          technologies: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          technologies?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          technologies?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string | null
        }
      }
    }
  }
}
