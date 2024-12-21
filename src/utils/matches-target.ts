export function matchesTarget(props: string | string[], target: string | null | undefined): boolean {
  if (!target) {
    return false
  }

  if (typeof props === "string") {
    props = props.split(",")
  }

  const included = new Set()
  const excluded = new Set()

  for (const item of props) {
    if (item.startsWith("!")) {
      excluded.add(item.slice(1))
    }
    else {
      included.add(item)
    }
  }

  return included.has(target) || (!excluded.has(target) && included.size === 0)
}
