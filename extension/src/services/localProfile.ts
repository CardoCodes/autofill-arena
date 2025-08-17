import { apiGet, apiJson } from './localApi'

const PROFILE_STORE_KEY = 'local_profile'
const ANSWERS_STORE_KEY = 'local_answers'

async function storageGet(keys: string[] | string): Promise<Record<string, any>> {
  try {
    // Firefox/webextension-polyfill path
    // @ts-ignore
    if (typeof browser !== 'undefined' && browser.storage?.local?.get) {
      // @ts-ignore
      return await browser.storage.local.get(keys as any)
    }
  } catch {}
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local?.get) {
      return await new Promise((resolve) => {
        chrome.storage.local.get(keys as any, (items) => resolve(items || {}))
      })
    }
  } catch {}
  return {}
}

async function storageSet(items: Record<string, any>): Promise<void> {
  try {
    // @ts-ignore
    if (typeof browser !== 'undefined' && browser.storage?.local?.set) {
      // @ts-ignore
      await browser.storage.local.set(items)
      return
    }
  } catch {}
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local?.set) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set(items, () => resolve())
      })
      return
    }
  } catch {}
}

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
  // Agent settings
  agent_provider?: string
  agent_api_key?: string
}

export async function getProfile(): Promise<LocalProfile> {
  // Try backend first with a short timeout; fallback to storage
  try {
    const controller = new AbortController()
    const to = setTimeout(() => controller.abort(), 1200)
    const base = await import('./localApi').then(m => m.getApiBase())
    const res = await fetch(`${await base}/profile`, { signal: controller.signal })
    clearTimeout(to)
    if (res.ok) {
      const { profile } = await res.json()
      // cache locally
      await storageSet({ [PROFILE_STORE_KEY]: profile || {} })
      return profile || {}
    }
  } catch {}
  // Fallback to storage
  const result = await storageGet([PROFILE_STORE_KEY])
  return (result[PROFILE_STORE_KEY] || {}) as LocalProfile
  return {}
}

export async function saveProfile(profile: Partial<LocalProfile>): Promise<void> {
  // Save to backend (best-effort)
  try {
    await apiJson('/profile', 'PUT', { profile })
  } catch {}
  // Cache locally
  const current = await getProfile()
  await storageSet({ [PROFILE_STORE_KEY]: { ...current, ...profile } })
}

export async function getAnswers(): Promise<Record<string, string>> {
  try {
    const { answers } = await apiGet<{ answers: Record<string, string> }>('/answers')
    await storageSet({ [ANSWERS_STORE_KEY]: answers || {} })
    return answers || {}
  } catch {
    const result = await storageGet([ANSWERS_STORE_KEY])
    return (result[ANSWERS_STORE_KEY] || {}) as Record<string, string>
    return {}
  }
}

export async function saveAnswers(answers: Record<string, string>): Promise<void> {
  try {
    await apiJson('/answers', 'PUT', { answers })
  } catch {}
  const current = await getAnswers()
  await storageSet({ [ANSWERS_STORE_KEY]: { ...current, ...answers } })
}


