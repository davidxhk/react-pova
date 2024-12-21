import type { ValidationTarget, ValidationTargetProps } from "../types"
import { matchesTarget } from "./matches-target"
import { mergeValidationTargets } from "./merge-validation-targets"

export function matchesValidationTarget(props: ValidationTargetProps, ...targets: (Partial<ValidationTarget> | undefined)[]): boolean {
  const { validator, result = validator.result, trigger } = props

  const target = mergeValidationTargets(...targets)

  if (target.fixture && !validator.hasFixture(target.fixture)) {
    return false
  }

  if (target.trigger && !matchesTarget(target.trigger, trigger)) {
    return false
  }

  if (target.state && !matchesTarget(target.state, result?.state)) {
    return false
  }

  if (!target.state && result?.state) {
    return false
  }

  return true
}
