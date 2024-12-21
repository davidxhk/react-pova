export function mergeTargets(...targets: (string | string[] | undefined)[]): string | string[] | undefined {
  let result: string | string[] | undefined

  for (const target of targets) {
    if (!target) {
      continue
    }

    if (!result) {
      result = target
      continue
    }

    if (typeof result === "string" && typeof target === "string") {
      result = [result, target].join(",")
      continue
    }

    if (Array.isArray(result) && typeof target === "string") {
      result = [...result, target]
      continue
    }

    if (typeof result === "string" && Array.isArray(target)) {
      result = [result, ...target]
      continue
    }

    if (Array.isArray(result) && Array.isArray(target)) {
      result = [...result, ...target]
      continue
    }
  }

  return result
}
