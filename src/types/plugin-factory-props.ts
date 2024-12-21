import type { JSONValue } from "./json-value"

export interface PluginFactoryProps {
  fixture: string
  state?: string | string[]
  trigger?: string | string[]
  result: string
  message?: string
  payload?: JSONValue
}
