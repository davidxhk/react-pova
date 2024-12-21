import type { PluginFactory } from "./plugin-factory"

export interface PluginRegistry { [key: PropertyKey]: PluginFactory<any> }
