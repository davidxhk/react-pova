import type { FormValidation } from "../types"
import { use } from "react"
import { FormValidationContext } from "../contexts"
import { getCallerName } from "../utils"

export function useFormValidationContext(): FormValidation {
  const context = use(FormValidationContext)
  if (context === undefined) {
    const callerName = getCallerName(1) || "useFormValidationContext"
    throw new Error(`${callerName} must be used in a FormValidationContext`)
  }
  return context
}
