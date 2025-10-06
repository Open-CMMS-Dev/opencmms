"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function CommandMenuTrigger() {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "relative justify-center text-sm font-normal transition-all duration-200",
        "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Mobile: compact square button
        "h-8 w-8 rounded-md",
        // Desktop: full search bar with rounded corners
        "md:h-9 md:w-64 md:justify-start md:rounded-lg md:px-3 md:pr-12"
      )}
      onClick={() => {
        // Trigger the command menu by dispatching a keyboard event
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        })
        document.dispatchEvent(event)
      }}
    >
      <Search className="h-4 w-4 shrink-0 md:mr-2" />
      <span className="hidden truncate md:inline-flex">Search commands...</span>
      <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-70 md:flex">
        <span className="text-[9px]">⌘</span>
        <span>K</span>
      </kbd>
    </Button>
  )
}
