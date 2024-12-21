import type { DefaultPlugin } from "./default-plugin"
import type { PluginRegistry } from "./plugin-registry"
import type { RegistryPlugin } from "./registry-plugin"
import type { Trigger } from "./trigger"

export interface ValidationFieldProps<R extends PluginRegistry> {
  children: React.ReactNode
  defaultFixture?: string
  defaultResult?: string
  name: string
  plugins: (RegistryPlugin<R> | DefaultPlugin)[]
  triggers?: Trigger[]
}
