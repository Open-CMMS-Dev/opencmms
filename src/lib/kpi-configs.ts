import { KPICard } from "@/components/section-cards"

// Dashboard Overview KPIs
export const getDashboardKPIs = (): KPICard[] => [
  {
    id: "total-assets",
    title: "Total Assets",
    value: "1,248",
    description: "Total Assets",
    trend: {
      value: "+12.5%",
      direction: "up" as const,
    },
    footer: {
      primary: "Growing asset inventory",
      secondary: "Added 142 assets this month",
    }
  },
  {
    id: "active-work-orders",
    title: "Active Work Orders",
    value: "84",
    description: "Active Work Orders",
    trend: {
      value: "-5%",
      direction: "down" as const,
    },
    footer: {
      primary: "Completion rate improving",
      secondary: "23 completed this week",
    }
  },
  {
    id: "critical-alerts",
    title: "Critical Alerts",
    value: "7",
    description: "Critical Alerts",
    trend: {
      value: "+2",
      direction: "up" as const,
    },
    footer: {
      primary: "Requires immediate attention",
      secondary: "HVAC systems need service",
    }
  },
  {
    id: "maintenance-efficiency",
    title: "Efficiency",
    value: "94.2%",
    description: "Maintenance Efficiency",
    trend: {
      value: "+2.1%",
      direction: "up" as const,
    },
    footer: {
      primary: "Above target performance",
      secondary: "Exceeds 90% target efficiency",
    }
  }
]

// Assets Module KPIs
export const getAssetsKPIs = (): KPICard[] => [
  {
    id: "total-asset-value",
    title: "Total Asset Value",
    value: "$2.4M",
    description: "Total Asset Value",
    trend: {
      value: "+8.5%",
      direction: "up" as const,
    },
    footer: {
      primary: "Asset portfolio growing",
      secondary: "Includes recent acquisitions",
    }
  },
  {
    id: "operational-assets",
    title: "Operational",
    value: "1,195",
    description: "Operational Assets",
    trend: {
      value: "+15",
      direction: "up" as const,
    },
    footer: {
      primary: "95.8% operational rate",
      secondary: "Well above industry average",
    }
  },
  {
    id: "maintenance-due",
    title: "Maintenance Due",
    value: "23",
    description: "Assets Requiring Maintenance",
    trend: {
      value: "-8",
      direction: "down" as const,
    },
    footer: {
      primary: "Proactive scheduling working",
      secondary: "Reduced from 31 last week",
    }
  },
  {
    id: "asset-downtime",
    title: "Avg Downtime",
    value: "2.3h",
    description: "Average Monthly Downtime",
    trend: {
      value: "-0.5h",
      direction: "down" as const,
    },
    footer: {
      primary: "Downtime decreasing",
      secondary: "Target: under 3 hours",
    }
  }
]

// Work Orders Module KPIs  
export const getWorkOrdersKPIs = (): KPICard[] => [
  {
    id: "open-work-orders",
    title: "Open Orders",
    value: "84",
    description: "Open Work Orders",
    trend: {
      value: "+12",
      direction: "up" as const,
    },
    footer: {
      primary: "Higher workload this month",
      secondary: "Seasonal maintenance increase",
    }
  },
  {
    id: "completed-orders",
    title: "Completed",
    value: "156",
    description: "Completed This Month",
    trend: {
      value: "+23%",
      direction: "up" as const,
    },
    footer: {
      primary: "Productivity improving",
      secondary: "Beat last month by 23%",
    }
  },
  {
    id: "overdue-orders",
    title: "Overdue",
    value: "8",
    description: "Overdue Work Orders",
    trend: {
      value: "-3",
      direction: "down" as const,
    },
    footer: {
      primary: "Overdue count decreasing",
      secondary: "Down from 11 last week",
    }
  },
  {
    id: "avg-completion-time",
    title: "Avg Completion",
    value: "3.2d",
    description: "Average Completion Time",
    trend: {
      value: "-0.8d",
      direction: "down" as const,
    },
    footer: {
      primary: "Faster turnaround times",
      secondary: "Target: under 4 days",
    }
  }
]

// Maintenance Module KPIs
export const getMaintenanceKPIs = (): KPICard[] => [
  {
    id: "preventive-compliance",
    title: "PM Compliance",
    value: "87%",
    description: "Preventive Maintenance Compliance",
    trend: {
      value: "+5%",
      direction: "up" as const,
    },
    footer: {
      primary: "Compliance improving",
      secondary: "Target: 90% compliance",
    }
  },
  {
    id: "scheduled-maintenance",
    title: "Scheduled",
    value: "45",
    description: "Scheduled Maintenance Tasks",
    trend: {
      value: "+8",
      direction: "up" as const,
    },
    footer: {
      primary: "Proactive scheduling",
      secondary: "Next 30 days planned",
    }
  },
  {
    id: "emergency-repairs",
    title: "Emergency",
    value: "3",
    description: "Emergency Repairs",
    trend: {
      value: "-2",
      direction: "down" as const,
    },
    footer: {
      primary: "Emergency calls reducing",
      secondary: "Preventive maintenance working",
    }
  },
  {
    id: "maintenance-cost",
    title: "Cost/Asset",
    value: "$142",
    description: "Maintenance Cost per Asset",
    trend: {
      value: "-$18",
      direction: "down" as const,
    },
    footer: {
      primary: "Cost optimization working",
      secondary: "15% reduction this quarter",
    }
  }
]
