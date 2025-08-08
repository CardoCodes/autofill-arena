import { webcrypto as nodeCrypto } from 'crypto'

const PASSWORD_SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/'

function generatePassword(length = 20) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + PASSWORD_SYMBOLS
  const bytes = new Uint8Array(length)
  const rng = (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto : nodeCrypto
  rng.getRandomValues(bytes)
  let pass = ''
  for (let i = 0; i < length; i++) pass += charset[bytes[i] % charset.length]
  return pass
}

function textScore(text = '', regex) {
  if (!text) return 0
  try {
    const re = new RegExp(regex, 'i')
    return re.test(text) ? 1 : 0
  } catch {
    return 0
  }
}

function matchField(field, matcher) {
  let score = 0
  if (matcher.type && field.type && matcher.type === field.type) score += 0.2
  if (matcher.label_regex) score += textScore(field.label, matcher.label_regex)
  if (matcher.name_regex) score += textScore(field.name, matcher.name_regex)
  if (matcher.placeholder_regex) score += textScore(field.placeholder, matcher.placeholder_regex)
  if (matcher.id_regex) score += textScore(field.id, matcher.id_regex)
  return score
}

function resolveValue(valueSource, context) {
  switch (valueSource.type) {
    case 'profile':
      return context.profile?.[valueSource.key]
    case 'answer':
      return context.answers?.[valueSource.key]
    case 'constant':
      return valueSource.value
    case 'function':
      if (valueSource.name === 'generate_password') return generatePassword(valueSource.params?.length || 20)
      return undefined
    default:
      return undefined
  }
}

export function createFillPlan(payload, context) {
  const steps = []
  const unknown_fields = []
  const domain = new URL(payload.url).hostname

  // Aggregate matchers from rules
  const matchers = []
  for (const rule of context.rules || []) {
    for (const fm of rule.field_matchers || []) {
      matchers.push({ ...fm, priority: rule.priority || 100 })
    }
  }

  // Generic defaults
  const generic = [
    { field_key: 'first_name', match: { label_regex: 'first\\s*name', name_regex: '^first(Name)?$', type: 'text' }, value_source: { type: 'profile', key: 'first_name' } },
    { field_key: 'last_name', match: { label_regex: 'last\\s*name|surname', name_regex: '^last(Name)?$', type: 'text' }, value_source: { type: 'profile', key: 'last_name' } },
    { field_key: 'full_name', match: { label_regex: 'full\\s*name', type: 'text' }, value_source: { type: 'profile', key: 'full_name' } },
    { field_key: 'email', match: { label_regex: 'email', type: 'email' }, value_source: { type: 'profile', key: 'email' } },
    { field_key: 'phone', match: { label_regex: 'phone|mobile|telephone', type: 'tel' }, value_source: { type: 'profile', key: 'phone' } },
    { field_key: 'password', match: { label_regex: 'password', type: 'password' }, value_source: { type: 'function', name: 'generate_password', params: { length: 20 } } },
    { field_key: 'confirm_password', match: { label_regex: 'confirm|re[-\s]?enter|verify', type: 'password' }, value_source: { type: 'answer', key: '__SAME_PASSWORD__' } },
    { field_key: 'resume', match: { label_regex: 'resume|cv', type: 'file' }, value_source: { type: 'answer', key: 'resume_filename' } },
    { field_key: 'cover_letter', match: { label_regex: 'cover\\s*letter', type: 'file' }, value_source: { type: 'answer', key: 'cover_letter_filename' } },
  ]
  for (const g of generic) matchers.push({ ...g, priority: 10 })

  const learned = (context.db?.listLearnedMappings ? context.db.listLearnedMappings(domain) : [])
  for (const field of payload.fields) {
    const learnedHit = learned.find(m => m.selector === field.selector)
    if (learnedHit) {
      const value = resolveValue({ type: 'profile', key: learnedHit.field_key }, context) || resolveValue({ type: 'answer', key: learnedHit.field_key }, context)
      if (value !== undefined) {
        const action = field.type === 'file' ? 'setFile' : 'setValue'
        steps.push({ selector: field.selector, action, value })
        continue
      }
    }
    let best = { score: 0, m: null }
    for (const m of matchers) {
      const score = matchField(field, m.match) * (1 + (m.priority / 1000))
      if (score > best.score) best = { score, m }
    }
    if (best.score >= 0.7 && best.m) {
      let value = resolveValue(best.m.value_source, context)
      if (best.m.field_key === 'password' && typeof value === 'string') {
        context.__generated_password = value
      }
      if (best.m.field_key === 'confirm_password' && context.__generated_password) {
        value = context.__generated_password
      }
      if ((value === undefined || value === null || value === '') && field.type === 'file') {
        if (best.m.field_key === 'resume') value = 'resume.pdf'
        if (best.m.field_key === 'cover_letter') value = 'cover_letter.pdf'
      }
      if (value !== undefined) {
        const action = field.type === 'file' ? 'setFile' : 'setValue'
        const step = { selector: field.selector, action, value }
        steps.push(step)
        continue
      }
    }
    unknown_fields.push({ selector: field.selector, reason: 'low_confidence_or_no_value' })
  }

  return { form_id: 'auto-1', steps, unknown_fields, domain }
}


