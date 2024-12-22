import type { ValidationResult } from "pova"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ValidationResultContext } from "../../src/contexts"
import { useValidationResultContext } from "../../src/hooks"

describe("function useValidationResultContext", () => {
  let context: ValidationResult | null

  function TestConsumer() {
    context = useValidationResultContext()
    return null
  }

  it("returns the validation result when used within a ValidationResultContext", () => {
    const value: ValidationResult = { state: "valid" }

    render((
      <ValidationResultContext value={value}>
        <TestConsumer />
      </ValidationResultContext>
    ))

    expect(context).toEqual(value)
  })

  it("returns null when used within a ValidationResultContext with no result", () => {
    render((
      <ValidationResultContext value={null}>
        <TestConsumer />
      </ValidationResultContext>
    ))

    expect(context).toEqual(null)
  })

  it("throws an error when used outside of a ValidationResultContext", () => {
    expect(() => render(<TestConsumer />)).toThrow("TestConsumer must be used in a ValidationResultContext")
  })
})
