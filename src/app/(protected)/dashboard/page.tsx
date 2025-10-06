import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { getDashboardKPIs } from "@/lib/kpi-configs"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import data from "./data.json"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  // Get dashboard KPIs - in a real app, these would come from the database
  const dashboardKPIs = getDashboardKPIs()

  return (
    <>
      <SectionCards cards={dashboardKPIs} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      
      <DataTable data={data} />
    </>
  )
}
