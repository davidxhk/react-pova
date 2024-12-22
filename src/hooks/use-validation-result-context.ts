import type { ValidationResult } from "pova"
import { use } from "react"
import { ValidationResultContext } from "../contexts"
import { getCallerName } from "../utils"

export function useValidationResultContext(): ValidationResult | null {
  const context = use(ValidationResultContext)
  if (context === undefined) {
    const callerName = getCallerName(1) || "useValidationResultContext"
    throw new Error(`${callerName} must be used in a ValidationResultContext`)
  }
  return context
}
