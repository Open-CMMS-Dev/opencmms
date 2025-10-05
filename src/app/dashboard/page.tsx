import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllModules } from "@/lib/module-registry"
import '@/lib/modules' // Initialize modules server-side
import Link from "next/link"
import { Wrench, Settings, Package, Users } from "lucide-react"

import data from "./data.json"

// Icon mapping for modules
const moduleIcons = {
  'work-orders': Wrench,
  'assets': Package,
  'users': Users,
  'settings': Settings,
}

export default function Page() {
  const modules = getAllModules()
  
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          
          {/* Module Quick Access */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>CMMS Modules</CardTitle>
                <CardDescription>Quick access to system modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.values(modules).map((module) => {
                    const IconComponent = moduleIcons[module.name as keyof typeof moduleIcons] || Settings
                    return (
                      <Link key={module.name} href={`/dashboard/${module.name}`}>
                        <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-accent">
                          <IconComponent className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">{module.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{module.description}</div>
                          </div>
                        </Button>
                      </Link>
                    )
                  })}
                  
                  {/* Placeholder for future modules */}
                  {Object.keys(modules).length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No modules available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  )
}