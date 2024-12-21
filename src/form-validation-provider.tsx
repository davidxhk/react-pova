import type { ValidationResult } from "pova"
import type { FormValidation } from "./types"
import { Validator } from "pova"
import { useCallback, useMemo, useRef, useState } from "react"
import { FormValidationContext } from "./contexts"
import { $root } from "./symbols"

export function FormValidationProvider({ children, fixtures: initialFixtures }: { children: React.ReactNode, fixtures?: { [key: PropertyKey]: any } }): React.JSX.Element {
  const fixtures = useRef<{ [key: PropertyKey]: any }>(initialFixtures || {})
  const validators = useRef<{ [key: PropertyKey]: Validator }>({ [$root]: new Validator(fixtures.current) })
  const [results, setResults] = useState<{ [key: PropertyKey]: ValidationResult | null }>({})

  const createValidator = useCallback((name: PropertyKey) => {
    if (validators.current[name]) {
      throw new Error(`Validator '${name.toString()}' already exists`)
    }
    setResults(results => ({ ...results, [name]: null }))
    const validator = new Validator(fixtures.current)
    validators.current[name] = validator
    validator.addEventListener("validation", (event) => {
      setResults(results => ({ ...results, [name]: event.detail }))
    })
    return validator
  }, [])

  const context: Omit<FormValidation, "results"> = useMemo(
    () => ({
      createValidator,
      findValidator: name => validators.current[name],
      getValidator: (name) => {
        if (!validators.current[name]) {
          throw new Error(`Validator '${name.toString()}' does not exist`)
        }
        return validators.current[name]
      },
      getOrCreateValidator: name => validators.current[name] || createValidator(name),
      removeValidator: (name) => {
        setResults(({ [name]: _, ...results }) => results)
        return delete validators.current[name]
      },
      validateAll: (trigger) => {
        const promises = Object.values(validators.current).map(validator => validator.validate(trigger))
        return Promise.all(promises)
      },
    }),
    [createValidator],
  )

  const resultsList = useMemo(() => Object.values(results), [results])

  return <FormValidationContext value={{ ...context, results: resultsList }}>{children}</FormValidationContext>
}
