// Core command system types for CMMS
export type CommandContext = {
  user: { 
    id: string
    roles: string[]
    siteId?: string
  }
  featureFlags: Record<string, boolean>
  selection?: { 
    assetId?: string
    workOrderId?: string
    moduleId?: string
  }
}

export type CommandAction =
  | { kind: "navigate"; href: string }
  | { kind: "server"; name: string; inputSchema?: unknown }
  | { kind: "dialog"; dialog: string; props?: Record<string, unknown> }
  | { kind: "fn"; handler: string }

export type CommandItem = {
  id: string
  title: string
  subtitle?: string
  section?: string
  icon?: string
  keywords?: string[]
  shortcut?: string
  when?: (ctx: CommandContext) => boolean
  disabledWhen?: (ctx: CommandContext) => boolean
  featureFlag?: string
  action: CommandAction
  children?: CommandItem[]
  disabled?: boolean // resolved state
  loadChildren?: (ctx: CommandContext) => Promise<CommandItem[]>
}

export type CommandProvider = (ctx: CommandContext) => Promise<CommandItem[]> | CommandItem[]

export type CommandExecuteResult = 
  | { ok: true; data?: unknown; message?: string }
  | { ok: false; error: string }

export type CommandListResponse = {
  items: CommandItem[]
  context: CommandContext
}

export type CommandExecuteRequest = {
  id: string
  payload?: unknown
}
