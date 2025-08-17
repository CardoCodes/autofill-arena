export type Job = {
  id: string
  title: string
  company: string
  location: string
}

export const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Software Engineer', company: 'TechCorp Inc.', location: 'New York, NY' },
  { id: '2', title: 'Product Manager', company: 'InnovateCo', location: 'San Francisco, CA' },
  { id: '3', title: 'Data Scientist', company: 'DataDriven LLC', location: 'Boston, MA' },
]

export type AiMode = 'cover-letter' | 'resume' | 'questions'

export const AI_MODES: { id: AiMode; label: string }[] = [
  { id: 'cover-letter', label: 'Cover Letter' },
  { id: 'resume', label: 'Resume' },
  { id: 'questions', label: 'Questions' },
]

export const aiModeButtonClasses = (selected: boolean) =>
  `px-3 py-1 rounded ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`


