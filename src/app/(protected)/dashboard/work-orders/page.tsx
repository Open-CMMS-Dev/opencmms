import { SectionCards } from "@/components/section-cards"
import { getWorkOrdersKPIs } from "@/lib/kpi-configs"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Wrench, Calendar, AlertCircle } from "lucide-react"

export default async function WorkOrdersPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  // Get work orders-specific KPIs
  const workOrdersKPIs = getWorkOrdersKPIs()

  // Mock work orders data - in a real app, this would come from the database
  const mockWorkOrders = [
    {
      id: "WO-001",
      title: "HVAC System Maintenance",
      assetName: "Building A - HVAC Unit 1",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-10-08",
      assignee: "John Smith"
    },
    {
      id: "WO-002", 
      title: "Elevator Inspection",
      assetName: "Main Elevator Bank",
      priority: "medium",
      status: "scheduled",
      dueDate: "2025-10-10",
      assignee: "Jane Doe"
    },
    {
      id: "WO-003",
      title: "Generator Battery Replacement",
      assetName: "Emergency Generator",
      priority: "critical",
      status: "overdue",
      dueDate: "2025-10-05",
      assignee: "Mike Johnson"
    },
    {
      id: "WO-004",
      title: "Lighting System Check",
      assetName: "Parking Lot Lights",
      priority: "low",
      status: "completed",
      dueDate: "2025-10-01",
      assignee: "Sarah Wilson"
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'outline'
      case 'in-progress': return 'default'
      case 'scheduled': return 'secondary'
      case 'overdue': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">

      <SectionCards cards={workOrdersKPIs} />

      {/* Work Orders List */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
            <CardDescription>
              Active and recent work orders requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWorkOrders.map((workOrder) => (
                <div key={workOrder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium">{workOrder.title}</div>
                      <Badge variant={getPriorityColor(workOrder.priority) as any}>
                        {workOrder.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Asset: {workOrder.assetName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Assigned to: {workOrder.assignee} • Due: {workOrder.dueDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(workOrder.status) as any}>
                      {workOrder.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Emergency Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Submit urgent maintenance requests
              </p>
              <Button variant="destructive" className="w-full">
                <AlertCircle className="mr-2 h-4 w-4" />
                Emergency Request
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Plan preventive maintenance tasks
              </p>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Task
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Bulk Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage multiple work orders
              </p>
              <Button variant="outline" className="w-full">
                Bulk Edit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
