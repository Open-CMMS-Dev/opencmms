export interface WorkOrder {
  id: string
  title: string
  description?: string
  status: string
  priority?: string
  due_date?: string
  asset_id?: string
  assignee?: string
  created_at?: string
  updated_at?: string
}

export interface WorkOrderFilters {
  status?: string
  assetId?: string
  assignedTo?: string
  search?: string
}

export const workOrdersApi = {
  async getAll(filters: WorkOrderFilters = {}, supabase?: any): Promise<WorkOrder[]> {
    if (!supabase) {
      throw new Error("Supabase client required")
    }

    try {
      let query = supabase
        .from("work_orders")
        .select("id, title, description, status, priority, due_date, asset_id, assignee, created_at, updated_at")
        .order("updated_at", { ascending: false })

      if (filters.status) {
        query = query.eq("status", filters.status)
      }

      if (filters.assetId) {
        query = query.eq("asset_id", filters.assetId)
      }

      if (filters.assignedTo) {
        query = query.eq("assignee", filters.assignedTo)
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching work orders:", error)
        return []
      }

      return data ?? []
    } catch (error) {
      console.error("Failed to fetch work orders:", error)
      return []
    }
  },

  async getRecent(limit: number, supabase?: any): Promise<WorkOrder[]> {
    if (!supabase) {
      throw new Error("Supabase client required")
    }

    try {
      const { data, error } = await supabase
        .from("work_orders")
        .select("id, title, description, status, priority, due_date, asset_id, assignee, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching recent work orders:", error)
        return []
      }

      return data ?? []
    } catch (error) {
      console.error("Failed to fetch recent work orders:", error)
      return []
    }
  },

  async getById(id: string, supabase?: any): Promise<WorkOrder | null> {
    if (!supabase) {
      throw new Error("Supabase client required")
    }

    try {
      const { data, error } = await supabase
        .from("work_orders")
        .select("id, title, description, status, priority, due_date, asset_id, assignee, created_at, updated_at")
        .eq("id", id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        console.error("Error fetching work order:", error)
        return null
      }

      return data ?? null
    } catch (error) {
      console.error("Failed to fetch work order:", error)
      return null
    }
  },
}
