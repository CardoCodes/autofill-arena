// Identifies candidate form elements from provided field features
export class FormElementDetector {
  findFormElements({ fields = [] }) {
    if (!Array.isArray(fields)) return []
    const elements = fields
      .filter(f => typeof f?.selector === 'string' && f.selector.length > 0)
      .map(f => ({
        selector: f.selector,
        type: f.type || 'text',
        name: f.name,
        id: f.id,
        placeholder: f.placeholder,
        label: f.label,
        aria_label: f.aria_label,
        data_attrs: f.data_attrs || {}
      }))
    return elements
  }

  validateFormElements(elements) {
    if (!Array.isArray(elements)) return false
    const hasEnough = elements.length >= 1
    const hasIdentified = elements.some(e => (e.name || e.id || e.label))
    return hasEnough && hasIdentified
  }
}


