import { Children, cloneElement, useEffect, useRef } from "react"
import { useFormValidationContext } from "./hooks"
import { $root } from "./symbols"
import { composeRefs } from "./utils"

export function ValidationFixture<T extends React.RefAttributes<any>>({ children, name }: { children: React.ReactElement<T>, name?: string }): React.ReactElement<T> {
  const element = Children.only(children)
  const ref = useRef<any>(null)
  const { getValidator } = useFormValidationContext()

  useEffect(() => {
    const fixture = ref.current
    if (!fixture) {
      return
    }
    const validator = getValidator($root)
    validator.addFixture(fixture, name)
    return () => {
      validator.removeFixture(fixture)
    }
  }, [getValidator, name])

  return cloneElement(element, {
    ...element.props,
    ref: composeRefs(ref, element.props.ref),
  })
}
