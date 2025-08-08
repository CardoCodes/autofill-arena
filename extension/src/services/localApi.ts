export async function getApiBase(): Promise<string> {
  const fallback = 'http://localhost:5123'
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      const resp = await chrome.runtime.sendMessage({ type: 'getApiBase' })
      return resp?.apiBase || fallback
    }
  } catch {}
  return fallback
}

export async function apiGet<T>(path: string): Promise<T> {
  const base = await getApiBase()
  const res = await fetch(`${base}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed`)
  return res.json() as Promise<T>
}

export async function apiJson<T>(path: string, method: 'POST' | 'PUT', body: any): Promise<T> {
  const base = await getApiBase()
  const res = await fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`${method} ${path} failed`)
  return res.json() as Promise<T>
}


