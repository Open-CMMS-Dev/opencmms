'use client'

import { useRouter } from 'next/navigation'
import { WorkOrder } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Clock, User, MapPin, Calendar } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface WorkOrderViewClientProps {
  workOrder: WorkOrder
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

export function WorkOrderViewClient({ workOrder }: WorkOrderViewClientProps) {
  const router = useRouter()

  const handleNavigate = (path: string) => {
    if (path === '') {
      router.push('/dashboard/work-orders')
    } else {
      router.push(`/dashboard/work-orders/${path}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleNavigate('')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workOrder.title}</h1>
            <p className="text-muted-foreground">{workOrder.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => handleNavigate(`edit/${workOrder.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center gap-4">
        <Badge className={`${statusColors[workOrder.status]} text-white`}>
          {workOrder.status.replace('-', ' ')}
        </Badge>
        <Badge className={`${priorityColors[workOrder.priority]} text-white`}>
          {workOrder.priority} priority
        </Badge>
        <Badge variant="outline">{workOrder.category}</Badge>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Description */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {workOrder.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-muted-foreground">
                    {workOrder.assignedTo || 'Unassigned'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {workOrder.location || 'Not specified'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(workOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {workOrder.dueDate && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workOrder.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Est: {workOrder.estimatedHours || 0}h
                    {workOrder.actualHours && ` • Actual: ${workOrder.actualHours}h`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline / History */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Recent updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Work order created</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(workOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {workOrder.updatedAt !== workOrder.createdAt && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Work order updated</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(workOrder.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
