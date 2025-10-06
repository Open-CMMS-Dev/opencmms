export interface Asset {
  id: string
  name: string
  description?: string
  category: string
  status: 'active' | 'inactive' | 'maintenance' | 'retired'
  location: string
  serial_number?: string
  manufacturer?: string
  model?: string
  purchase_date?: string
  purchase_price?: number
  warranty_expiry?: string
  parent_asset_id?: string
  category_data?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface AssetFilters {
  category?: string
  status?: string
  location?: string
  manufacturer?: string
  search?: string
  parent_asset_id?: string
}

export const assetsApi = {
  async getAll(filters?: AssetFilters, supabase?: any): Promise<Asset[]> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    let query = supabase
      .from('assets')
      .select('*')
      .order('name')

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters?.manufacturer) {
      query = query.ilike('manufacturer', `%${filters.manufacturer}%`)
    }
    if (filters?.parent_asset_id) {
      query = query.eq('parent_asset_id', filters.parent_asset_id)
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assets:', error)
      throw new Error(`Failed to fetch assets: ${error.message}`)
    }

    return data || []
  },

  async getById(id: string, supabase?: any): Promise<Asset | null> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Error fetching asset:', error)
      throw new Error(`Failed to fetch asset: ${error.message}`)
    }

    return data
  },

  async getByCategory(category: string, supabase?: any): Promise<Asset[]> {
    return this.getAll({ category }, supabase)
  },

  async getChildAssets(parentId: string, supabase?: any): Promise<Asset[]> {
    return this.getAll({ parent_asset_id: parentId }, supabase)
  },

  async create(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>, supabase?: any): Promise<Asset> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    const { data, error } = await supabase
      .from('assets')
      .insert([{
        ...asset,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating asset:', error)
      throw new Error(`Failed to create asset: ${error.message}`)
    }

    return data
  },

  async update(id: string, updates: Partial<Asset>, supabase?: any): Promise<Asset> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    const { data, error } = await supabase
      .from('assets')
      .update({ 
        ...updates, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating asset:', error)
      throw new Error(`Failed to update asset: ${error.message}`)
    }

    return data
  },

  async delete(id: string, supabase?: any): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting asset:', error)
      throw new Error(`Failed to delete asset: ${error.message}`)
    }
  },

  async updateStatus(id: string, status: Asset['status'], supabase?: any): Promise<Asset> {
    return this.update(id, { status }, supabase)
  },

  async getCategories(supabase?: any): Promise<string[]> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    const { data, error } = await supabase
      .from('assets')
      .select('category')
      .order('category')

    if (error) {
      console.error('Error fetching categories:', error)
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    // Get unique categories
    const categories = [...new Set(data?.map(item => item.category) || [])]
    return categories
  },

  async getLocations(supabase?: any): Promise<string[]> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    const { data, error } = await supabase
      .from('assets')
      .select('location')
      .order('location')

    if (error) {
      console.error('Error fetching locations:', error)
      throw new Error(`Failed to fetch locations: ${error.message}`)
    }

    // Get unique locations
    const locations = [...new Set(data?.map(item => item.location) || [])]
    return locations
  },

  async getAssetHierarchy(supabase?: any): Promise<Asset[]> {
    if (!supabase) {
      throw new Error('Supabase client required')
    }

    // Get all assets with their parent relationships
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching asset hierarchy:', error)
      throw new Error(`Failed to fetch asset hierarchy: ${error.message}`)
    }

    return data || []
  },

  async searchAssets(query: string, filters?: AssetFilters, supabase?: any): Promise<Asset[]> {
    return this.getAll({ ...filters, search: query }, supabase)
  }
}
