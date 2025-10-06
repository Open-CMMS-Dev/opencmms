import type { CommandProvider } from "@/core/command/types"

export const assetsCommands: CommandProvider = (ctx) => [
  {
    id: "assets.create",
    title: "Create Asset",
    subtitle: "Add a new asset to inventory",
    section: "Assets",
    icon: "package",
    shortcut: "⌘A",
    keywords: ["asset", "create", "new", "equipment"],
    when: (c) => c.user.roles.includes("admin") || c.user.roles.includes("manager"),
    action: { 
      kind: "dialog", 
      dialog: "createAsset",
      props: { moduleId: "assets" }
    },
  },
  {
    id: "assets.list",
    title: "View All Assets",
    subtitle: "Browse asset inventory",
    section: "Assets",
    icon: "list",
    shortcut: "⌘⇧A",
    keywords: ["assets", "list", "view", "inventory"],
    action: { kind: "navigate", href: "/dashboard/assets" },
  },
  {
    id: "assets.import",
    title: "Import Assets",
    subtitle: "Bulk import from CSV or Excel",
    section: "Assets",
    icon: "upload",
    keywords: ["import", "bulk", "csv", "excel"],
    when: (c) => c.user.roles.includes("admin"),
    action: { 
      kind: "server", 
      name: "importAssets"
    },
  },
  {
    id: "assets.maintenance",
    title: "Schedule Maintenance",
    subtitle: "Create maintenance schedule",
    section: "Assets",
    icon: "calendar",
    keywords: ["maintenance", "schedule", "pm"],
    when: (c) => ctx.selection?.assetId !== undefined,
    disabledWhen: (c) => !ctx.selection?.assetId,
    action: { 
      kind: "dialog", 
      dialog: "scheduleMaintenance",
      props: { assetId: ctx.selection?.assetId }
    },
  },
  {
    id: "assets.search",
    title: "Search Assets",
    subtitle: "Find assets by name, location, or category",
    section: "Assets",
    icon: "search",
    shortcut: "/",
    keywords: ["search", "find", "locate"],
    action: { kind: "navigate", href: "/dashboard/assets?focus=search" },
  },
]
