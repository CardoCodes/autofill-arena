// Applies simple heuristics over url, title, and content to estimate form presence
const URL_KEYWORDS = ['login', 'signin', 'signup', 'register', 'apply', 'account', 'checkout', 'form']
const TITLE_KEYWORDS = ['login', 'sign in', 'sign up', 'register', 'apply', 'application', 'checkout', 'contact', 'form']
const CONTENT_KEYWORDS = ['email', 'password', 'first name', 'last name', 'address', 'phone', 'submit']

function scoreByKeywords(text, keywords) {
  if (!text) return 0
  const haystack = String(text).toLowerCase()
  const hits = keywords.reduce((acc, kw) => acc + (haystack.includes(kw) ? 1 : 0), 0)
  return Math.min(1, hits / Math.max(3, keywords.length / 2))
}

export class HeuristicDetector {
  analyzeUrl(url) {
    if (!url) return 0
    try {
      const u = new URL(url)
      return scoreByKeywords(u.pathname, URL_KEYWORDS)
    } catch {
      return scoreByKeywords(url, URL_KEYWORDS)
    }
  }

  scanPageContent({ title, content }) {
    const titleScore = scoreByKeywords(title, TITLE_KEYWORDS)
    const bodyScore = scoreByKeywords(content, CONTENT_KEYWORDS)
    return Math.min(1, (titleScore * 0.6) + (bodyScore * 0.4))
  }

  checkKeywords({ title, content }) {
    // Additional pass; treat like a separate signal
    const combined = `${title || ''} ${content || ''}`
    return scoreByKeywords(combined, [...new Set([...TITLE_KEYWORDS, ...CONTENT_KEYWORDS])])
  }
}


