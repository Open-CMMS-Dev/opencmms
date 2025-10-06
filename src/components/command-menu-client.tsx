"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { 
  Package,
  Clipboard,
  Home,
  User,
  Settings,
  Users,
  BarChart,
  LogOut,
  List,
  Upload,
  Calendar,
  Search,
  Play,
  Check,
  Plus,
  Edit,
  Trash,
  Filter,
  Download,
  Loader2,
} from "lucide-react"

type UiCommand = {
  id: string
  title: string
  subtitle?: string
  section?: string
  disabled?: boolean
  shortcut?: string
  icon?: string
  keywords?: string[]
  action: { 
    kind: string
    href?: string
    name?: string
    dialog?: string
    actionId?: string
    functionName?: string
    props?: Record<string, unknown>
  }
  children?: UiCommand[]
}

interface CommandMenuClientProps {
  initialCommands: UiCommand[]
}

// Enhanced icon mapping
const iconMap = {
  "package": Package,
  "clipboard": Clipboard,
  "home": Home,
  "user": User,
  "settings": Settings,
  "users": Users,
  "bar-chart": BarChart,
  "log-out": LogOut,
  "list": List,
  "upload": Upload,
  "calendar": Calendar,
  "search": Search,
  "play": Play,
  "check": Check,
  "plus": Plus,
  "edit": Edit,
  "trash": Trash,
  "filter": Filter,
  "download": Download,
  "loader": Loader2,
} as const

export function CommandMenuClient({ initialCommands }: CommandMenuClientProps) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<UiCommand[]>(initialCommands)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  // Update commands when initialCommands change
  React.useEffect(() => {
    setItems(initialCommands)
  }, [initialCommands])

  // Keyboard shortcut to open command palette
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // No need to load commands since we have them from server
  // Commands are pre-loaded from the server via initialCommands

  // Group commands by section
  const bySection = React.useMemo(() => {
    const map = new Map<string, UiCommand[]>()
    
    for (const item of items) {
      const section = item.section ?? "General"
      if (!map.has(section)) {
        map.set(section, [])
      }
      map.get(section)!.push(item)
    }
    
    return Array.from(map.entries())
  }, [items])

  async function onSelect(item: UiCommand) {
    if (item.disabled || loading) return
    
    switch (item.action.kind) {
      case "navigate":
        if (item.action.href) {
          router.push(item.action.href)
          toast.success(`Navigating to ${item.title}`)
        }
        setOpen(false)
        break
        
      case "server":
        setLoading(true)
        try {
          const response = await fetch("/api/actions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              actionId: item.action.actionId || item.id,
              data: item.action.props || {}
            })
          })
          
          const result = await response.json()
          
          if (result.success) {
            if (result.toast) {
              toast[result.toast.type](result.toast.message)
            }
            if (result.redirect) {
              router.push(result.redirect)
              router.refresh() // Ensure fresh data
            }
            if (result.refresh) {
              router.refresh()
            }
          } else {
            const errorMsg = result.errors?._form?.[0] || result.error || "Command failed"
            toast.error(errorMsg)
          }
        } catch (error) {
          console.error("Command execution failed:", error)
          toast.error("Failed to execute command")
        } finally {
          setLoading(false)
        }
        setOpen(false)
        break
        
      case "dialog":
        // For now, just log - can be enhanced later with actual dialogs
        console.log("Open dialog:", item.action.dialog, item.action.props)
        toast.info(`Opening ${item.title} dialog`)
        setOpen(false)
        break
        
      case "function":
        // Execute client-side function
        if (item.action.functionName) {
          try {
            toast.success(`${item.title} completed`)
          } catch (error) {
            console.error("Function execution failed:", error)
            toast.error(`Failed to execute ${item.title}`)
          }
        }
        setOpen(false)
        break
        
      default:
        setOpen(false)
    }
  }

  function IconComponent({ name, isLoading }: { name?: string; isLoading?: boolean }) {
    if (isLoading) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    }
    
    if (!name) return null
    const Icon = iconMap[name as keyof typeof iconMap]
    return Icon ? <Icon className="mr-2 h-4 w-4" /> : null
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {bySection.map(([section, group], index) => (
              <React.Fragment key={section}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={section}>
                  {group.map(item => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => onSelect(item)}
                      disabled={Boolean(item.disabled) || loading}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <IconComponent 
                          name={item.icon} 
                          isLoading={loading}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="truncate">{item.title}</span>
                          {item.subtitle && (
                            <span className="text-xs text-muted-foreground truncate">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.shortcut && !loading && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
      </CommandList>
    </CommandDialog>
  )
}
