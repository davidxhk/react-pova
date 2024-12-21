import type { ValidationResult } from "pova"
import type { MockInstance } from "vitest"
import type { FormValidation } from "../src/types"
import { act, render } from "@testing-library/react"
import { Validator } from "pova"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FormValidationProvider } from "../src/form-validation-provider"
import { useFormValidationContext } from "../src/hooks"
import { $root } from "../src/symbols"

describe("function FormValidationProvider", () => {
  let context: FormValidation
  let fixtures: { [key: PropertyKey]: any }

  function TestConsumer() {
    context = useFormValidationContext()
    return null
  }

  beforeEach(() => {
    fixtures = { test: 1 }
    render((
      <FormValidationProvider fixtures={fixtures}>
        <TestConsumer />
      </FormValidationProvider>
    ))
  })

  it("initializes with a root validator", () => {
    const validator = context.getValidator($root)
    expect(validator).toBeInstanceOf(Validator)
  })

  it("initializes with a given fixtures object if one is provided", () => {
    const validator = context.getValidator($root)
    expect(validator.getFixture("test")).toBe(1)
  })

  it("provides a form validation context", () => {
    expect(context).toEqual({
      createValidator: expect.any(Function),
      findValidator: expect.any(Function),
      getValidator: expect.any(Function),
      getOrCreateValidator: expect.any(Function),
      removeValidator: expect.any(Function),
      validateAll: expect.any(Function),
      results: expect.any(Array),
    })
  })

  describe("its createValidator method", () => {
    it("creates a new validator with the provided name", async () => {
      const validator = await act(() => context.createValidator("test"))

      expect(validator).toBe(context.getValidator("test"))
    })

    it("initializes the validator with its fixtures object", async () => {
      const validator = await act(() => context.createValidator("test"))

      expect(validator.getFixture("test")).toBe(1)
    })

    it("initializes a null result for the validator", async () => {
      await act(() => context.createValidator("test"))

      expect(context.results).toEqual([null])
    })

    it("registers a validation listener on the validator", async () => {
      const mock = vi.spyOn(Validator.prototype, "addEventListener")

      await act(() => context.createValidator("test"))

      expect(mock).toHaveBeenCalledOnce()
      expect(mock).toHaveBeenLastCalledWith("validation", expect.any(Function))
    })

    it("supports using a number as a name", async () => {
      const validator = await act(() => context.createValidator(1))

      expect(validator).toBe(context.getValidator(1))
    })

    it("supports using a symbol as a name", async () => {
      const sym = Symbol("test")

      const validator = await act(() => context.createValidator(sym))

      expect(validator).toBe(context.getValidator(sym))
    })

    it("throws an error if a validator with the same name already exists", async () => {
      expect(() => act(() => context.createValidator($root))).toThrow()
    })
  })

  describe("its findValidator method", () => {
    it("finds a validator by name", async () => {
      const validator = await act(() => context.createValidator("test"))

      expect(context.findValidator("test")).toBe(validator)
    })

    it("returns undefined if a validator is not found", () => {
      expect(context.findValidator("unknown")).toBeUndefined()
    })
  })

  describe("its getValidator method", () => {
    it("gets a validator by name", async () => {
      const validator = await act(() => context.createValidator("test"))

      expect(context.getValidator("test")).toBe(validator)
    })

    it("throws an error if a validator is not found", () => {
      expect(() => context.getValidator("unknown")).toThrow()
    })
  })

  describe("its getOrCreateValidator method", () => {
    it("creates a new validator with the provided name if it does not exist", async () => {
      const validator = await act(() => context.getOrCreateValidator("test"))

      expect(validator).toBe(context.getValidator("test"))
    })

    it("gets a validator by name if it exists", async () => {
      const validator = await act(() => context.createValidator("test"))

      const result = await act(() => context.getOrCreateValidator("test"))

      expect(result).toBe(validator)
    })
  })

  describe("its removeValidator method", () => {
    it("removes a validator by name", async () => {
      await act(() => context.createValidator("test"))

      await act(() => context.removeValidator("test"))

      expect(context.findValidator("test")).toBeUndefined()
    })

    it("removes the validator's result from its results", async () => {
      await act(() => context.createValidator("test"))

      await act(() => context.removeValidator("test"))

      expect(context.results).toEqual([])
    })
  })

  const testNames = ["username", "email", "password"]
  const testResults: [string, ValidationResult | null][] = [
    ["username", { state: "valid" }],
    ["email", { state: "invalid" }],
    ["password", null],
    ["email", { state: "valid" }],
    ["username", null],
  ]

  describe("its validateAll method", () => {
    it("calls the validate method on all its validators with the given trigger", async () => {
      const mocks: MockInstance[] = []
      for (const name of testNames) {
        const validator = await act(() => context.createValidator(name))
        mocks.push(vi.spyOn(validator, "validate"))
      }
      const trigger = "test"

      await act(() => context.validateAll(trigger))

      mocks.forEach(mock => expect(mock).toHaveBeenCalledOnce())
      mocks.forEach(mock => expect(mock).toHaveBeenLastCalledWith(trigger))
    })
  })

  describe("its results property", () => {
    it("captures the validation results of all its validators", async () => {
      const validators: { [key: PropertyKey]: Validator } = {}
      const results: { [key: PropertyKey]: ValidationResult | null } = {}

      for (const name of testNames) {
        validators[name] = await act(() => context.createValidator(name))
        results[name] = null
        expect(context.results).toEqual(Object.values(results))
      }

      for (const [name, result] of testResults) {
        act(() => validators[name]!.dispatchResult(result))
        results[name] = result
        expect(context.results).toEqual(Object.values(results))
      }
    })
  })
})
