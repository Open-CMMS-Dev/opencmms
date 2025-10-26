import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { assetsApi } from "@/modules/assets/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ModulePageProps } from "@/core/modules/types"

export async function AssetCategoryPage({ params }: ModulePageProps<{ category: string }>) {
  const category = params.category
  const supabase = await createClient()

  const assets = await assetsApi.getByCategory(category, supabase)

  if (assets.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{category.replace(/-/g, " ")}</CardTitle>
            <CardDescription>
              No assets found for this category yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{category.replace(/-/g, " ")}</CardTitle>
          <CardDescription>
            Assets that belong to the {category.replace(/-/g, " ")} category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {asset.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                    {asset.status}
                  </Badge>
                  <Link href={`/modules/assets/categories/${category}/${asset.id}`}>
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
