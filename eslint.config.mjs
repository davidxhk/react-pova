// @ts-check
import antfu from "@antfu/eslint-config"
import globals from "globals"

export default antfu({
  react: true,
  type: "lib",
  typescript: true,
  languageOptions: {
    globals: globals.browser,
  },
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  rules: {
    "node/prefer-global/process": "off",
    "react/no-children-only": "off",
    "react/no-clone-element": "off",
    "ts/no-redeclare": "off",
    "unicorn/error-message": "off",
  },
})
