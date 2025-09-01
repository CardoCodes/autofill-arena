import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import { Database } from './lib/db.js'
import { createFillPlan } from './lib/planner.js'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json({ limit: '2mb' }))

const dbPath = process.env.DB_PATH || 'autofill-arena.db'
const db = new Database(dbPath)

// Health
app.get('/health', (_req, res) => {
  const dbOk = db.ping()
  res.json({ ok: true, db: dbOk ? 'up' : 'down' })
})

// Profile CRUD (local-only)
app.get('/profile', (_req, res) => {
  const profile = db.getProfile()
  res.json({ profile })
})

app.put('/profile', (req, res, next) => {
  const schema = z.object({
    profile: z.object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      full_name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      website: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional()
    })
  })
  try {
    const { profile } = schema.parse(req.body)
    db.upsertProfile(profile)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Answers CRUD
app.get('/answers', (_req, res) => {
  const answers = db.listAnswers()
  res.json({ answers })
})

app.put('/answers', (req, res, next) => {
  const schema = z.object({
    answers: z.record(z.string(), z.string())
  })
  try {
    const { answers } = schema.parse(req.body)
    db.upsertAnswers(answers)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Rules CRUD
app.get('/rules', (req, res) => {
  const domain = (req.query.domain || '').toString()
  const rules = domain ? db.listRulesByDomain(domain) : db.listRules()
  res.json({ rules })
})

app.post('/rules', (req, res, next) => {
  const schema = z.object({
    rule: z.object({
      site_pattern: z.string(),
      priority: z.number().int().default(100),
      field_matchers: z.array(z.object({
        field_key: z.string(),
        match: z.object({
          label_regex: z.string().optional(),
          name_regex: z.string().optional(),
          placeholder_regex: z.string().optional(),
          id_regex: z.string().optional(),
          type: z.string().optional()
        }),
        value_source: z.union([
          z.object({ type: z.literal('profile'), key: z.string() }),
          z.object({ type: z.literal('answer'), key: z.string() }),
          z.object({ type: z.literal('function'), name: z.string(), params: z.record(z.any()).optional() }),
          z.object({ type: z.literal('constant'), value: z.string() })
        ])
      }))
    })
  })
  try {
    const { rule } = schema.parse(req.body)
    const saved = db.insertRule(rule)
    res.json({ rule: saved })
  } catch (err) {
    next(err)
  }
})

// Fill plan from features
app.post('/fill/plan', (req, res, next) => {
  const schema = z.object({
    url: z.string().url(),
    fields: z.array(z.object({
      selector: z.string(),
      type: z.string().optional(),
      name: z.string().optional(),
      id: z.string().optional(),
      placeholder: z.string().optional(),
      aria_label: z.string().optional(),
      label: z.string().optional(),
      data_attrs: z.record(z.string()).optional()
    }))
  })
  try {
    const payload = schema.parse(req.body)
    const profile = db.getProfile()
    const answers = db.listAnswers()
    const domain = new URL(payload.url).hostname
    const rules = [
      ...db.listRulesByDomain(domain),
      ...db.listRulesByDomain('*')
    ]
    const plan = createFillPlan(payload, { profile, answers, rules, db })
    res.json(plan)
  } catch (err) {
    next(err)
  }
})

// Learn a new mapping
app.post('/learn', (req, res, next) => {
  const schema = z.object({
    domain: z.string(),
    mapping: z.object({ selector: z.string(), field_key: z.string(), type: z.string().optional() })
  })
  try {
    const { domain, mapping } = schema.parse(req.body)
    db.insertLearnedMapping(domain, mapping)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Credentials save and list
app.post('/credentials', (req, res, next) => {
  const schema = z.object({ domain: z.string(), username: z.string().optional(), password: z.string().min(8) })
  try {
    const { domain, username, password } = schema.parse(req.body)
    const saved = db.insertCredential({ domain, username, password })
    res.json({ credential: saved })
  } catch (err) {
    next(err)
  }
})

app.get('/credentials', (req, res) => {
  const domain = (req.query.domain || '').toString()
  if (!domain) return res.status(400).json({ error: 'domain required' })
  const creds = db.listCredentialsByDomain(domain)
  res.json({ credentials: creds })
})

const port = process.env.PORT || 5123
app.listen(port, () => {
  console.log(`[autofill-backend] listening on http://localhost:${port}`)
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'validation_error', issues: err.issues })
  }
  return res.status(500).json({ error: 'internal_error' })
})


