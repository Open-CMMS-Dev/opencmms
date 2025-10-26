import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { assetsApi } from "@/modules/assets/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export async function AssetCategoriesPage() {
  const supabase = await createClient()

  try {
    const assets = await assetsApi.getAll({}, supabase)

    const categoryStats = assets.reduce<Record<string, { count: number; active: number }>>((acc, asset) => {
      const key = asset.category || "uncategorized"
      const entry = acc[key] ?? { count: 0, active: 0 }
      entry.count += 1
      if (asset.status === "active") {
        entry.active += 1
      }
      acc[key] = entry
      return acc
    }, {})

    const categories = Object.entries(categoryStats).sort(([a], [b]) => a.localeCompare(b))

    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
            <CardDescription>
              Explore assets grouped by their functional categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(([category, stats]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="font-medium capitalize">{category.replace(/-/g, " ")}</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.count} assets • {stats.active} active
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{stats.count}</Badge>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/modules/assets/categories/${category}`}>
                        View assets
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading asset categories:", error)
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
            <CardDescription>
              Unable to load categories from the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please try again later or contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
