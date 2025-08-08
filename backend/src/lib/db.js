import DatabaseDriver from 'better-sqlite3'
import { nanoid } from 'nanoid'

export class Database {
  constructor(filename) {
    this.db = new DatabaseDriver(filename)
    this.migrate()
  }

  migrate() {
    this.db.prepare(`CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    )`).run()

    this.db.prepare(`CREATE TABLE IF NOT EXISTS answers (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`).run()

    this.db.prepare(`CREATE TABLE IF NOT EXISTS rules (
      id TEXT PRIMARY KEY,
      site_pattern TEXT NOT NULL,
      priority INTEGER NOT NULL,
      json TEXT NOT NULL
    )`).run()

    this.db.prepare(`CREATE TABLE IF NOT EXISTS learned_mappings (
      id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      selector TEXT NOT NULL,
      field_key TEXT NOT NULL,
      type TEXT
    )`).run()

    this.db.prepare(`CREATE TABLE IF NOT EXISTS credentials (
      id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      username TEXT,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`).run()
  }

  getProfile() {
    const row = this.db.prepare('SELECT data FROM profile WHERE id = 1').get()
    return row ? JSON.parse(row.data) : {}
  }

  upsertProfile(profile) {
    const existing = this.getProfile()
    const merged = { ...existing, ...profile }
    const json = JSON.stringify(merged)
    const upsert = this.db.prepare(`INSERT INTO profile (id, data) VALUES (1, @json)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data`)
    upsert.run({ json })
  }

  listAnswers() {
    const rows = this.db.prepare('SELECT key, value FROM answers').all()
    const result = {}
    for (const r of rows) result[r.key] = r.value
    return result
  }

  upsertAnswers(answers) {
    const stmt = this.db.prepare(`INSERT INTO answers (key, value) VALUES (@key, @value)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    const tx = this.db.transaction((entries) => {
      for (const [key, value] of entries) stmt.run({ key, value })
    })
    tx(Object.entries(answers))
  }

  listRules() {
    const rows = this.db.prepare('SELECT json FROM rules ORDER BY priority DESC').all()
    return rows.map(r => JSON.parse(r.json))
  }

  listRulesByDomain(domain) {
    const rows = this.db.prepare('SELECT json FROM rules WHERE site_pattern = @domain OR site_pattern = "*" ORDER BY priority DESC').all({ domain })
    return rows.map(r => JSON.parse(r.json))
  }

  insertRule(rule) {
    const id = nanoid()
    const withId = { id, ...rule }
    const json = JSON.stringify(withId)
    this.db.prepare('INSERT INTO rules (id, site_pattern, priority, json) VALUES (@id, @site_pattern, @priority, @json)')
      .run({ id, site_pattern: rule.site_pattern, priority: rule.priority ?? 100, json })
    return withId
  }

  insertLearnedMapping(domain, mapping) {
    this.db.prepare('INSERT INTO learned_mappings (id, domain, selector, field_key, type) VALUES (@id, @domain, @selector, @field_key, @type)')
      .run({ id: nanoid(), domain, selector: mapping.selector, field_key: mapping.field_key, type: mapping.type ?? null })
  }

  listLearnedMappings(domain) {
    return this.db.prepare('SELECT selector, field_key, type FROM learned_mappings WHERE domain = @domain')
      .all({ domain })
  }

  insertCredential({ domain, username, password }) {
    const id = nanoid()
    const created_at = new Date().toISOString()
    this.db.prepare('INSERT INTO credentials (id, domain, username, password, created_at) VALUES (@id, @domain, @username, @password, @created_at)')
      .run({ id, domain, username: username || null, password, created_at })
    return { id, domain, username, created_at }
  }

  listCredentialsByDomain(domain) {
    return this.db.prepare('SELECT id, domain, username, created_at FROM credentials WHERE domain = @domain ORDER BY created_at DESC')
      .all({ domain })
  }
}


