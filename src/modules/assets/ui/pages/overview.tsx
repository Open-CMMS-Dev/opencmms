import { assetsApi } from "@/modules/assets/data"
import { createClient } from "@/lib/supabase/server"
import { SectionCards, type KPICard } from "@/components/section-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Settings, TrendingDown, TrendingUp } from "lucide-react"

export async function AssetsOverviewPage() {
  const supabase = await createClient()

  try {
    const [assets, categories] = await Promise.all([
      assetsApi.getAll({}, supabase),
      assetsApi.getCategories(supabase),
    ])

    const statusStats = assets.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1
      return acc
    }, {})

    const totalAssets = assets.length || 1

    const assetKPIs: KPICard[] = [
      {
        id: "total-assets",
        title: "Total Assets",
        value: assets.length.toString(),
        description: "Total Assets",
        trend: {
          value: "+12.5%",
          direction: "up",
          icon: <TrendingUp className="size-4" />,
        },
        footer: {
          primary: "Growing asset inventory",
          secondary: "Asset portfolio expanding",
          icon: <Package className="size-4" />,
        },
      },
      {
        id: "active-assets",
        title: "Active Assets",
        value: (statusStats.active || 0).toString(),
        description: "Active Assets",
        trend: {
          value: `${Math.round(((statusStats.active || 0) / totalAssets) * 100)}%`,
          direction: (statusStats.active || 0) / totalAssets > 0.8 ? "up" : "down",
          icon: <TrendingUp className="size-4" />,
        },
        footer: {
          primary: "Operational efficiency",
          secondary: `${assets.length - (statusStats.active || 0)} need attention`,
          icon: <div className="h-2 w-2 rounded-full bg-green-500" />,
        },
      },
      {
        id: "maintenance-assets",
        title: "In Maintenance",
        value: (statusStats.maintenance || 0).toString(),
        description: "Assets in Maintenance",
        trend: {
          value: statusStats.maintenance ? "-2" : "0",
          direction: "down",
          icon: <TrendingDown className="size-4" />,
        },
        footer: {
          primary: "Scheduled maintenance",
          secondary: "Proactive maintenance program",
          icon: <div className="h-2 w-2 rounded-full bg-yellow-500" />,
        },
      },
      {
        id: "asset-categories",
        title: "Categories",
        value: categories.length.toString(),
        description: "Asset Categories",
        trend: {
          value: "+1",
          direction: "up",
          icon: <TrendingUp className="size-4" />,
        },
        footer: {
          primary: "Diverse asset portfolio",
          secondary: "Well-organized categories",
          icon: <Settings className="size-4" />,
        },
      },
    ]

    return (
      <div className="flex flex-col gap-6">
        <SectionCards cards={assetKPIs} />

        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
              <CardDescription>
                Recently added or updated assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.slice(0, 5).map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.category} • {asset.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                        {asset.status}
                      </Badge>
                      <Link href={`/modules/assets/categories/${asset.category}/${asset.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading assets:", error)
    return (
      <div className="px-4 lg:px-6">
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold">Error Loading Assets</h2>
          <p className="mt-2 text-muted-foreground">
            There was an error loading the assets. Please try again later.
          </p>
          <Button asChild className="mt-4">
            <Link href="/modules">Return to Modules</Link>
          </Button>
        </div>
      </div>
    )
  }
}
