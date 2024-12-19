export function getCallerName(depth: number = 0): string | undefined {
  const [_error, _at_getCallerName, ...lines] = new Error().stack?.split(/\r?\n/) || []
  return lines[depth]?.trim().match(/^at (\S+)/)?.[1]
}
