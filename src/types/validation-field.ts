import type { PluginFactory } from "./plugin-factory"
import type { PluginRegistry } from "./plugin-registry"
import type { ValidationFieldProps } from "./validation-field-props"

export interface ValidationField<R extends PluginRegistry> {
  (props: ValidationFieldProps<R>): React.JSX.Element
  registerPlugin: <K extends string, V extends PluginFactory<any>>(name: K, plugin: V) => ValidationField<R & { [P in K]: V }>
  registerPlugins: <P extends PluginRegistry>(plugins: P) => ValidationField<R & P>
}
