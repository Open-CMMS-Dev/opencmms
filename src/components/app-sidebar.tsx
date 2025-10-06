"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconPackage,
  IconTool,
  IconCalendar,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User | null
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navMainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Assets",
      url: "/dashboard/assets",
      icon: IconPackage,
    },
    {
      title: "Work Orders", 
      url: "/dashboard/work-orders",
      icon: IconTool,
    },
    {
      title: "Maintenance",
      url: "/dashboard/maintenance",
      icon: IconCalendar,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
  ]

  const moduleItems = [
    {
      name: "Asset Categories",
      url: "/dashboard/assets/categories",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Inventory",
      url: "/dashboard/inventory",
      icon: IconFileWord,
    },
  ]

  const navSecondaryItems = [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ]

  // Format user data for NavUser component
  const userData = user ? {
    name: user.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.avatar || `/avatars/${user.email?.split('@')[0]}.jpg`,
  } : {
    name: 'Guest',
    email: '',
    avatar: '/avatars/guest.jpg',
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">OpenCMMS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavDocuments items={moduleItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
