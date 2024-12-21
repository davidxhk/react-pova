import type { Plugin } from "./plugin"
import type { PluginFactoryProps } from "./plugin-factory-props"

export type PluginFactory<P> = (props: PluginFactoryProps & P) => Plugin
