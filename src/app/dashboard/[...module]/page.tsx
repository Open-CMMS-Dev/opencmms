import { notFound } from 'next/navigation'
import { getModule, resolveModulePath } from '@/lib/module-registry'
import '@/lib/modules' // This initializes all modules server-side

interface ModulePageProps {
  params: {
    module: string[]
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  // Parse the module and route from the URL segments
  const resolved = resolveModulePath(params.module)
  
  if (!resolved) {
    notFound()
  }

  const module = getModule(resolved.module)
  
  if (!module) {
    notFound()
  }

  // Find the matching route
  let matchedRoute = module.routes.find(route => route.path === resolved.route)
  
  // Handle dynamic routes like view/:id
  if (!matchedRoute && resolved.route.includes('/')) {
    const routeParts = resolved.route.split('/')
    const routePattern = routeParts[0] + '/:id'
    matchedRoute = module.routes.find(route => route.path === routePattern)
  }
  
  if (!matchedRoute) {
    notFound()
  }

  // Extract route parameters for dynamic routes
  const routeParams: Record<string, string> = {}
  if (resolved.route.includes('/')) {
    const routeParts = resolved.route.split('/')
    if (matchedRoute.path.includes('/:id')) {
      routeParams.id = routeParts[1]
    }
  }

  // Use server component when available, otherwise fall back to client component
  const Component = matchedRoute.serverComponent || matchedRoute.component

  // Render server components with proper props
  if (resolved.module === 'work-orders') {
    if (resolved.route === 'index' && matchedRoute.serverComponent) {
      return <Component />
    } else if (resolved.route === 'create') {
      // Create is still a client component for forms
      const { ModuleClient } = require('./module-renderer')
      return (
        <ModuleClient
          module={resolved.module}
          route={resolved.route}
          routeParams={routeParams}
          urlSegments={params.module}
          component={matchedRoute.component}
        />
      )
    } else if (resolved.route.startsWith('view/') && matchedRoute.serverComponent) {
      const workOrderId = routeParams.id
      return <Component workOrderId={workOrderId} />
    }
  }

  // Fallback to client component rendering
  const { ModuleClient } = require('./module-renderer')
  return (
    <ModuleClient
      module={resolved.module}
      route={resolved.route}
      routeParams={routeParams}
      urlSegments={params.module}
      component={matchedRoute.component}
    />
  )
}
