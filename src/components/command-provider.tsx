"use client"

import React from "react"
import { commandRegistry } from "@/core/command/registery"

interface CommandProviderProps {
  children: React.ReactNode
}

interface CommandContextType {
  registry: typeof commandRegistry
}

const CommandContext = React.createContext<CommandContextType | null>(null)

export function CommandProvider({ children }: CommandProviderProps) {
  React.useEffect(() => {
    // Initialize command registry in browser
    import("@/core/command/bootstrap").then(({ bootstrap }) => {
      bootstrap()
    })
  }, [])

  return (
    <CommandContext.Provider value={{ registry: commandRegistry }}>
      {children}
    </CommandContext.Provider>
  )
}

export function useCommands() {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error("useCommands must be used within a CommandProvider")
  }
  return context
}
