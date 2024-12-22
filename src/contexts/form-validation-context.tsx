import type { FormValidation } from "../types"
import { createContext } from "react"

export const FormValidationContext = createContext<FormValidation | undefined>(undefined)
