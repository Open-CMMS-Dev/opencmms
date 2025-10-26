import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/site-header'
import { moduleRegistry } from '@/core/modules/registry'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  const moduleNavigation = moduleRegistry.getSidebarNavigation()

  const navigation = {
    primary: [
      { id: 'dashboard', title: 'Dashboard', href: '/dashboard', icon: 'IconDashboard' },
      ...moduleNavigation
        .filter((item) => item.section === 'primary')
        .map((item) => ({ id: item.id, title: item.title, href: item.href, icon: item.icon })),
    ],
    modules: [
      { id: 'modules.index', title: 'All Modules', href: '/modules', icon: 'IconLayoutGrid' },
      ...moduleNavigation
        .filter((item) => item.section === 'modules')
        .map((item) => ({ id: item.id, title: item.title, href: item.href, icon: item.icon })),
    ],
    secondary: [
      ...moduleNavigation
        .filter((item) => item.section === 'secondary')
        .map((item) => ({ id: item.id, title: item.title, href: item.href, icon: item.icon })),
      { id: 'settings', title: 'Settings', href: '/settings', icon: 'IconSettings' },
      { id: 'help', title: 'Get Help', href: '/help', icon: 'IconHelp' },
    ],
  }

  // Format user data for the sidebar
  const sidebarUser = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name,
    avatar: user.user_metadata?.avatar_url,
  }

  return (
    <SidebarProvider>
      <AppSidebar user={sidebarUser} navigation={navigation} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
