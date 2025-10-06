import type {
  ModuleDefinition,
  EntityDefinition,
  ActionContext,
  ActionResult,
  ModuleDefinition as RegisteredModule,
  ModuleUiPage,
  ModuleNavigationItem,
  NavigationSection,
} from "./types"
import { createClient } from "@/lib/supabase/server"

export interface SidebarNavItem {
  id: string
  moduleId: string
  title: string
  href: string
  icon?: string
  section: NavigationSection
  order: number
  description?: string
}

export interface ResolvedModulePage {
  module: RegisteredModule
  page: ModuleUiPage
  params: Record<string, string>
}

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
   * Build sidebar navigation items aggregated from modules
   */
  getSidebarNavigation(): SidebarNavItem[] {
    const items: SidebarNavItem[] = []

    for (const module of this.getAllModules()) {
      const navigationItems = this.buildModuleNavigation(module)

      for (const item of navigationItems) {
        const href = this.buildModuleHref(module.id, item.slug)

        items.push({
          id: item.id,
          moduleId: module.id,
          title: item.title,
          href,
          icon: item.icon,
          section: item.section ?? "modules",
          order: item.order ?? 0,
          description: item.description,
        })
      }
    }

    return items
      .sort((a, b) => {
        if (a.section === b.section) {
          if (a.order === b.order) {
            return a.title.localeCompare(b.title)
          }
          return a.order - b.order
        }

        const sectionOrder: Record<NavigationSection, number> = {
          primary: 0,
          modules: 1,
          secondary: 2,
        }

        return sectionOrder[a.section] - sectionOrder[b.section]
      })
  }

  /**
   * Resolve a module UI page based on slug segments
   */
  resolveModulePage(moduleId: string, slug: string[]): ResolvedModulePage | undefined {
    const module = this.getModule(moduleId)
    if (!module || !module.ui?.pages?.length) return undefined

    const pages = [...module.ui.pages].sort((a, b) => b.slug.length - a.slug.length)

    for (const page of pages) {
      const params = this.matchPageSlug(page.slug, slug)
      if (params) {
        return {
          module,
          page,
          params,
        }
      }
    }

    if (slug.length === 0) {
      const [firstPage] = module.ui.pages
      if (firstPage) {
        return {
          module,
          page: firstPage,
          params: {},
        }
      }
    }

    return undefined
  }

  private buildModuleNavigation(module: ModuleDefinition): ModuleNavigationItem[] {
    const items = module.navigation ?? []

    if (items.length > 0) {
      return items
    }

    if (module.ui?.pages?.length) {
      return [
        {
          id: `${module.id}.overview`,
          title: module.name,
          slug: [],
          section: "modules",
        },
      ]
    }

    return []
  }

  private buildModuleHref(moduleId: string, slug: string[]): string {
    const path = slug.length ? `/${slug.join('/')}` : ""
    return `/modules/${moduleId}${path}`
  }

  private matchPageSlug(template: string[], actual: string[]): Record<string, string> | null {
    if (template.length !== actual.length) {
      return null
    }

    const params: Record<string, string> = {}

    for (let i = 0; i < template.length; i++) {
      const templateSegment = template[i]
      const actualSegment = actual[i]

      if (!templateSegment) {
        return null
      }

      if (templateSegment.startsWith("[...") && templateSegment.endsWith("]")) {
        const paramName = templateSegment.slice(4, -1)
        params[paramName] = actual.slice(i).join("/")
        return params
      }

      if (templateSegment.startsWith("[") && templateSegment.endsWith("]")) {
        const paramName = templateSegment.slice(1, -1)
        params[paramName] = actualSegment
        continue
      }

      if (templateSegment !== actualSegment) {
        return null
      }
    }

    return params
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
