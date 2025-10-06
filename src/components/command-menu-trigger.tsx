"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"

export function CommandMenuTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <Button
      variant="outline"
      className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
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
      <Search className="mr-2 h-4 w-4" />
      Search commands...
      <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}
