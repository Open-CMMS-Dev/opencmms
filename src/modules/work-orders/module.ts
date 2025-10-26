import type { ModuleDefinition } from "@/core/modules/types"
import { WorkOrdersOverviewPage } from "./ui/pages/overview"
import { WorkOrderDetailPage } from "./ui/pages/detail"

export const workOrdersModule: ModuleDefinition = {
  id: "work-orders",
  name: "Work Orders",
  version: "1.0.0",
  description: "Plan, assign, and track maintenance work across assets",
  dependencies: ["core"],

  routes: [
    {
      path: "/modules/work-orders",
      component: "WorkOrdersOverview",
      permissions: ["work-orders.read"],
    },
    {
      path: "/modules/work-orders/[id]",
      component: "WorkOrderDetail",
      permissions: ["work-orders.read"],
    },
  ],

  navigation: [
    {
      id: "work-orders.overview",
      title: "Work Orders",
      slug: [],
      icon: "IconTool",
      section: "modules",
      order: 30,
    },
  ],

  ui: {
    pages: [
      {
        id: "work-orders.overview",
        slug: [],
        component: WorkOrdersOverviewPage,
        title: "Work Orders Overview",
      },
      {
        id: "work-orders.detail",
        slug: ["[id]"],
        component: WorkOrderDetailPage,
      },
    ],
  },

  config: {
    autoAssign: false,
  },

  async initialize() {
    console.log("Work orders module initialized")
  },
}
