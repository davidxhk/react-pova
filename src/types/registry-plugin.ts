import type { PluginRegistry } from "./plugin-registry"
import type { RegistryPluginProps } from "./registry-plugin-props"

export type RegistryPlugin<R extends PluginRegistry> = {
  [K in keyof R]: { type: K } & RegistryPluginProps<R, K>
}[keyof R]
