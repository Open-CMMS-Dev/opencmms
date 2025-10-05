import { WorkOrder } from './types'

// Mock data for work orders
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-001',
    title: 'Fix HVAC System in Building A',
    description: 'The HVAC system in Building A is not cooling properly. Temperature readings show inconsistent cooling across different zones.',
    status: 'open',
    priority: 'high',
    assignedTo: 'John Smith',
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-01T09:00:00Z',
    dueDate: '2025-10-08T17:00:00Z',
    location: 'Building A - Floor 2',
    category: 'maintenance',
    estimatedHours: 8
  },
  {
    id: 'WO-002',
    title: 'Replace Broken Window in Conference Room',
    description: 'Conference room 201 has a cracked window that needs immediate replacement for safety reasons.',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-09-28T14:30:00Z',
    updatedAt: '2025-10-02T10:15:00Z',
    dueDate: '2025-10-05T12:00:00Z',
    location: 'Building B - Conference Room 201',
    category: 'repair',
    estimatedHours: 3,
    actualHours: 2
  },
  {
    id: 'WO-003',
    title: 'Monthly Fire Safety Inspection',
    description: 'Conduct monthly fire safety inspection including fire extinguishers, smoke detectors, and emergency exits.',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Mike Wilson',
    createdAt: '2025-09-25T08:00:00Z',
    updatedAt: '2025-09-30T16:45:00Z',
    dueDate: '2025-09-30T17:00:00Z',
    location: 'All Buildings',
    category: 'inspection',
    estimatedHours: 6,
    actualHours: 5
  },
  {
    id: 'WO-004',
    title: 'Emergency Elevator Repair',
    description: 'Elevator in Building C is stuck between floors 3 and 4. Immediate attention required.',
    status: 'open',
    priority: 'critical',
    assignedTo: 'Emergency Team',
    createdAt: '2025-10-05T11:30:00Z',
    updatedAt: '2025-10-05T11:30:00Z',
    location: 'Building C - Elevator #2',
    category: 'emergency',
    estimatedHours: 4
  },
  {
    id: 'WO-005',
    title: 'Install New Security Cameras',
    description: 'Install 5 new security cameras in the parking lot as part of the security upgrade project.',
    status: 'open',
    priority: 'low',
    assignedTo: 'Security Team',
    createdAt: '2025-10-03T13:00:00Z',
    updatedAt: '2025-10-03T13:00:00Z',
    dueDate: '2025-10-15T17:00:00Z',
    location: 'Parking Lot Area',
    category: 'installation',
    estimatedHours: 12
  }
]

// Server-side API functions (no artificial delays for SSR)
export const workOrdersApi = {
  getAll: async (): Promise<WorkOrder[]> => {
    // In a real app, this would be a database query
    return mockWorkOrders
  },

  getById: async (id: string): Promise<WorkOrder | null> => {
    return mockWorkOrders.find(wo => wo.id === id) || null
  },

  create: async (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
    const newWorkOrder: WorkOrder = {
      ...data,
      id: `WO-${String(mockWorkOrders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockWorkOrders.push(newWorkOrder)
    return newWorkOrder
  },

  update: async (id: string, data: Partial<WorkOrder>): Promise<WorkOrder | null> => {
    const index = mockWorkOrders.findIndex(wo => wo.id === id)
    if (index === -1) return null
    
    mockWorkOrders[index] = {
      ...mockWorkOrders[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    return mockWorkOrders[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = mockWorkOrders.findIndex(wo => wo.id === id)
    if (index === -1) return false
    
    mockWorkOrders.splice(index, 1)
    return true
  }
}

// Client-side API functions (with artificial delays for demo)
export const clientWorkOrdersApi = {
  getAll: async (): Promise<WorkOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockWorkOrders
  },

  getById: async (id: string): Promise<WorkOrder | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockWorkOrders.find(wo => wo.id === id) || null
  },

  create: async (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return workOrdersApi.create(data)
  },

  update: async (id: string, data: Partial<WorkOrder>): Promise<WorkOrder | null> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return workOrdersApi.update(id, data)
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return workOrdersApi.delete(id)
  }
}
