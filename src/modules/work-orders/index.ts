import { Module } from '@/lib/module-registry'
import { WorkOrderList } from './components/WorkOrderList'
import { WorkOrderView } from './components/WorkOrderView'
import { WorkOrderCreate } from './components/WorkOrderCreate'
import { WorkOrderListServer } from './components/WorkOrderListServer'
import { WorkOrderViewServer } from './components/WorkOrderViewServer'

export const workOrdersModule: Module = {
  name: 'work-orders',
  title: 'Work Orders',
  description: 'Manage maintenance work orders and tasks',
  icon: 'wrench',
  routes: [
    {
      path: 'index',
      component: WorkOrderList, // Legacy client component
      serverComponent: WorkOrderListServer, // New server component
      title: 'Work Orders',
      description: 'View and manage all work orders'
    },
    {
      path: 'create',
      component: WorkOrderCreate, // Still client component for forms
      title: 'Create Work Order',
      description: 'Create a new work order'
    },
    {
      path: 'view/:id',
      component: WorkOrderView, // Legacy client component
      serverComponent: WorkOrderViewServer, // New server component
      title: 'View Work Order',
      description: 'View work order details'
    }
  ]
}

export * from './types'
export * from './data'
export * from './components/WorkOrderList'
export * from './components/WorkOrderView'
export * from './components/WorkOrderCreate'
export * from './components/WorkOrderListServer'
export * from './components/WorkOrderViewServer'
