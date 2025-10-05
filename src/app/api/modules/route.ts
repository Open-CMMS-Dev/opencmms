import { getAllModules, getRegisteredModuleNames } from '@/lib/module-registry'
import '@/lib/modules' // Initialize modules

export async function GET() {
  const modules = getAllModules()
  const moduleNames = getRegisteredModuleNames()
  
  return Response.json({
    modules,
    moduleNames,
    count: moduleNames.length
  })
}
