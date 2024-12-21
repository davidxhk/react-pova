import type { ValidationResult, Validator } from "pova"

export interface FormValidation {
  createValidator: (name: PropertyKey) => Validator
  findValidator: (name: PropertyKey) => Validator | undefined
  getValidator: (name: PropertyKey) => Validator
  getOrCreateValidator: (name: PropertyKey) => Validator
  removeValidator: (name: PropertyKey) => boolean
  validateAll: (trigger: string) => Promise<(ValidationResult | null)[]>
  results: (ValidationResult | null)[]
}
