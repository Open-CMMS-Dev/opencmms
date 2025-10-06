import { createClient } from '@/lib/supabase/server'
import { assetsApi } from '@/modules/assets/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionCards, KPICard } from "@/components/section-cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Package, Settings, Eye, TrendingUp, TrendingDown } from "lucide-react"

export default async function AssetsPage() {
  const supabase = await createClient()
  
  try {
    // Get all assets
    const assets = await assetsApi.getAll({}, supabase)
    
    // Get categories for summary
    const categories = await assetsApi.getCategories(supabase)
    
    // Calculate status statistics
    const statusStats = assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Create dynamic KPI cards based on actual data
    const assetKPIs: KPICard[] = [
      {
        id: "total-assets",
        title: "Total Assets",
        value: assets.length.toString(),
        description: "Total Assets",
        trend: {
          value: "+12.5%",
          direction: "up" as const,
          icon: <TrendingUp className="size-4" />
        },
        footer: {
          primary: "Growing asset inventory",
          secondary: "Asset portfolio expanding",
          icon: <Package className="size-4" />
        }
      },
      {
        id: "active-assets",
        title: "Active Assets",
        value: (statusStats.active || 0).toString(),
        description: "Active Assets",
        trend: {
          value: `${Math.round(((statusStats.active || 0) / assets.length) * 100)}%`,
          direction: (statusStats.active || 0) / assets.length > 0.8 ? "up" : "down" as const,
          icon: <TrendingUp className="size-4" />
        },
        footer: {
          primary: "Operational efficiency",
          secondary: `${assets.length - (statusStats.active || 0)} need attention`,
          icon: <div className="h-2 w-2 bg-green-500 rounded-full" />
        }
      },
      {
        id: "maintenance-assets",
        title: "In Maintenance",
        value: (statusStats.maintenance || 0).toString(),
        description: "Assets in Maintenance",
        trend: {
          value: statusStats.maintenance ? "-2" : "0",
          direction: "down" as const,
          icon: <TrendingDown className="size-4" />
        },
        footer: {
          primary: "Scheduled maintenance",
          secondary: "Proactive maintenance program",
          icon: <div className="h-2 w-2 bg-yellow-500 rounded-full" />
        }
      },
      {
        id: "asset-categories",
        title: "Categories",
        value: categories.length.toString(),
        description: "Asset Categories",
        trend: {
          value: "+1",
          direction: "up" as const,
          icon: <TrendingUp className="size-4" />
        },
        footer: {
          primary: "Diverse asset portfolio",
          secondary: "Well-organized categories",
          icon: <Settings className="size-4" />
        }
      }
    ]

    return (
      <>
        

        {/* Statistics Cards - Using Reusable Component */}
        <SectionCards cards={assetKPIs} />

<div className="px-4 lg:px-6 gap-4 flex-col flex">
        {/* Categories Overview */}
        

        {/* Recent Assets */}
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
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {asset.category} • {asset.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={asset.status === 'active' ? 'default' : 'secondary'}>
                      {asset.status}
                    </Badge>
                    <Link href={`/dashboard/assets/${asset.category}/${asset.id}`}>
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
      </>
    )
  } catch (error) {
    console.error('Error loading assets:', error)
    return (
      <div className="px-4 lg:px-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Error Loading Assets</h2>
          <p className="text-muted-foreground mt-2">
            There was an error loading the assets. Please try again later.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }
}
