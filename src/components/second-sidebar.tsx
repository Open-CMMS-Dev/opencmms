import * as React from "react"
import {
  BookOpen,
  Code,
  FileText,
  Settings,
  Users,
  Rocket,
  Database,
  Palette,
  Shield,
  Zap,
  TestTube,
  Cpu,
  Globe,
  PaintBucket,
  Activity,
  Cog,
  Terminal,
  Monitor,
  Heart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      icon: Rocket,
      items: [
        {
          title: "Installation",
          url: "#",
          icon: Settings,
        },
        {
          title: "Project Structure",
          url: "#",
          icon: FileText,
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      icon: Code,
      items: [
        {
          title: "Routing",
          url: "#",
          icon: Globe,
        },
        {
          title: "Data Fetching",
          url: "#",
          icon: Database,
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
          icon: Monitor,
        },
        {
          title: "Caching",
          url: "#",
          icon: Zap,
        },
        {
          title: "Styling",
          url: "#",
          icon: Palette,
        },
        {
          title: "Optimizing",
          url: "#",
          icon: Activity,
        },
        {
          title: "Configuring",
          url: "#",
          icon: Cog,
        },
        {
          title: "Testing",
          url: "#",
          icon: TestTube,
        },
        {
          title: "Authentication",
          url: "#",
          icon: Shield,
        },
        {
          title: "Deploying",
          url: "#",
          icon: Rocket,
        },
        {
          title: "Upgrading",
          url: "#",
          icon: PaintBucket,
        },
        {
          title: "Examples",
          url: "#",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Components",
          url: "#",
          icon: Code,
        },
        {
          title: "File Conventions",
          url: "#",
          icon: FileText,
        },
        {
          title: "Functions",
          url: "#",
          icon: Zap,
        },
        {
          title: "next.config.js Options",
          url: "#",
          icon: Settings,
        },
        {
          title: "CLI",
          url: "#",
          icon: Terminal,
        },
        {
          title: "Edge Runtime",
          url: "#",
          icon: Cpu,
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      icon: Cpu,
      items: [
        {
          title: "Accessibility",
          url: "#",
          icon: Heart,
        },
        {
          title: "Fast Refresh",
          url: "#",
          icon: Zap,
        },
        {
          title: "Next.js Compiler",
          url: "#",
          icon: Cog,
        },
        {
          title: "Supported Browsers",
          url: "#",
          icon: Globe,
        },
        {
          title: "Turbopack",
          url: "#",
          icon: Activity,
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Contribution Guide",
          url: "#",
          icon: Heart,
        },
      ],
    },
  ],
}

export function SecondSidebar({ 
  collapsible = "icon",
  className,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  return (
    <Sidebar 
      collapsible={collapsible} 
      className={cn("hidden md:flex", className)}
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url} className="font-medium">
                        <Icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const SubIcon = subItem.icon
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                              >
                                <a href={subItem.url}>
                                  <SubIcon />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
