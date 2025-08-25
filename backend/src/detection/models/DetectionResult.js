export class DetectionResult {
  constructor({ formCount = 0, fieldCount = 0, detectionScore = 0, confidence = 0, formElements = [] } = {}) {
    this.formCount = formCount
    this.fieldCount = fieldCount
    this.detectionScore = clamp01(detectionScore)
    this.confidence = clamp01(confidence)
    this.formElements = formElements
  }

  isFormDetected() {
    return this.formCount > 0 || (this.fieldCount >= 2 && this.detectionScore >= 0.4)
  }

  getScore() {
    return this.detectionScore
  }

  getDetails() {
    return {
      formCount: this.formCount,
      fieldCount: this.fieldCount,
      detectionScore: this.detectionScore,
      confidence: this.confidence,
      formElements: this.formElements
    }
  }
}

function clamp01(n) {
  const x = Number.isFinite(n) ? n : 0
  return Math.max(0, Math.min(1, x))
}


