export interface WorkOrder {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  location?: string
  category: string
  estimatedHours?: number
  actualHours?: number
}

export interface WorkOrderFormData {
  title: string
  description: string
  priority: WorkOrder['priority']
  assignedTo?: string
  dueDate?: string
  location?: string
  category: string
  estimatedHours?: number
}

export const WORK_ORDER_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
] as const

export const WORK_ORDER_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
] as const

export const WORK_ORDER_CATEGORIES = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'repair', label: 'Repair' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'installation', label: 'Installation' },
  { value: 'emergency', label: 'Emergency' }
] as const
