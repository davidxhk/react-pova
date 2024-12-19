import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React, { useRef, useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { composeRefs } from "../../src/utils/compose-refs"

describe("function composeRefs", () => {
  it("returns a ref callback", () => {
    const ref1 = () => {}
    const ref2 = () => {}

    const composedRef = composeRefs(ref1, ref2)

    expect(composedRef).toEqual(expect.any(Function))
  })

  describe("the ref callback", () => {
    describe("when called with a new node", () => {
      it("calls all its ref callbacks with the node", () => {
        const node = document.createElement("div")

        const ref1 = vi.fn()
        const ref2 = vi.fn()

        const composedRef = composeRefs(ref1, ref2)

        composedRef(node)

        expect(ref1).toHaveBeenCalledWith(node)
        expect(ref2).toHaveBeenCalledWith(node)
      })

      it("updates all its ref objects with the node", () => {
        const node = document.createElement("span")

        const ref1: React.RefObject<HTMLSpanElement | null> = { current: null }
        const ref2: React.RefObject<HTMLSpanElement | null> = { current: null }

        const composedRef = composeRefs(ref1, ref2)

        composedRef(node)

        expect(ref1.current).toBe(node)
        expect(ref2.current).toBe(node)
      })

      it("handles both ref callbacks and objects", () => {
        const node = document.createElement("input")

        const refFunc = vi.fn()
        const refObj: React.RefObject<HTMLSpanElement | null> = { current: null }

        const composedRef = composeRefs(refFunc, refObj)

        composedRef(node)

        expect(refFunc).toHaveBeenCalledWith(node)
        expect(refObj.current).toBe(node)
      })

      it("ignores undefined refs", () => {
        const node = document.createElement("textarea")

        const refFunc = vi.fn()
        const refObj: React.RefObject<HTMLTextAreaElement | null> = { current: null }

        const composedRef = composeRefs(refFunc, undefined, refObj, undefined)

        composedRef(node)

        expect(refFunc).toHaveBeenCalledWith(node)
        expect(refObj.current).toBe(node)
      })

      it("handles no refs gracefully", () => {
        const node = document.createElement("button")

        const composedRef = composeRefs()

        expect(() => composedRef(node)).not.toThrow()
      })
    })

    it("updates its refs when the node changes", async () => {
      const refFunc = vi.fn()
      let refObj: React.RefObject<HTMLDivElement | null> | undefined

      function TestComponent() {
        refObj = useRef<HTMLDivElement>(null)
        const composedRef = composeRefs(refFunc, refObj)

        const [count, setCount] = useState(0)
        const increment = () => setCount(count => count + 1)

        return (
          <div>
            <button type="button" onClick={increment}>Increment</button>
            {count === 1 && (
              <div data-testid="node1" ref={composedRef}>
                Node 1
              </div>
            )}
            {count === 2 && (
              <div data-testid="node2" ref={composedRef}>
                Node 2
              </div>
            )}
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      if (!refObj) {
        expect.unreachable("refObj should have been set by React")
      }

      expect(refFunc).not.toHaveBeenCalled()
      expect(refObj.current).toBeNull()

      refFunc.mockClear()
      await user.click(screen.getByRole("button", { name: /increment/i }))

      const node1 = screen.getByTestId("node1")
      expect(refFunc).toHaveBeenCalledOnce()
      expect(refFunc).toHaveBeenLastCalledWith(node1)
      expect(refObj.current).toBe(node1)

      refFunc.mockClear()
      await user.click(screen.getByRole("button", { name: /increment/i }))

      const node2 = screen.getByTestId("node2")
      expect(refFunc).toHaveBeenCalledTimes(2)
      expect(refFunc).toHaveBeenNthCalledWith(1, null)
      expect(refFunc).toHaveBeenNthCalledWith(2, node2)
      expect(refObj.current).toBe(node2)

      refFunc.mockClear()
      await user.click(screen.getByRole("button", { name: /increment/i }))

      expect(refFunc).toHaveBeenCalledOnce()
      expect(refFunc).toHaveBeenLastCalledWith(null)
      expect(refObj.current).toBeNull()
    })
  })
})
