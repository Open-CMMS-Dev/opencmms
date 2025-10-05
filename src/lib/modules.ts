import { registerModule } from '@/lib/module-registry'
import { workOrdersModule } from '@/modules/work-orders'

// Server-side module registration
// This runs once when the module is imported
function initializeModules() {
  // Register all available modules
  registerModule('work-orders', workOrdersModule)
  
  // Add more modules here as they are created
  // registerModule('assets', assetsModule)
  // registerModule('maintenance', maintenanceModule)
  // registerModule('inventory', inventoryModule)
}

// Initialize modules immediately
initializeModules()

export { initializeModules }
