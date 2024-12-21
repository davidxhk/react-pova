import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { FormValidationProvider } from "../src/form-validation-provider"
import { ValidationFixture } from "../src/validation-fixture"

describe("function ValidationFixture", () => {
  it("adds its child element to the FormValidationContext's fixtures by their name on mount", () => {
    const fixtures: { [key: PropertyKey]: any } = {}

    render((
      <FormValidationProvider fixtures={fixtures}>
        <ValidationFixture>
          <input name="test" />
        </ValidationFixture>
      </FormValidationProvider>
    ))

    expect(fixtures.test).toEqual(expect.any(HTMLInputElement))
  })

  it("uses a given name if one is provided", () => {
    const fixtures: { [key: PropertyKey]: any } = {}

    render((
      <FormValidationProvider fixtures={fixtures}>
        <ValidationFixture name="test">
          <input name="notme" />
        </ValidationFixture>
      </FormValidationProvider>
    ))

    expect(fixtures.test).toEqual(expect.any(HTMLInputElement))
    expect(fixtures.notme).toBeUndefined()
  })

  it("supports child components that pass their ref prop", () => {
    const fixtures: { [key: PropertyKey]: any } = {}
    const Input = ({ ref }: { ref?: React.Ref<HTMLInputElement> }) => <input ref={ref} />

    render((
      <FormValidationProvider fixtures={fixtures}>
        <ValidationFixture name="test">
          <Input />
        </ValidationFixture>
      </FormValidationProvider>
    ))

    expect(fixtures.test).toEqual(expect.any(HTMLInputElement))
  })

  it("allows direct access to the child element's attributes", async () => {
    const fixtures: { [key: PropertyKey]: any } = {}
    const user = userEvent.setup()
    const value = "testing"

    render((
      <FormValidationProvider fixtures={fixtures}>
        <ValidationFixture name="test">
          <input />
        </ValidationFixture>
      </FormValidationProvider>
    ))

    const input = screen.getByRole("textbox")
    await user.type(input, value)

    expect(fixtures.test.value).toBe(value)
  })

  it("removes its child element from the FormValidationContext's fixtures on unmount", () => {
    const fixtures: { [key: PropertyKey]: any } = {}

    const { unmount } = render((
      <FormValidationProvider fixtures={fixtures}>
        <ValidationFixture>
          <input name="test" />
        </ValidationFixture>
      </FormValidationProvider>
    ))

    unmount()

    expect(fixtures.test).toBeUndefined()
  })

  it("throws an error when used outside of a FormValidationContext", () => {
    expect(() => {
      render((
        <ValidationFixture name="test">
          <input />
        </ValidationFixture>
      ))
    }).toThrow()
  })

  it("throws an error if there are multiple children", () => {
    expect(() => {
      render((
        <FormValidationProvider>
          {/* @ts-expect-error children should be a single element */}
          <ValidationFixture name="test">
            <input />
            <input />
          </ValidationFixture>
        </FormValidationProvider>
      ))
    }).toThrow()
  })

  it("throws an error if no name is provided", () => {
    expect(() => {
      render((
        <FormValidationProvider>
          <ValidationFixture>
            <input />
          </ValidationFixture>
        </FormValidationProvider>
      ))
    }).toThrow()
  })
})
