"use client"

import * as React from "react"
import { IconInnerShadowTop } from "@tabler/icons-react"

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

interface SidebarNavItem {
  id: string
  title: string
  href: string
  icon?: string
}

interface SidebarNavigationSections {
  primary: SidebarNavItem[]
  modules: SidebarNavItem[]
  secondary: SidebarNavItem[]
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User | null
  navigation: SidebarNavigationSections
}

export function AppSidebar({ user, navigation, ...props }: AppSidebarProps) {
  const { primary, modules, secondary } = navigation

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
        <NavMain items={primary} />
        <NavDocuments items={modules.map((item) => ({ name: item.title, url: item.href, icon: item.icon }))} label="Modules" />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
