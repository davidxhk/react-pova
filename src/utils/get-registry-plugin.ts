import type { PluginFactory, PluginRegistry } from "../types"

export function getRegistryPlugin(registry: PluginRegistry, key: PropertyKey | undefined): PluginFactory<any> {
  if (!key) {
    return () => () => true
  }

  if (registry[key]) {
    return registry[key]
  }

  throw new Error(`Plugin '${key.toString()}' not found`)
}
