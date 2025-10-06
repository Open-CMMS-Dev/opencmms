import { commandRegistry } from "./registery"
import { systemCommands } from "./system-commands"
import { assetsCommands } from "@/modules/assets/commands"
import { workCommands } from "@/modules/work-orders/commands"

export function initCommandRegistry() {
  // Register core system commands
  commandRegistry.register(systemCommands)
  
  // Register module commands
  commandRegistry.register(assetsCommands)
  commandRegistry.register(workCommands)
  
  console.log("Command registry initialized")
}

export const bootstrap = initCommandRegistry

// Auto-initialize when this module is imported
initCommandRegistry()
