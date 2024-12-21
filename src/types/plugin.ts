import type { PluginProps, ValidationResult } from "pova"
import type { Promisable } from "./promisable"

export type Plugin = (props: PluginProps) => Promisable<ValidationResult | boolean | void>
