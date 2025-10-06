import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { moduleRegistry } from "@/core/modules/registry"

export async function POST(request: NextRequest) {
  try {
    const { actionId, data } = await request.json()
    
    // Get authenticated Supabase client
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ 
        success: false, 
        errors: { _form: ["Authentication required"] } 
      }, { status: 401 })
    }

    // Get user roles (this would come from your auth system)
    const userRoles = await getUserRoles(user.id, supabase)

    // Create action context
    const context = {
      user: {
        id: user.id,
        email: user.email,
        roles: userRoles
      },
      supabase,
      selection: data._selection // Pass any UI selection context
    }

    // Execute the action through module registry
    const result = await moduleRegistry.executeAction(actionId, data, context)
    
    return Response.json(result)
  } catch (error) {
    console.error("Action execution failed:", error)
    return Response.json({ 
      success: false, 
      errors: { _form: ["Internal server error"] }
    }, { status: 500 })
  }
}

async function getUserRoles(userId: string, supabase: any): Promise<string[]> {
  try {
    // Get user role assignments
    const { data: roleAssignments, error } = await supabase
      .from('user_role_assignments')
      .select(`
        user_roles (
          name,
          permissions
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
