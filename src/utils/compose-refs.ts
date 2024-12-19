export function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      }
      else if (typeof ref === "object" && ref) {
        ref.current = node
      }
    }
  }
}
