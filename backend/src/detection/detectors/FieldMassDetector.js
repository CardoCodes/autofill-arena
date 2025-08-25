// Computes counts and thresholds for fillable fields
const FILLABLE_TYPES = new Set(['text', 'email', 'tel', 'password', 'url', 'search', 'number'])

export class FieldMassDetector {
  constructor(options = {}) {
    const { minimumThreshold } = options
    this.minimumThreshold = typeof minimumThreshold === 'number' ? minimumThreshold : 2
  }

  countFillableFields({ fields = [] }) {
    let totalFields = 0
    let fillableFields = 0
    const typeCounts = {}

    for (const f of Array.isArray(fields) ? fields : []) {
      totalFields += 1
      const t = (f?.type || 'text').toLowerCase()
      typeCounts[t] = (typeCounts[t] || 0) + 1
      if (FILLABLE_TYPES.has(t)) {
        fillableFields += 1
      }
    }

    return { totalFields, fillableFields, typeCounts }
  }

  analyzeFieldTypes({ fields = [] }) {
    const { typeCounts } = this.countFillableFields({ fields })
    const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return { typeCounts, dominantType }
  }

  checkThreshold(stats) {
    return (stats?.fillableFields || 0) >= this.minimumThreshold
  }
}


