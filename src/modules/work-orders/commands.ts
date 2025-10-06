import type { CommandProvider } from "@/core/command/types"

export const workCommands: CommandProvider = (ctx) => [
  {
    id: "work.create",
    title: "Create Work Order",
    subtitle: "New maintenance or repair task",
    section: "Work Orders",
    icon: "clipboard",
    shortcut: "⌘W",
    keywords: ["work", "wo", "create", "maintenance", "repair"],
    when: (c) => c.user.roles.includes("technician") || c.user.roles.includes("planner") || c.user.roles.includes("admin"),
    action: { 
      kind: "dialog", 
      dialog: "createWorkOrder",
      props: { assetId: ctx.selection?.assetId }
    },
  },
  {
    id: "work.backlog",
    title: "Open Backlog",
    subtitle: "View pending work orders",
    section: "Work Orders",
    icon: "list",
    shortcut: "⌘B",
    keywords: ["backlog", "pending", "queue"],
    action: { kind: "navigate", href: "/modules/work-orders?status=pending" },
  },
  {
    id: "work.active",
    title: "Active Work Orders",
    subtitle: "Currently in progress",
    section: "Work Orders",
    icon: "play",
    keywords: ["active", "progress", "running"],
    action: { kind: "navigate", href: "/modules/work-orders?status=active" },
  },
  {
    id: "work.complete",
    title: "Complete Work Order",
    subtitle: "Mark current work order as complete",
    section: "Work Orders",
    icon: "check",
    keywords: ["complete", "finish", "done"],
    when: (c) => ctx.selection?.workOrderId !== undefined,
    disabledWhen: (c) => !ctx.selection?.workOrderId,
    action: { 
      kind: "server", 
      name: "completeWorkOrder",
    },
  },
  {
    id: "work.schedule",
    title: "Schedule Work",
    subtitle: "Plan work order execution",
    section: "Work Orders",
    icon: "calendar",
    keywords: ["schedule", "plan", "assign"],
    when: (c) => c.user.roles.includes("planner") || c.user.roles.includes("admin"),
    action: { 
      kind: "dialog", 
      dialog: "scheduleWork"
    },
  },
]
