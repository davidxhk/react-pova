import type { PluginFactory } from "./plugin-factory"
import type { PluginFactoryProps } from "./plugin-factory-props"
import type { PluginRegistry } from "./plugin-registry"

export type RegistryPluginProps<
  R extends PluginRegistry,
  K extends keyof R,
> = R[K] extends PluginFactory<infer P>
  ? Partial<PluginFactoryProps> & P
  : never
