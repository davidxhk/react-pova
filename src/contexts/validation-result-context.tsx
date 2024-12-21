import type { ValidationResult } from "pova"
import { createContext } from "react"

export const ValidationResultContext = createContext<ValidationResult | null | undefined>(undefined)
