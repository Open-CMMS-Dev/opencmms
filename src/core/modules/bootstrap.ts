import { moduleRegistry } from "@/core/modules/registry"
import { assetsModule } from "@/modules/assets/module"

// Core module that provides basic system functionality
const coreModule = {
  id: "core",
  name: "Core System",
  version: "1.0.0",
  description: "Core system functionality and base components",
  routes: [
    {
      path: "/dashboard",
      component: "Dashboard",
      permissions: ["dashboard.read"]
    }
  ],
  config: {
    systemName: "OpenCMMS",
    version: "1.0.0"
  },
  async initialize() {
    console.log("Core module initialized")
  }
}

/**
 * Initialize all system modules
 * This should be called during application startup
 */
export async function initializeModules() {
  console.log("Starting module initialization...")
  
  try {
    // Register core module first
    moduleRegistry.register(coreModule)
    
    // Register feature modules
    moduleRegistry.register(assetsModule)
    
    // Add more modules here as they're created:
    // moduleRegistry.register(workOrdersModule)
    // moduleRegistry.register(maintenanceModule)
    // moduleRegistry.register(inventoryModule)
    
    // Initialize all modules (handles dependencies, commands, etc.)
    await moduleRegistry.initialize()
    
    console.log("✅ All modules initialized successfully")
    
    // Log registered modules for debugging
    const modules = moduleRegistry.getAllModules()
    console.log(`📦 Registered modules: ${modules.map(m => m.name).join(', ')}`)
    
  } catch (error) {
    console.error("❌ Module initialization failed:", error)
    throw error
  }
}

/**
 * Get system information including registered modules
 */
export function getSystemInfo() {
  const modules = moduleRegistry.getAllModules()
  
  return {
    systemName: "OpenCMMS",
    version: "1.0.0",
    modules: modules.map(module => ({
      id: module.id,
      name: module.name,
      version: module.version,
      description: module.description
    }))
  }
}
