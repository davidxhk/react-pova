import type { MockInstance } from "vitest"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getCallerName } from "../../src/utils/get-caller-name"

describe("function getCallerName", () => {
  let errorSpy: MockInstance

  beforeEach(() => {
    errorSpy = vi.spyOn(globalThis, "Error")
  })

  afterEach(() => {
    errorSpy?.mockRestore()
  })

  const error = new Error()
  function mockErrorStack(...lines: string[]) {
    error.stack = lines.join("\n") || undefined
    errorSpy?.mockImplementation(() => error)
  }

  it("returns the name of the caller at the given depth", () => {
    mockErrorStack(
      "Error",
      "    at getCallerName (path/to/file.js:10:15)",
      "    at callerFunction (path/to/file.js:20:5)",
      "    at anotherFunction (path/to/file.js:30:5)",
    )

    const callerName0 = getCallerName(0)
    expect(callerName0).toBe("callerFunction")

    const callerName1 = getCallerName(1)
    expect(callerName1).toBe("anotherFunction")
  })

  it("uses depth 0 by default", () => {
    mockErrorStack(
      "Error",
      "    at getCallerName (path/to/file.js:10:15)",
      "    at callerFunction (path/to/file.js:20:5)",
    )

    const callerName = getCallerName()
    expect(callerName).toBe("callerFunction")
  })

  it("returns undefined if depth is out of range", () => {
    mockErrorStack(
      "Error",
      "    at getCallerName (path/to/file.js:10:15)",
      "    at callerFunction (path/to/file.js:20:5)",
    )

    const callerName = getCallerName(1)
    expect(callerName).toBeUndefined()
  })

  it("returns undefined if depth is negative", () => {
    mockErrorStack(
      "Error",
      "    at getCallerName (path/to/file.js:10:15)",
      "    at callerFunction (path/to/file.js:20:5)",
    )

    const callerName = getCallerName(-1)
    expect(callerName).toBeUndefined()
  })

  it("returns undefined if the stack is empty", () => {
    mockErrorStack()

    const callerName = getCallerName(0)
    expect(callerName).toBeUndefined()
  })

  it("returns undefined if the stack has less than 3 lines", () => {
    mockErrorStack(
      "Error",
      "    at getCallerName (path/to/file.js:10:15)",
    )

    const callerName = getCallerName(0)
    expect(callerName).toBeUndefined()
  })

  it("returns undefined if the stack line does not match the regex", () => {
    mockErrorStack(
      "Error",
      "    at getCallerName (path/to/file.js:10:15)",
      "Some malformed stack line",
    )

    const callerName = getCallerName(0)
    expect(callerName).toBeUndefined()
  })

  it("handles stack lines with different spacing", () => {
    mockErrorStack(
      "Error",
      "at getCallerName (path/to/file.js:10:15)",
      "\tat callerFunction (path/to/file.js:20:5)",
      "   at anotherFunction (path/to/file.js:30:5)",
    )

    const callerName0 = getCallerName(0)
    expect(callerName0).toBe("callerFunction")

    const callerName1 = getCallerName(1)
    expect(callerName1).toBe("anotherFunction")
  })
})
