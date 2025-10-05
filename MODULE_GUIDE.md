# CMMS Work Orders Module - Proof of Concept

This is a simple module system proof of concept for a CMMS (Computerized Maintenance Management System) with a focus on Work Orders management.

## Architecture Overview

### 1. Module Registry System (`/src/lib/module-registry.ts`)
- Central registry for managing modules and their routes
- Type-safe module and route definitions
- Dynamic module resolution and navigation

### 2. Work Orders Module (`/src/modules/work-orders/`)
- **Types**: WorkOrder interface, form data types, and constants
- **Data**: Mock API with CRUD operations (simulates real backend)
- **Components**: List, View, and Create components for work orders
- **Index**: Module registration and exports

### 3. Dynamic Routing (`/src/app/dashboard/[...module]/page.tsx`)
- Handles all module routes dynamically
- Resolves module and route from URL segments
- Renders appropriate components based on route patterns

## Features Implemented

### Work Orders Module
1. **List View** (`/dashboard/work-orders`)
   - Display all work orders in a card grid
   - Search functionality
   - Status and priority badges
   - Navigation to create and view

2. **Create View** (`/dashboard/work-orders/create`)
   - Form to create new work orders
   - Validation and type safety
   - Select dropdowns for priority/category
   - Date and time inputs

3. **Detail View** (`/dashboard/work-orders/view/:id`)
   - Full work order details
   - Activity timeline
   - Edit and delete actions
   - Responsive layout

## Routing Examples

```
/dashboard/work-orders           → WorkOrderList
/dashboard/work-orders/create    → WorkOrderCreate  
/dashboard/work-orders/view/WO-001 → WorkOrderView
```

## Module Structure

```
src/modules/work-orders/
├── index.ts                 # Module registration
├── types.ts                 # TypeScript interfaces
├── data.ts                  # Mock API and data
└── components/
    ├── WorkOrderList.tsx    # List all work orders
    ├── WorkOrderView.tsx    # View single work order
    └── WorkOrderCreate.tsx  # Create new work order
```

## How to Extend

### Adding a New Module (e.g., Assets)

1. **Create module structure**:
   ```
   src/modules/assets/
   ├── index.ts
   ├── types.ts
   ├── data.ts
   └── components/
   ```

2. **Register the module**:
   ```typescript
   // In [...module]/page.tsx
   import { assetsModule } from '@/modules/assets'
   registerModule('assets', assetsModule)
   ```

3. **Add navigation**:
   ```tsx
   <Link href="/dashboard/assets">Assets</Link>
   ```

### Adding New Routes to Existing Module

```typescript
// In module index.ts
export const workOrdersModule: Module = {
  // ...
  routes: [
    // existing routes...
    {
      path: 'reports',
      component: WorkOrderReports,
      title: 'Work Order Reports'
    }
  ]
}
```

## Benefits of This Approach

1. **Modularity**: Each module is self-contained
2. **Type Safety**: Full TypeScript support
3. **Dynamic**: Routes resolved at runtime
4. **Scalable**: Easy to add new modules and routes
5. **Maintainable**: Clear separation of concerns

## Testing the Module

1. Navigate to `/dashboard`
2. Click on "Work Orders" in the modules section
3. Try creating, viewing, and navigating between work orders

The system uses mock data and simulated API delays to demonstrate real-world behavior.
