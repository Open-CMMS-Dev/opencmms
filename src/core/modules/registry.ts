import type { ModuleDefinition, EntityDefinition, ActionContext, ActionResult } from "./types"
import { createClient } from "@/lib/supabase/server"

export class ModuleRegistry {
  private modules = new Map<string, ModuleDefinition>()
  private entitySchemas = new Map<string, EntityDefinition>()
  private initialized = false

  constructor() {
    console.log('ModuleRegistry initialized')
  }

  /**
   * Register a module with the system
   */
  register(module: ModuleDefinition) {
    // Validate dependencies
    if (module.dependencies) {
      for (const dep of module.dependencies) {
        if (!this.modules.has(dep)) {
          console.warn(`Module ${module.id} depends on ${dep} which is not registered yet`)
        }
      }
    }

    this.modules.set(module.id, module)

    // Register entity schemas from this module
    if (module.entities) {
      for (const entity of module.entities) {
        this.entitySchemas.set(`${module.id}.${entity.id}`, entity)
      }
    }

    console.log(`Registered module: ${module.name} (${module.id})`)
  }

  /**
   * Get a specific module by ID
   */
  getModule(id: string): ModuleDefinition | undefined {
    return this.modules.get(id)
  }

  /**
   * Get all registered modules
   */
  getAllModules(): ModuleDefinition[] {
    return Array.from(this.modules.values())
  }

  /**
   * Get modules that depend on a specific module
   */
  getModulesByDependency(dependencyId: string): ModuleDefinition[] {
    return this.getAllModules().filter(m => 
      m.dependencies?.includes(dependencyId)
    )
  }

  /**
   * Get entity schema by full ID (module.entity)
   */
  getEntitySchema(fullId: string): EntityDefinition | undefined {
    return this.entitySchemas.get(fullId)
  }

  /**
   * Get all entity schemas for a module
   */
  getModuleEntitySchemas(moduleId: string): EntityDefinition[] {
    return Array.from(this.entitySchemas.entries())
      .filter(([key]) => key.startsWith(`${moduleId}.`))
      .map(([, entity]) => entity)
  }

  /**
   * Get schemas by category across all modules
   */
  getSchemasByCategory(category: string): EntityDefinition[] {
    return Array.from(this.entitySchemas.values())
      .filter(schema => schema.category === category)
  }

  /**
   * Initialize all modules in dependency order
   */
  async initialize() {
    if (this.initialized) {
      console.log('ModuleRegistry already initialized')
      return
    }

    console.log('Initializing module registry...')
    
    const sorted = this.topologicalSort()
    
    for (const module of sorted) {
      await this.initializeModule(module)
    }

    // Sync with database
    await this.syncWithDatabase()

    this.initialized = true
    console.log('ModuleRegistry initialization complete')
  }

  /**
   * Check if a user has permission for a module action
   */
  hasPermission(
    userRoles: string[], 
    moduleId: string, 
    action: string, 
    resource?: string
  ): boolean {
    // Admin always has access
    if (userRoles.includes('admin')) return true

    // Check if user has module access
    const moduleRole = `${moduleId}.${action}`
    if (userRoles.includes(moduleRole)) return true

    // Check specific resource permission
    if (resource) {
      const resourceRole = `${moduleId}.${action}.${resource}`
      if (userRoles.includes(resourceRole)) return true
    }

    return false
  }

  /**
   * Execute a server action
   */
  async executeAction(
    actionId: string, 
    data: unknown, 
    context: ActionContext
  ): Promise<ActionResult> {
    const [moduleId, actionName] = actionId.split('.')
    const module = this.getModule(moduleId)

    if (!module) {
      return {
        success: false,
        errors: { _form: [`Module ${moduleId} not found`] }
      }
    }

    const action = module.actions?.find(a => a.id === actionId)
    if (!action) {
      return {
        success: false,
        errors: { _form: [`Action ${actionId} not found`] }
      }
    }

    // Check permissions
    if (action.permissions) {
      const hasPermission = action.permissions.some(perm =>
        this.hasPermission(context.user.roles, moduleId, perm)
      )
      
      if (!hasPermission) {
        return {
          success: false,
          errors: { _form: ['Insufficient permissions'] }
        }
      }
    }

    // Validate data
    const validation = action.schema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      }
    }

    try {
      return await action.handler(validation.data, context)
    } catch (error) {
      console.error(`Action ${actionId} failed:`, error)
      return {
        success: false,
        errors: { _form: ['Action execution failed'] }
      }
    }
  }

  /**
   * Get available commands for a user
   */
  getCommands(context: { user: { id: string; roles: string[] }; selection?: any }): any[] {
    const commands = []

    for (const module of this.getAllModules()) {
      if (!module.commands) continue

      // Check if user has access to this module
      const hasModuleAccess = this.hasPermission(
        context.user.roles,
        module.id,
        'read'
      )

      if (!hasModuleAccess) continue

      try {
        const moduleCommands = module.commands({
          user: context.user,
          selection: context.selection,
          moduleRegistry: this
        })

        commands.push(...moduleCommands)
      } catch (error) {
        console.error(`Failed to get commands from module ${module.id}:`, error)
      }
    }

    return commands
  }

  /**
   * Sort modules by dependency order
   */
  private topologicalSort(): ModuleDefinition[] {
    const visited = new Set<string>()
    const sorted: ModuleDefinition[] = []
    
    const visit = (moduleId: string) => {
      if (visited.has(moduleId)) return
      
      const module = this.modules.get(moduleId)
      if (!module) return

      visited.add(moduleId)
      
      // Visit dependencies first
      if (module.dependencies) {
        for (const dep of module.dependencies) {
          visit(dep)
        }
      }
      
      sorted.push(module)
    }

    for (const moduleId of this.modules.keys()) {
      visit(moduleId)
    }

    return sorted
  }

  /**
   * Initialize a single module
   */
  private async initializeModule(module: ModuleDefinition) {
    try {
      if (module.initialize) {
        await module.initialize()
      }
      console.log(`Initialized module: ${module.name}`)
    } catch (error) {
      console.error(`Failed to initialize module ${module.id}:`, error)
    }
  }

  /**
   * Sync module registry with Supabase database
   */
  private async syncWithDatabase() {
    try {
      const supabase = await createClient()

      // Insert/update modules in database
      for (const module of this.getAllModules()) {
        const { error } = await supabase
          .from('modules')
          .upsert({
            name: module.id,
            version: module.version,
            description: module.description,
            dependencies: module.dependencies || [],
            config: module.config || {},
            enabled: true
          }, {
            onConflict: 'name'
          })

        if (error) {
          console.error(`Failed to sync module ${module.id}:`, error)
        }
      }

      // Sync entity schemas
      for (const [fullId, entity] of this.entitySchemas.entries()) {
        const [moduleId] = fullId.split('.')
        
        const { data: moduleData } = await supabase
          .from('modules')
          .select('id')
          .eq('name', moduleId)
          .single()

        if (!moduleData) continue

        const { error } = await supabase
          .from('entity_schemas')
          .upsert({
            name: entity.name,
            description: entity.description,
            category: entity.category,
            module_id: moduleData.id,
            schema_definition: entity.schema,
            is_active: true
          }, {
            onConflict: 'name,category,module_id'
          })

        if (error) {
          console.error(`Failed to sync entity schema ${fullId}:`, error)
        }
      }

      console.log('Module registry synced with database')
    } catch (error) {
      console.error('Failed to sync with database:', error)
    }
  }
}

// Global registry instance
export const moduleRegistry = new ModuleRegistry()
