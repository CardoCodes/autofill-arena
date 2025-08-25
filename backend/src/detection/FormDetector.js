// High-level orchestrator that coordinates individual detectors and produces a DetectionResult
import { FormElementDetector } from './detectors/FormElementDetector.js'
import { FieldMassDetector } from './detectors/FieldMassDetector.js'
import { HeuristicDetector } from './detectors/HeuristicDetector.js'
import { DynamicContentObserver } from './observers/DynamicContentObserver.js'
import { DetectionResult } from './models/DetectionResult.js'

export class FormDetector {
  constructor(options = {}) {
    const {
      observationConfig,
      detectionStrategies
    } = options

    this.observationConfig = observationConfig || { enabled: false }
    this.detectionStrategies = detectionStrategies || {}

    this.formElementDetector = new FormElementDetector()
    this.fieldMassDetector = new FieldMassDetector()
    this.heuristicDetector = new HeuristicDetector()
    this.mutationObserver = new DynamicContentObserver(this.observationConfig)
  }

  async analyzePage(payload) {
    const { url, title, content, fields } = payload

    const formElements = this.formElementDetector.findFormElements({ fields })
    const formElementsAreValid = this.formElementDetector.validateFormElements(formElements)

    const fieldMassStats = this.fieldMassDetector.countFillableFields({ fields })
    const fieldTypeAnalysis = this.fieldMassDetector.analyzeFieldTypes({ fields })
    const passesThreshold = this.fieldMassDetector.checkThreshold(fieldMassStats)

    const urlScore = this.heuristicDetector.analyzeUrl(url)
    const pageScore = this.heuristicDetector.scanPageContent({ title, content })
    const keywordScore = this.heuristicDetector.checkKeywords({ title, content })

    const result = new DetectionResult({
      formCount: formElements.length,
      fieldCount: fieldMassStats.totalFields,
      detectionScore: urlScore * 0.3 + pageScore * 0.4 + keywordScore * 0.3,
      confidence: Math.min(1,
        (formElementsAreValid ? 0.3 : 0) +
        (passesThreshold ? 0.4 : 0) +
        ((urlScore + pageScore + keywordScore) / 3) * 0.3
      ),
      formElements
    })

    return result
  }

  async detectForms(payload) {
    return this.analyzePage(payload)
  }

  startObservation(callback) {
    this.mutationObserver.startWatching(callback)
  }

  stopObservation() {
    this.mutationObserver.stopWatching()
  }
}


