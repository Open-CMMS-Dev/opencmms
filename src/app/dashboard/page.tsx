import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  
  return (
    
        <>
          <SectionCards />
          
          
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </>
  )
}