import { Database } from './lib/db.js'

const db = new Database('autofill-arena.db')

db.upsertProfile({
  full_name: 'Ada Lovelace',
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.com',
  phone: '+1 555 123 4567',
  linkedin: 'https://www.linkedin.com/in/ada',
  github: 'https://github.com/ada'
})

db.upsertAnswers({
  work_authorization: 'Authorized to work in the US',
  relocation: 'Open to relocation',
  sponsorship: 'Do not require sponsorship'
})

console.log('Initialized local DB with sample profile and answers')


