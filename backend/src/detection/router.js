import express from 'express'
import { z } from 'zod'
import { FormDetector } from './FormDetector.js'

const router = express.Router()

const detectSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  content: z.string().optional(),
  fields: z.array(z.object({
    selector: z.string(),
    type: z.string().optional(),
    name: z.string().optional(),
    id: z.string().optional(),
    placeholder: z.string().optional(),
    aria_label: z.string().optional(),
    label: z.string().optional(),
    data_attrs: z.record(z.string()).optional()
  })).default([])
})

router.post('/forms', async (req, res) => {
  try {
    const payload = detectSchema.parse(req.body)
    const detector = new FormDetector({ observationConfig: { enabled: false } })
    const result = await detector.detectForms(payload)
    return res.json({
      ok: true,
      detected: result.isFormDetected(),
      score: result.getScore(),
      confidence: result.confidence,
      details: result.getDetails()
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: 'invalid_payload', issues: err.issues })
    }
    // eslint-disable-next-line no-console
    console.error('[detect/forms] error', err)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

export default router


