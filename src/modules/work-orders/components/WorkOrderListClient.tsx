'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkOrder } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface WorkOrderListClientProps {
  initialWorkOrders: WorkOrder[]
}

const statusColors = {
  open: 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-gray-500'
}

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
}

export function WorkOrderListClient({ initialWorkOrders }: WorkOrderListClientProps) {
  const [workOrders] = useState<WorkOrder[]>(initialWorkOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleNavigate = (path: string) => {
    if (path === '') {
      router.push('/dashboard/work-orders')
    } else {
      router.push(`/dashboard/work-orders/${path}`)
    }
  }

  const filteredWorkOrders = workOrders.filter(wo =>
    wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage and track maintenance work orders
          </p>
        </div>
        <Button onClick={() => handleNavigate('create')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Work Order
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Work Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkOrders.map((workOrder) => (
          <Card 
            key={workOrder.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleNavigate(`view/${workOrder.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {workOrder.id} • {workOrder.category}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge 
                    className={`${statusColors[workOrder.status]} text-white text-xs`}
                  >
                    {workOrder.status.replace('-', ' ')}
                  </Badge>
                  <Badge 
                    className={`${priorityColors[workOrder.priority]} text-white text-xs`}
                  >
                    {workOrder.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {workOrder.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{workOrder.assignedTo}</span>
                <span>{workOrder.location}</span>
              </div>
              {workOrder.dueDate && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Due: {new Date(workOrder.dueDate).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No work orders found</p>
        </div>
      )}
    </div>
  )
}
