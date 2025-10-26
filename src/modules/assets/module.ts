import { z } from "zod"
import type { ModuleDefinition } from "@/core/modules/types"
import { assetsCommands } from "./commands"
import { assetActions } from "./actions"
import { AssetsOverviewPage } from "./ui/pages/overview"
import { AssetCategoriesPage } from "./ui/pages/categories"
import { AssetCategoryPage } from "./ui/pages/category"
import { AssetDetailPage } from "./ui/pages/detail"

// Zod schemas for validation
const createAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "inactive", "maintenance", "retired"]).default("active"),
  location: z.string().min(1, "Location is required"),
  serial_number: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchase_date: z.string().optional(),
  purchase_price: z.number().optional(),
  warranty_expiry: z.string().optional(),
  parent_asset_id: z.string().uuid().optional(),
  category_data: z.record(z.unknown()).optional()
})

const updateAssetSchema = createAssetSchema.extend({
  id: z.string().uuid()
})

const deleteAssetSchema = z.object({
  id: z.string().uuid()
})

export const assetsModule: ModuleDefinition = {
  id: "assets",
  name: "Asset Management",
  version: "1.0.0",
  description: "Dynamic asset lifecycle management with category-specific fields",
  dependencies: ["core"],
  
  routes: [
    {
      path: "/modules/assets",
      component: "AssetsOverview",
      permissions: ["assets.read"],
    },
    {
      path: "/modules/assets/categories",
      component: "AssetCategories",
      permissions: ["assets.read"],
    },
    {
      path: "/modules/assets/categories/[category]",
      component: "AssetCategory",
      permissions: ["assets.read"],
    },
    {
      path: "/modules/assets/categories/[category]/[id]",
      component: "AssetDetail",
      permissions: ["assets.read"],
    },
  ],

  navigation: [
    {
      id: "assets.overview",
      title: "Assets",
      slug: [],
      icon: "IconPackage",
      section: "modules",
      order: 10,
    },
    {
      id: "assets.categories",
      title: "Categories",
      slug: ["categories"],
      icon: "IconFolders",
      section: "modules",
      order: 20,
    },
  ],

  ui: {
    pages: [
      {
        id: "assets.overview",
        slug: [],
        component: AssetsOverviewPage,
        title: "Assets Overview",
      },
      {
        id: "assets.categories",
        slug: ["categories"],
        component: AssetCategoriesPage,
        title: "Asset Categories",
      },
      {
        id: "assets.category",
        slug: ["categories", "[category]"],
        component: AssetCategoryPage,
      },
      {
        id: "assets.detail",
        slug: ["categories", "[category]", "[id]"],
        component: AssetDetailPage,
      },
    ],
  },

  actions: [
    {
      id: "assets.create",
      name: "Create Asset",
      description: "Create a new asset with category-specific data",
      schema: createAssetSchema,
      handler: assetActions.create,
      permissions: ["assets.create"]
    },
    {
      id: "assets.update", 
      name: "Update Asset",
      description: "Update existing asset information",
      schema: updateAssetSchema,
      handler: assetActions.update,
      permissions: ["assets.update"]
    },
    {
      id: "assets.delete",
      name: "Delete Asset",
      description: "Delete an asset and its related data",
      schema: deleteAssetSchema,
      handler: assetActions.delete,
      permissions: ["assets.delete"]
    },
    {
      id: "assets.bulk-update-status",
      name: "Bulk Update Asset Status",
      description: "Update status for multiple assets",
      schema: z.object({
        asset_ids: z.array(z.string().uuid()),
        status: z.enum(["active", "inactive", "maintenance", "retired"])
      }),
      handler: assetActions.bulkUpdateStatus,
      permissions: ["assets.update"]
    }
  ],

  entities: [
    {
      id: "asset",
      name: "Asset",
      description: "Base asset entity with dynamic category data",
      category: "base",
      schema: {
        fields: [
          {
            name: "id",
            type: "uuid",
            label: "ID",
            required: true
          },
          {
            name: "name", 
            type: "string",
            label: "Asset Name",
            required: true
          },
          {
            name: "description",
            type: "text", 
            label: "Description"
          },
          {
            name: "category",
            type: "string",
            label: "Category", 
            required: true
          },
          {
            name: "status",
            type: "enum",
            label: "Status",
            required: true,
            validation: {
              options: ["active", "inactive", "maintenance", "retired"]
            }
          },
          {
            name: "location",
            type: "string",
            label: "Location",
            required: true
          },
          {
            name: "serial_number",
            type: "string",
            label: "Serial Number"
          },
          {
            name: "manufacturer",
            type: "string", 
            label: "Manufacturer"
          },
          {
            name: "model",
            type: "string",
            label: "Model"
          },
          {
            name: "purchase_date",
            type: "date",
            label: "Purchase Date"
          },
          {
            name: "purchase_price",
            type: "decimal",
            label: "Purchase Price"
          },
          {
            name: "warranty_expiry",
            type: "date",
            label: "Warranty Expiry"
          },
          {
            name: "parent_asset_id",
            type: "reference",
            label: "Parent Asset",
            validation: {
              referenceTable: "assets"
            }
          },
          {
            name: "category_data",
            type: "json",
            label: "Category-Specific Data"
          }
        ]
      },
      relationships: [
        {
          name: "work_orders",
          type: "one-to-many",
          targetEntity: "work_order",
          targetModule: "work-orders",
          foreignKey: "asset_id"
        },
        {
          name: "maintenance_schedules",
          type: "one-to-many", 
          targetEntity: "maintenance_schedule",
          targetModule: "maintenance",
          foreignKey: "asset_id"
        },
        {
          name: "child_assets",
          type: "one-to-many",
          targetEntity: "asset",
          targetModule: "assets",
          foreignKey: "parent_asset_id"
        }
      ]
    },

    // Category-specific entity schemas
    {
      id: "equipment-asset",
      name: "Equipment Asset",
      description: "Manufacturing and production equipment",
      category: "equipment",
      schema: {
        extends: "asset",
        fields: [
          {
            name: "capacity",
            type: "number",
            label: "Capacity"
          },
          {
            name: "power_rating",
            type: "decimal",
            label: "Power Rating (kW)"
          },
          {
            name: "operating_hours",
            type: "number",
            label: "Operating Hours",
            defaultValue: 0
          },
          {
            name: "last_maintenance_date",
            type: "date",
            label: "Last Maintenance"
          },
          {
            name: "next_maintenance_date", 
            type: "date",
            label: "Next Maintenance"
          },
          {
            name: "specifications",
            type: "json",
            label: "Technical Specifications"
          }
        ]
      }
    },

    {
      id: "vehicle-asset",
      name: "Vehicle Asset", 
      description: "Fleet vehicles and mobile equipment",
      category: "vehicle",
      schema: {
        extends: "asset",
        fields: [
          {
            name: "make",
            type: "string",
            label: "Make",
            required: true
          },
          {
            name: "year",
            type: "number",
            label: "Year",
            required: true
          },
          {
            name: "vin",
            type: "string",
            label: "VIN"
          },
          {
            name: "license_plate",
            type: "string", 
            label: "License Plate"
          },
          {
            name: "mileage",
            type: "number",
            label: "Mileage",
            defaultValue: 0
          },
          {
            name: "fuel_type",
            type: "enum",
            label: "Fuel Type",
            validation: {
              options: ["gasoline", "diesel", "electric", "hybrid"]
            }
          },
          {
            name: "last_service_date",
            type: "date",
            label: "Last Service"
          },
          {
            name: "next_service_mileage",
            type: "number",
            label: "Next Service Mileage"
          }
        ]
      }
    },

    {
      id: "facility-asset",
      name: "Facility Asset",
      description: "Buildings and infrastructure", 
      category: "facility",
      schema: {
        extends: "asset",
        fields: [
          {
            name: "building_type",
            type: "enum",
            label: "Building Type",
            validation: {
              options: ["office", "warehouse", "factory", "retail", "other"]
            }
          },
          {
            name: "square_footage",
            type: "number",
            label: "Square Footage"
          },
          {
            name: "construction_year",
            type: "number",
            label: "Construction Year"
          },
          {
            name: "hvac_system",
            type: "string",
            label: "HVAC System Type"
          },
          {
            name: "electrical_panel",
            type: "string",
            label: "Electrical Panel Info"
          },
          {
            name: "last_inspection_date",
            type: "date",
            label: "Last Inspection"
          },
          {
            name: "next_inspection_date",
            type: "date",
            label: "Next Inspection"
          }
        ]
      }
    }
  ],

  commands: [assetsCommands],

  config: {
    defaultStatus: "active",
    enableHierarchy: true,
    categorySpecificFields: true,
    enableBulkOperations: true
  },

  async initialize() {
    console.log("Assets module initialized")
    
    // Any module-specific initialization can go here
    // For example, creating default categories, setting up listeners, etc.
  }
}
