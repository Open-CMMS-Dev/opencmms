import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { assetsApi } from "@/modules/assets/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ModulePageProps } from "@/core/modules/types"

export async function AssetDetailPage({ params }: ModulePageProps<{ category: string; id: string }>) {
  const supabase = await createClient()

  const asset = await assetsApi.getById(params.id, supabase)

  if (!asset) {
    notFound()
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>
                {asset.category} • {asset.location}
              </CardDescription>
            </div>
            <Badge variant={asset.status === "active" ? "default" : "secondary"}>
              {asset.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Description</dt>
              <dd className="text-sm">{asset.description || "No description provided"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Serial Number</dt>
              <dd className="text-sm">{asset.serial_number || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Manufacturer</dt>
              <dd className="text-sm">{asset.manufacturer || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Model</dt>
              <dd className="text-sm">{asset.model || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Purchase Date</dt>
              <dd className="text-sm">{asset.purchase_date || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Warranty Expiry</dt>
              <dd className="text-sm">{asset.warranty_expiry || "—"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
