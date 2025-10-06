"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

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

interface CommandMenuClientProps {
  initialCommands: UiCommand[]
}

// Icon mapping
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
} as const

export function CommandMenuClient({ initialCommands }: CommandMenuClientProps) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<UiCommand[]>(initialCommands)
  const router = useRouter()

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
    if (item.disabled) return
    
    switch (item.action.kind) {
      case "navigate":
        router.push(item.action.href!)
        setOpen(false)
        break
        
      case "server":
        try {
          const response = await fetch("/api/commands", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id })
          })
          
          const result = await response.json()
          
          if (result.ok) {
            // Show success message or toast
            console.log("Command executed successfully:", result.message)
          } else {
            console.error("Command failed:", result.error)
          }
        } catch (error) {
          console.error("Failed to execute command:", error)
        }
        setOpen(false)
        break
        
      case "dialog":
        // TODO: Implement dialog system
        console.log("Open dialog:", item.action.dialog, item.action.props)
        setOpen(false)
        break
        
      case "fn":
        // TODO: Implement client function handlers
        console.log("Execute function:", item.action)
        setOpen(false)
        break
        
      default:
        setOpen(false)
    }
  }

  function IconComponent({ name }: { name?: string }) {
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
                      disabled={Boolean(item.disabled)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <IconComponent name={item.icon} />
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          {item.subtitle && (
                            <span className="text-xs text-muted-foreground">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.shortcut && (
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
