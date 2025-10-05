import { notFound } from 'next/navigation'
import { workOrdersApi } from '../data'
import { WorkOrderViewClient } from '@/modules/work-orders/components/WorkOrderViewClient'

interface WorkOrderViewServerProps {
  workOrderId: string
}

export async function WorkOrderViewServer({ workOrderId }: WorkOrderViewServerProps) {
  // Server-side data fetching - no loading state needed!
  const workOrder = await workOrdersApi.getById(workOrderId)

  if (!workOrder) {
    notFound()
  }

  return <WorkOrderViewClient workOrder={workOrder} />
}
