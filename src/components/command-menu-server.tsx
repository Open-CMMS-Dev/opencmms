import { createClient } from "@/lib/supabase/server"
import { moduleRegistry } from "@/core/modules/registry"
import { CommandMenuClient } from "./command-menu-client"

export async function CommandMenuServer() {
  const supabase = await createClient()
  
  // Get current user from Supabase
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    // Return basic commands for unauthenticated users
    return <CommandMenuClient initialCommands={getGuestCommands()} />
  }

  // Get user roles/permissions
  const userRoles = await getUserRoles(user.id, supabase)

  // Generate commands from module registry
  const commands = moduleRegistry.getCommands({
    user: {
      id: user.id,
      roles: userRoles
    }
  })

  // Add system-level commands
  const systemCommands = [
    {
      id: "nav.dashboard",
      title: "Dashboard",
      subtitle: "Go to main dashboard",
      section: "Navigation",
      icon: "home",
      shortcut: "⌘H",
      keywords: ["dashboard", "home"],
      action: { kind: "navigate", href: "/dashboard" }
    },
    {
      id: "system.logout",
      title: "Sign Out",
      subtitle: "Sign out of your account",
      section: "System",
      icon: "log-out",
      keywords: ["logout", "sign out", "exit"],
      action: { kind: "navigate", href: "/auth/logout" }
    }
  ]

  const allCommands = [...systemCommands, ...commands]

  return <CommandMenuClient initialCommands={allCommands} />
}

async function getUserRoles(userId: string, supabase: any): Promise<string[]> {
  try {
    // Get user role assignments
    const { data: roleAssignments, error } = await supabase
      .from('user_role_assignments')
      .select(`
        user_roles (
          name
        )
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user roles:', error)
      return ['user'] // Default role
    }

    // Extract role names
    const roles = roleAssignments?.map((assignment: any) => 
      assignment.user_roles.name
    ) || []

    // If no roles assigned, default to 'user'
    return roles.length > 0 ? roles : ['user']
  } catch (error) {
    console.error('Error in getUserRoles:', error)
    return ['user']
  }
}

function getGuestCommands() {
  return [
    {
      id: "nav.home",
      title: "Home",
      subtitle: "Go to homepage",
      section: "Navigation",
      icon: "home",
      keywords: ["home"],
      action: { kind: "navigate", href: "/" }
    },
    {
      id: "auth.login",
      title: "Sign In",
      subtitle: "Sign in to your account",
      section: "Authentication",
      icon: "user",
      keywords: ["login", "sign in"],
      action: { kind: "navigate", href: "/auth/login" }
    }
  ]
}
