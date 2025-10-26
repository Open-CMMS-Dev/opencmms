import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SectionCards, type KPICard } from "@/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { workOrdersApi } from "@/modules/work-orders/data"

const priorityVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  critical: "destructive",
  high: "destructive",
  medium: "default",
  low: "secondary",
}

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  completed: "outline",
  "in-progress": "default",
  scheduled: "secondary",
  overdue: "destructive",
}

export async function WorkOrdersOverviewPage({ searchParams = {} }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = await createClient()

  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : undefined
  const assetFilter = typeof searchParams.assetId === "string" ? searchParams.assetId : undefined

  const workOrders = await workOrdersApi.getAll({ status: statusFilter, assetId: assetFilter }, supabase)

  const total = workOrders.length
  const statusCounts = workOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  const cards: KPICard[] = [
    {
      id: "work-orders-total",
      title: "Open Orders",
      value: (statusCounts["open"] ?? total).toString(),
      description: "Open work orders",
      trend: {
        value: total ? `-${Math.max(0, (statusCounts.completed ?? 0)).toString()}` : "0",
        direction: (statusCounts.completed ?? 0) > 0 ? "down" : "up",
      },
      footer: {
        primary: `${total} total work orders`,
        secondary: `${statusCounts.completed ?? 0} completed recently`,
      },
    },
    {
      id: "work-orders-active",
      title: "In Progress",
      value: (statusCounts["in-progress"] ?? 0).toString(),
      description: "Active work orders",
      trend: {
        value: `${statusCounts["in-progress"] ?? 0}`,
        direction: (statusCounts["in-progress"] ?? 0) > 5 ? "up" : "down",
      },
      footer: {
        primary: `${statusCounts["scheduled"] ?? 0} scheduled next`,
        secondary: `${statusCounts.overdue ?? 0} overdue`,
      },
    },
    {
      id: "work-orders-completed",
      title: "Completed",
      value: (statusCounts.completed ?? 0).toString(),
      description: "Completed this period",
      trend: {
        value: "+5",
        direction: "up",
      },
      footer: {
        primary: `${statusCounts.completed ?? 0} closed recently`,
        secondary: `${statusCounts["in-progress"] ?? 0} still active`,
      },
    },
    {
      id: "work-orders-overdue",
      title: "Overdue",
      value: (statusCounts.overdue ?? 0).toString(),
      description: "Overdue work orders",
      trend: {
        value: `${statusCounts.overdue ?? 0}`,
        direction: (statusCounts.overdue ?? 0) > 0 ? "up" : "down",
      },
      footer: {
        primary: `${statusCounts.overdue ?? 0} need attention`,
        secondary: `${statusCounts.scheduled ?? 0} scheduled`,
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <SectionCards cards={cards} />

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
            <CardDescription>
              Active and recently updated work orders requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrders.slice(0, 8).map((workOrder) => (
                <div
                  key={workOrder.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <div className="font-medium">{workOrder.title}</div>
                      {workOrder.priority && (
                        <Badge variant={priorityVariants[workOrder.priority] ?? "secondary"}>
                          {workOrder.priority}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {workOrder.assignee ? `Assigned to ${workOrder.assignee}` : "Unassigned"}
                    </div>
                    {workOrder.due_date && (
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(workOrder.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariants[workOrder.status] ?? "secondary"}>
                      {workOrder.status}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/modules/work-orders/${workOrder.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {workOrders.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No work orders found. Try adjusting your filters or creating a new work order.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
