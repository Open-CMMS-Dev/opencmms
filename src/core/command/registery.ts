import {
  CommandContext,
  CommandItem,
  CommandProvider
} from "./types"

class CommandRegistry {
  private providers: CommandProvider[] = []
  
  register(provider: CommandProvider) { 
    this.providers.push(provider)
  }

  async listVisible(ctx: CommandContext): Promise<CommandItem[]> {
    const contributed = (await Promise.all(this.providers.map(p => p(ctx)))).flat()
    return this.filterAndResolve(contributed, ctx)
  }

  async filterAndResolve(items: CommandItem[], ctx: CommandContext): Promise<CommandItem[]> {
    const apply = async (item: CommandItem): Promise<CommandItem | null> => {
      // Check feature flag
      if (item.featureFlag && !ctx.featureFlags[item.featureFlag]) {
        return null
      }
      
      // Check visibility condition
      if (item.when && !item.when(ctx)) {
        return null
      }
      
      // Check if disabled
      const disabled = item.disabledWhen?.(ctx) ?? false
      
      // Process children
      const children = [
        ...(item.children ?? []),
        ...((item.loadChildren ? await item.loadChildren(ctx) : []) ?? []),
      ]
      
      const visibleChildren = (await Promise.all(children.map(apply)))
        .filter(Boolean) as CommandItem[]
      
      return { 
        ...item, 
        children: visibleChildren, 
        disabled 
      }
    }
    
    const out = await Promise.all(items.map(apply))
    return out.filter(Boolean) as CommandItem[]
  }

  // Get all registered commands (for server-side rendering)
  async getCommands(ctx?: CommandContext): Promise<CommandItem[]> {
    const defaultCtx: CommandContext = ctx ?? {
      user: { id: "system", roles: ["admin"] },
      featureFlags: {},
      selection: {}
    }
    
    const allCommands = await Promise.all(
      this.providers.map(provider => provider(defaultCtx))
    )
    
    return allCommands.flat()
  }

  // Helper to find a command by ID (for execution)
  async findById(id: string, ctx: CommandContext): Promise<CommandItem | null> {
    const items = await this.listVisible(ctx)
    
    const findInItems = (items: CommandItem[]): CommandItem | null => {
      for (const item of items) {
        if (item.id === id) return item
        if (item.children) {
          const found = findInItems(item.children)
          if (found) return found
        }
      }
      return null
    }

    return findInItems(items)
  }
}

export const commandRegistry = new CommandRegistry()
