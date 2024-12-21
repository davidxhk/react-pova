import type { ValidationPlugin, ValidationResult } from "pova"
import type { PluginFactory, PluginFactoryProps, ValidationTarget } from "../types"
import { matchesValidationTarget } from "./matches-validation-target"

export function createPlugin<P>(factory: PluginFactory<P>, props: PluginFactoryProps & P): ValidationPlugin {
  const callback = factory(props)

  const { fixture, message, payload, result, state, trigger } = props
  const target: ValidationTarget = { fixture, state, trigger }
  const fallback: ValidationResult = { message, payload, state: result }

  return async ({ controller, ...props }) => {
    if (!matchesValidationTarget(props, target)) {
      return
    }

    let result = await callback({ controller, ...props })

    if (!result) {
      return
    }

    if (typeof result === "boolean") {
      result = fallback
    }

    if (result?.state === "aborted") {
      controller.abort(result.message)
    }

    return result
  }
}
