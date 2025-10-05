import { workOrdersApi } from '../data'
import { WorkOrderListClient } from '@/modules/work-orders/components/WorkOrderListClient'

export async function WorkOrderListServer() {
  // Server-side data fetching - no loading state needed!
  const workOrders = await workOrdersApi.getAll()

  return <WorkOrderListClient initialWorkOrders={workOrders} />
}
