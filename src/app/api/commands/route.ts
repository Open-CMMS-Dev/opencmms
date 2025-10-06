import { NextRequest, NextResponse } from "next/server"
import { commandRegistry } from "@/core/command/registery"
import { runServerAction } from "@/app/_actions/command-actions"
import { CommandContext, CommandExecuteRequest } from "@/core/command/types"
import "@/core/command/bootstrap" // Initialize registry

// Mock function to get user context - replace with your auth implementation
async function getServerSessionContext(): Promise<CommandContext> {
  // TODO: Replace with actual session/auth logic
  return {
    user: {
      id: "user-1",
      roles: ["admin", "manager", "technician"],
      siteId: "site-1"
    },
    featureFlags: {
      "advanced-reports": true,
      "bulk-operations": true,
      "beta-features": false
    },
    selection: {
      // These would come from the current page context
      // assetId: "asset-123",
      // workOrderId: "wo-456"
    }
  }
}

export async function GET() {
  try {
    const ctx = await getServerSessionContext()
    const items = await commandRegistry.listVisible(ctx)
    
    return NextResponse.json({ 
      items,
      context: {
        user: { id: ctx.user.id, roles: ctx.user.roles },
        selection: ctx.selection
      }
    })
  } catch (error) {
    console.error("Failed to list commands:", error)
    return NextResponse.json(
      { error: "Failed to load commands" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await getServerSessionContext()
    const body: CommandExecuteRequest = await req.json()
    const { id, payload } = body

    // Find the command to ensure it exists and user has access
    const command = await commandRegistry.findById(id, ctx)
    
    if (!command) {
      return NextResponse.json(
        { error: "Command not found" },
        { status: 404 }
      )
    }

    if (command.disabled) {
      return NextResponse.json(
        { error: "Command is disabled" },
        { status: 403 }
      )
    }

    // Execute based on action type
    switch (command.action.kind) {
      case "server":
        const result = await runServerAction(command.action.name, payload)
        return NextResponse.json(result)
        
      case "navigate":
      case "dialog":
      case "fn":
        // These are handled client-side, just return the action
        return NextResponse.json({ 
          ok: true, 
          action: command.action 
        })
        
      default:
        return NextResponse.json(
          { error: "Unsupported action type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Failed to execute command:", error)
    return NextResponse.json(
      { error: "Failed to execute command" },
      { status: 500 }
    )
  }
}
