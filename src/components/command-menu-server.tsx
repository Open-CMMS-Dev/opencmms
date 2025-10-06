import { commandRegistry } from "@/core/command/registery"
import { CommandItem } from "@/core/command/types"
import "@/core/command/bootstrap" // Auto-initialize commands
import { CommandMenuClient } from "./command-menu-client"

type UiCommand = {
  id: string
  title: string
  subtitle?: string
  section?: string
  disabled?: boolean
  shortcut?: string
  icon?: string
  action: { 
    kind: string
    href?: string
    name?: string
    dialog?: string
    props?: Record<string, unknown>
  }
  children?: UiCommand[]
}

export async function CommandMenuServer() {
  // Get all commands server-side
  const allCommands = await commandRegistry.getCommands()
  
  // Transform to UI format
  const uiCommands: UiCommand[] = allCommands.map((cmd: CommandItem) => ({
    id: cmd.id,
    title: cmd.title,
    subtitle: cmd.subtitle,
    section: cmd.section,
    disabled: cmd.disabled,
    shortcut: cmd.shortcut,
    icon: cmd.icon,
    action: cmd.action
  }))

  return <CommandMenuClient initialCommands={uiCommands} />
}
