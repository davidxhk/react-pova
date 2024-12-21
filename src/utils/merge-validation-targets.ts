import type { ValidationTarget } from "../types"
import { mergeTargets } from "./merge-targets"

export function mergeValidationTargets(...targets: (Partial<ValidationTarget> | undefined)[]): Partial<ValidationTarget> {
  const result: Partial<ValidationTarget> = {}

  for (const target of targets) {
    if (!target) {
      continue
    }

    if (target.fixture) {
      result.fixture = target.fixture
    }

    if (target.state) {
      result.state = mergeTargets(result.state, target.state)
    }

    if (target.trigger) {
      result.trigger = mergeTargets(result.trigger, target.trigger)
    }
  }

  return result
}
