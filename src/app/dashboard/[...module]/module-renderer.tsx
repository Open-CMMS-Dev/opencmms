'use client'

import { useRouter } from 'next/navigation'
import { ComponentType } from 'react'

interface ModuleClientProps {
  module: string
  route: string
  routeParams: Record<string, string>
  urlSegments: string[]
  component: ComponentType<any>
}

export function ModuleClient({
  module,
  route,
  routeParams,
  urlSegments,
  component: Component
}: ModuleClientProps) {
  const router = useRouter()

  const handleNavigate = (path: string) => {
    const moduleName = urlSegments[0]
    if (path === '') {
      router.push(`/dashboard/${moduleName}`)
    } else {
      router.push(`/dashboard/${moduleName}/${path}`)
    }
  }

  // Render the component with appropriate props based on module type
  if (module === 'work-orders') {
    if (route === 'index') {
      return <Component onNavigate={handleNavigate} />
    } else if (route === 'create') {
      return <Component onNavigate={handleNavigate} />
    } else if (route.startsWith('view/')) {
      const workOrderId = routeParams.id
      return <Component workOrderId={workOrderId} onNavigate={handleNavigate} />
    } else if (route.startsWith('edit/')) {
      const workOrderId = routeParams.id
      return <Component workOrderId={workOrderId} onNavigate={handleNavigate} />
    }
  }

  // Default render for other modules or routes
  return <Component onNavigate={handleNavigate} {...routeParams} />
}
