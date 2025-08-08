import { apiGet, apiJson } from './localApi'

export type LocalProfile = {
  full_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  linkedin?: string
  github?: string
}

export async function getProfile(): Promise<LocalProfile> {
  const { profile } = await apiGet<{ profile: LocalProfile }>('/profile')
  return profile || {}
}

export async function saveProfile(profile: Partial<LocalProfile>): Promise<void> {
  await apiJson('/profile', 'PUT', { profile })
}

export async function getAnswers(): Promise<Record<string, string>> {
  const { answers } = await apiGet<{ answers: Record<string, string> }>('/answers')
  return answers || {}
}

export async function saveAnswers(answers: Record<string, string>): Promise<void> {
  await apiJson('/answers', 'PUT', { answers })
}


