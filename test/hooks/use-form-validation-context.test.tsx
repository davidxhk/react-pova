import type { FormValidation } from "../../src/types"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { FormValidationContext } from "../../src/contexts"
import { useFormValidationContext } from "../../src/hooks"

describe("function useFormValidationContext", () => {
  let context: FormValidation

  function TestConsumer() {
    context = useFormValidationContext()
    return null
  }

  it("returns the validation result when used within a FormValidationContext", () => {
    const value = {} as unknown as FormValidation

    render((
      <FormValidationContext value={value}>
        <TestConsumer />
      </FormValidationContext>
    ))

    expect(context).toEqual(value)
  })

  it("throws an error when used outside of a FormValidationContext", () => {
    expect(() => render(<TestConsumer />)).toThrow("TestConsumer must be used in a FormValidationContext")
  })
})
