import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { ActionContext, ActionResult } from "@/core/modules/types"
import { assetsApi } from "./data"

export const assetActions = {
  async create(data: any, context: ActionContext): Promise<ActionResult> {
    try {
      const asset = await assetsApi.create(data, context.supabase)

      revalidatePath("/modules/assets")
      revalidatePath(`/modules/assets/categories/${data.category}`)

      return {
        success: true,
        data: asset,
        redirect: `/modules/assets/categories/${asset.category}/${asset.id}`,
        toast: {
          type: "success",
          message: `Asset "${asset.name}" created successfully`
        }
      }
    } catch (error: any) {
      console.error('Create asset error:', error)
      return {
        success: false,
        errors: { 
          _form: [error.message || "Failed to create asset"] 
        }
      }
    }
  },

  async update(data: any, context: ActionContext): Promise<ActionResult> {
    try {
      const asset = await assetsApi.update(data.id, data, context.supabase)

      revalidatePath("/modules/assets")
      revalidatePath(`/modules/assets/categories/${asset.category}`)
      revalidatePath(`/modules/assets/categories/${asset.category}/${asset.id}`)
      
      return {
        success: true,
        data: asset,
        toast: { 
          type: "success", 
          message: `Asset "${asset.name}" updated successfully` 
        }
      }
    } catch (error: any) {
      console.error('Update asset error:', error)
      return {
        success: false,
        errors: { 
          _form: [error.message || "Failed to update asset"] 
        }
      }
    }
  },

  async delete(data: any, context: ActionContext): Promise<ActionResult> {
    try {
      // Check if asset has related work orders
      const relatedWorkOrders = await context.supabase
        .from('work_orders')
        .select('id')
        .eq('asset_id', data.id)
        .limit(1)

      if (relatedWorkOrders.data?.length > 0) {
        return {
          success: false,
          errors: { 
            _form: ["Cannot delete asset with existing work orders"] 
          }
        }
      }

      await assetsApi.delete(data.id, context.supabase)

      revalidatePath("/modules/assets")

      return {
        success: true,
        redirect: "/modules/assets",
        toast: {
          type: "success",
          message: "Asset deleted successfully"
        }
      }
    } catch (error: any) {
      console.error('Delete asset error:', error)
      return {
        success: false,
        errors: { 
          _form: [error.message || "Failed to delete asset"] 
        }
      }
    }
  },

  async bulkUpdateStatus(data: any, context: ActionContext): Promise<ActionResult> {
    try {
      const { asset_ids, status } = data

      const { error } = await context.supabase
        .from('assets')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          updated_by: context.user.id 
        })
        .in('id', asset_ids)

      if (error) throw error

      revalidatePath("/modules/assets")
      
      return {
        success: true,
        toast: { 
          type: "success", 
          message: `Updated ${asset_ids.length} assets to ${status}` 
        }
      }
    } catch (error: any) {
      console.error('Bulk update status error:', error)
      return {
        success: false,
        errors: { 
          _form: [error.message || "Failed to update asset status"] 
        }
      }
    }
  }
}
