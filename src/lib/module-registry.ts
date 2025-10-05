import { ComponentType } from 'react'

export interface ModuleRoute {
  path: string
  component: ComponentType<any>
  serverComponent?: ComponentType<any>
  title: string
  description?: string
}

export interface Module {
  name: string
  title: string
  description: string
  icon?: string
  routes: ModuleRoute[]
}

export interface ModuleRegistry {
  [key: string]: Module
}

// Global module registry - works on both server and client
let moduleRegistry: ModuleRegistry = {}

export function registerModule(name: string, module: Module) {
  moduleRegistry[name] = module
}

export function getModule(name: string): Module | undefined {
  return moduleRegistry[name]
}

export function getAllModules(): ModuleRegistry {
  return { ...moduleRegistry }
}

export function getModuleRoute(moduleName: string, routePath: string): ModuleRoute | undefined {
  const module = getModule(moduleName)
  if (!module) return undefined
  
  return module.routes.find(route => route.path === routePath)
}

export function resolveModulePath(segments: string[]): { module: string; route: string } | null {
  if (segments.length === 0) return null
  
  const moduleName = segments[0]
  const routePath = segments.slice(1).join('/') || 'index'
  
  return { module: moduleName, route: routePath }
}

export function clearRegistry() {
  moduleRegistry = {}
}

export function getRegisteredModuleNames(): string[] {
  return Object.keys(moduleRegistry)
}
