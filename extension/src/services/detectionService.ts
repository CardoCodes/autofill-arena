import { apiJson } from './localApi'

export interface DetectFieldFeature {
  selector: string
  type?: string
  name?: string
  id?: string
  placeholder?: string
  aria_label?: string
  label?: string
  data_attrs?: Record<string, string>
}

export interface DetectFormsPayload {
  url: string
  title?: string
  content?: string
  fields: DetectFieldFeature[]
}

export interface DetectFormsResponse {
  ok: boolean
  detected: boolean
  score: number
  confidence: number
  details: {
    formCount: number
    fieldCount: number
    detectionScore: number
    confidence: number
    formElements: Array<DetectFieldFeature>
  }
}

export async function detectForms(payload: DetectFormsPayload): Promise<DetectFormsResponse> {
  return apiJson<DetectFormsResponse>('/detect/forms', 'POST', payload)
}


