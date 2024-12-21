import type { PluginFactoryProps } from "./plugin-factory-props"

export type DefaultPlugin = { type?: never } & Partial<PluginFactoryProps>
