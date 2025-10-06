import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { workOrdersApi } from "@/modules/work-orders/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ModulePageProps } from "@/core/modules/types"

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  completed: "outline",
  "in-progress": "default",
  scheduled: "secondary",
  overdue: "destructive",
}

export async function WorkOrderDetailPage({ params }: ModulePageProps<{ id: string }>) {
  const supabase = await createClient()
  const workOrder = await workOrdersApi.getById(params.id, supabase)

  if (!workOrder) {
    notFound()
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{workOrder.title}</CardTitle>
              <CardDescription>
                {workOrder.description || "No description provided"}
              </CardDescription>
            </div>
            <Badge variant={statusVariants[workOrder.status] ?? "secondary"}>
              {workOrder.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
              <dd className="text-sm">{workOrder.priority || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Assignee</dt>
              <dd className="text-sm">{workOrder.assignee || "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Due Date</dt>
              <dd className="text-sm">
                {workOrder.due_date ? new Date(workOrder.due_date).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Asset</dt>
              <dd className="text-sm">{workOrder.asset_id || "—"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
