import { z } from "zod"

// Core types for the module system
export interface ModuleDefinition {
  id: string
  name: string
  version: string
  description?: string
  dependencies?: string[]
  routes?: ModuleRoute[]
  actions?: ServerAction[]
  entities?: EntityDefinition[]
  relationships?: ModuleRelationship[]
  commands?: CommandProvider[]
  config?: Record<string, unknown>
  initialize?: () => Promise<void>
}

export interface ModuleRoute {
  path: string
  component: string
  permissions?: string[]
}

export interface ServerAction {
  id: string
  name: string
  description?: string
  schema: z.ZodSchema
  handler: (data: unknown, context: ActionContext) => Promise<ActionResult>
  permissions?: string[]
}

export interface ActionContext {
  user: { 
    id: string
    email?: string
    roles: string[] 
  }
  supabase: any // Supabase client
  selection?: { 
    assetId?: string
    workOrderId?: string
    moduleId?: string
    [key: string]: unknown 
  }
}

export interface ActionResult {
  success: boolean
  data?: unknown
  errors?: Record<string, string[]>
  redirect?: string
  toast?: { 
    type: 'success' | 'error' | 'warning' | 'info'
    message: string 
  }
  refresh?: boolean
}

export interface EntityDefinition {
  id: string
  name: string
  description?: string
  category: string
  schema: EntitySchema
  relationships?: EntityRelationship[]
}

export interface EntitySchema {
  fields: EntityField[]
  extends?: string
  behaviors?: EntityBehavior[]
  metadata?: Record<string, unknown>
}

export interface EntityField {
  name: string
  type: FieldType
  label: string
  required?: boolean
  defaultValue?: unknown
  validation?: FieldValidation
  metadata?: Record<string, unknown>
}

export type FieldType = 
  | 'string'
  | 'text'
  | 'number'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'enum'
  | 'reference'
  | 'uuid'
  | 'json'
  | 'array'
  | 'file'

export interface FieldValidation {
  min?: number
  max?: number
  pattern?: string
  options?: string[]
  referenceTable?: string
  referenceModule?: string
}

export interface EntityRelationship {
  name: string
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  targetEntity: string
  targetModule?: string
  foreignKey?: string
  required?: boolean
}

export interface EntityBehavior {
  name: string
  trigger: 'create' | 'update' | 'delete' | 'custom'
  action: string
  params?: Record<string, unknown>
}

export interface ModuleRelationship {
  targetModule: string
  type: 'dependency' | 'integration'
  description?: string
}

// Command system types
export interface CommandProvider {
  (context: CommandContext): UiCommand[]
}

export interface CommandContext {
  user: { id: string; roles: string[] }
  selection?: { 
    assetId?: string
    workOrderId?: string
    [key: string]: unknown 
  }
  moduleRegistry: ModuleRegistry
}

export interface UiCommand {
  id: string
  title: string
  subtitle?: string
  section?: string
  disabled?: boolean
  shortcut?: string
  icon?: string
  keywords?: string[]
  action: CommandAction
  children?: UiCommand[]
  when?: (context: CommandContext) => boolean
}

export interface CommandAction {
  kind: 'navigate' | 'server' | 'dialog' | 'function'
  href?: string
  actionId?: string
  dialog?: string
  functionName?: string
  props?: Record<string, unknown>
}

// Permission system
export interface Permission {
  module: string
  action: string
  resource?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}
