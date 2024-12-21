export interface Trigger {
  event: keyof HTMLElementEventMap
  capture?: boolean
  fixture?: string
  element?: "firstElementChild" | "form" | "lastElementChild" | "nextElementSibling" | "offsetParent" | "parentElement" | "previousElementSibling"
  state?: string | string[]
  reset?: boolean
  validate?: boolean
}
