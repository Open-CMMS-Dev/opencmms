import type { CommandProvider, UiCommand } from "@/core/modules/types"

export const assetsCommands: CommandProvider = (context) => {
  const commands: UiCommand[] = [
    // Base asset commands
    {
      id: "assets.view-all",
      title: "View All Assets",
      subtitle: "Browse all assets across categories",
      section: "Assets",
      icon: "package",
      shortcut: "⌘A",
      keywords: ["assets", "all", "browse", "list"],
      action: { 
        kind: "navigate", 
        href: "/dashboard/assets" 
      }
    },
    {
      id: "assets.create",
      title: "Create Asset", 
      subtitle: "Add a new asset to the system",
      section: "Assets",
      icon: "plus",
      shortcut: "⌘N",
      keywords: ["create", "new", "add", "asset"],
      action: {
        kind: "navigate",
        href: "/dashboard/assets/create"
      },
      when: (ctx) => ctx.user.roles.includes("admin") || 
                    ctx.user.roles.includes("assets.create")
    }
  ]

  // Category-specific commands
  const categories = ["equipment", "vehicle", "facility", "it"] // Could be dynamic from registry
  
  for (const category of categories) {
    commands.push(
      {
        id: `assets.view-${category}`,
        title: `View ${category.charAt(0).toUpperCase() + category.slice(1)} Assets`,
        subtitle: `Browse ${category} category assets`,
        section: "Assets",
        icon: "package",
        keywords: ["assets", category, "browse"],
        action: { 
          kind: "navigate", 
          href: `/dashboard/assets/${category}` 
        }
      },
      {
        id: `assets.create-${category}`,
        title: `Create ${category.charAt(0).toUpperCase() + category.slice(1)} Asset`,
        subtitle: `Add new ${category} asset`,
        section: "Assets",
        icon: "plus", 
        keywords: ["create", "new", category],
        action: {
          kind: "navigate",
          href: `/dashboard/assets/${category}/create`
        },
        when: (ctx) => ctx.user.roles.includes("admin") || 
                      ctx.user.roles.includes("assets.create")
      }
    )
  }

  // Context-aware commands when asset is selected
  if (context.selection?.assetId) {
    commands.push(
      {
        id: "assets.edit-current",
        title: "Edit Current Asset",
        subtitle: `Edit asset ${context.selection.assetId}`,
        section: "Assets",
        icon: "edit",
        shortcut: "⌘E",
        keywords: ["edit", "modify", "update"],
        action: {
          kind: "server",
          actionId: "assets.update",
          props: { assetId: context.selection.assetId }
        },
        when: (ctx) => ctx.user.roles.includes("admin") || 
                      ctx.user.roles.includes("assets.update")
      },
      {
        id: "assets.delete-current",
        title: "Delete Current Asset",
        subtitle: `Delete asset ${context.selection.assetId}`,
        section: "Assets",
        icon: "trash",
        keywords: ["delete", "remove"],
        action: {
          kind: "server",
          actionId: "assets.delete",
          props: { id: context.selection.assetId }
        },
        when: (ctx) => ctx.user.roles.includes("admin") || 
                      ctx.user.roles.includes("assets.delete")
      },
      {
        id: "assets.view-work-orders",
        title: "View Asset Work Orders",
        subtitle: "See all work orders for this asset",
        section: "Assets",
        icon: "clipboard",
        keywords: ["work orders", "maintenance", "history"],
        action: {
          kind: "navigate",
          href: `/dashboard/work-orders?assetId=${context.selection.assetId}`
        }
      },
      {
        id: "assets.create-work-order",
        title: "Create Work Order",
        subtitle: "Create work order for this asset",
        section: "Assets", 
        icon: "plus",
        shortcut: "⌘W",
        keywords: ["create", "work order", "maintenance"],
        action: {
          kind: "navigate",
          href: `/dashboard/work-orders/create?assetId=${context.selection.assetId}`
        },
        when: (ctx) => ctx.user.roles.includes("admin") || 
                      ctx.user.roles.includes("work-orders.create")
      }
    )
  }

  return commands
}
    