import type { ValidationResult, ValidatorProxy } from "pova"

export interface ValidationTargetProps {
  validator: ValidatorProxy
  result?: ValidationResult | null
  trigger?: string | undefined
}
