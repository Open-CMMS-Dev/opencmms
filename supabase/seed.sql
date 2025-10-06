-- Seed data for OpenCMMS
-- This file contains initial data for the modular CMMS system

-- Insert core modules
INSERT INTO modules (name, version, description, dependencies, config) VALUES
('core', '1.0.0', 'Core system functionality', '[]', '{}'),
('assets', '1.0.0', 'Asset management module', '["core"]', '{}'),
('work-orders', '1.0.0', 'Work order management module', '["core", "assets"]', '{}'),
('maintenance', '1.0.0', 'Maintenance scheduling module', '["core", "assets"]', '{}');

-- Insert user roles
INSERT INTO user_roles (name, description, permissions) VALUES
('admin', 'System Administrator', '{"modules": ["*"], "assets": ["*"], "work_orders": ["*"], "users": ["*"]}'),
('manager', 'Operations Manager', '{"assets": ["read", "write"], "work_orders": ["read", "write"], "reports": ["read"]}'),
('technician', 'Maintenance Technician', '{"assets": ["read"], "work_orders": ["read", "write"], "mobile": ["read", "write"]}'),
('viewer', 'Read-only User', '{"assets": ["read"], "work_orders": ["read"], "reports": ["read"]}');

-- Get module IDs for entity schemas
DO $$
DECLARE
    assets_module_id UUID;
    work_orders_module_id UUID;
    maintenance_module_id UUID;
BEGIN
    SELECT id INTO assets_module_id FROM modules WHERE name = 'assets';
    SELECT id INTO work_orders_module_id FROM modules WHERE name = 'work-orders';
    SELECT id INTO maintenance_module_id FROM modules WHERE name = 'maintenance';

    -- Base asset schema
    INSERT INTO entity_schemas (name, description, category, module_id, schema_definition) VALUES
    ('Asset', 'Base asset entity', 'base', assets_module_id, '{
        "fields": [
            {"name": "id", "type": "uuid", "required": true, "primary": true},
            {"name": "name", "type": "string", "required": true, "label": "Asset Name"},
            {"name": "description", "type": "text", "label": "Description"},
            {"name": "category", "type": "string", "required": true, "label": "Category"},
            {"name": "status", "type": "enum", "required": true, "options": ["active", "inactive", "maintenance", "retired"], "label": "Status"},
            {"name": "location", "type": "string", "required": true, "label": "Location"},
            {"name": "serial_number", "type": "string", "label": "Serial Number"},
            {"name": "manufacturer", "type": "string", "label": "Manufacturer"},
            {"name": "model", "type": "string", "label": "Model"},
            {"name": "purchase_date", "type": "date", "label": "Purchase Date"},
            {"name": "purchase_price", "type": "decimal", "label": "Purchase Price"},
            {"name": "warranty_expiry", "type": "date", "label": "Warranty Expiry"}
        ]
    }');

    -- Equipment asset schema
    INSERT INTO entity_schemas (name, description, category, module_id, schema_definition) VALUES
    ('Equipment', 'Manufacturing and production equipment', 'equipment', assets_module_id, '{
        "extends": "Asset",
        "fields": [
            {"name": "capacity", "type": "number", "label": "Capacity"},
            {"name": "power_rating", "type": "number", "label": "Power Rating (kW)"},
            {"name": "operating_hours", "type": "number", "label": "Operating Hours", "default": 0},
            {"name": "last_maintenance_date", "type": "date", "label": "Last Maintenance"},
            {"name": "next_maintenance_date", "type": "date", "label": "Next Maintenance"},
            {"name": "specifications", "type": "json", "label": "Technical Specifications"}
        ]
    }');

    -- Vehicle asset schema
    INSERT INTO entity_schemas (name, description, category, module_id, schema_definition) VALUES
    ('Vehicle', 'Fleet vehicles and mobile equipment', 'vehicle', assets_module_id, '{
        "extends": "Asset",
        "fields": [
            {"name": "make", "type": "string", "required": true, "label": "Make"},
            {"name": "year", "type": "number", "required": true, "label": "Year"},
            {"name": "vin", "type": "string", "label": "VIN"},
            {"name": "license_plate", "type": "string", "label": "License Plate"},
            {"name": "mileage", "type": "number", "label": "Mileage", "default": 0},
            {"name": "fuel_type", "type": "enum", "options": ["gasoline", "diesel", "electric", "hybrid"], "label": "Fuel Type"},
            {"name": "last_service_date", "type": "date", "label": "Last Service"},
            {"name": "next_service_mileage", "type": "number", "label": "Next Service Mileage"}
        ]
    }');

    -- Facility asset schema
    INSERT INTO entity_schemas (name, description, category, module_id, schema_definition) VALUES
    ('Facility', 'Buildings and infrastructure', 'facility', assets_module_id, '{
        "extends": "Asset",
        "fields": [
            {"name": "building_type", "type": "enum", "options": ["office", "warehouse", "factory", "retail", "other"], "label": "Building Type"},
            {"name": "square_footage", "type": "number", "label": "Square Footage"},
            {"name": "construction_year", "type": "number", "label": "Construction Year"},
            {"name": "hvac_system", "type": "string", "label": "HVAC System Type"},
            {"name": "electrical_panel", "type": "string", "label": "Electrical Panel Info"},
            {"name": "last_inspection_date", "type": "date", "label": "Last Inspection"},
            {"name": "next_inspection_date", "type": "date", "label": "Next Inspection"}
        ]
    }');

    -- Work Order schema
    INSERT INTO entity_schemas (name, description, category, module_id, schema_definition) VALUES
    ('WorkOrder', 'Maintenance and repair work orders', 'work_order', work_orders_module_id, '{
        "fields": [
            {"name": "id", "type": "uuid", "required": true, "primary": true},
            {"name": "title", "type": "string", "required": true, "label": "Title"},
            {"name": "description", "type": "text", "required": true, "label": "Description"},
            {"name": "status", "type": "enum", "required": true, "options": ["open", "in-progress", "completed", "cancelled"], "label": "Status"},
            {"name": "priority", "type": "enum", "required": true, "options": ["low", "medium", "high", "critical"], "label": "Priority"},
            {"name": "type", "type": "enum", "required": true, "options": ["corrective", "preventive", "inspection", "emergency"], "label": "Type"},
            {"name": "asset_id", "type": "reference", "required": true, "reference_table": "assets", "label": "Asset"},
            {"name": "assigned_to", "type": "uuid", "label": "Assigned To"},
            {"name": "requested_by", "type": "uuid", "required": true, "label": "Requested By"},
            {"name": "scheduled_date", "type": "datetime", "label": "Scheduled Date"},
            {"name": "completed_date", "type": "datetime", "label": "Completed Date"},
            {"name": "estimated_hours", "type": "decimal", "label": "Estimated Hours"},
            {"name": "actual_hours", "type": "decimal", "label": "Actual Hours"},
            {"name": "estimated_cost", "type": "decimal", "label": "Estimated Cost"},
            {"name": "actual_cost", "type": "decimal", "label": "Actual Cost"}
        ]
    }');

END $$;

-- Sample asset categories data
INSERT INTO assets (name, description, category, status, location, serial_number, manufacturer, model, purchase_date, purchase_price, category_data) VALUES
-- Equipment assets
('CNC Machine #1', 'High precision CNC machining center', 'equipment', 'active', 'Shop Floor A', 'CNC001', 'Haas Automation', 'VF-2', '2022-01-15', 85000.00, '{"capacity": 2000, "power_rating": 15, "operating_hours": 2450, "specifications": {"spindle_speed": "8100 RPM", "tool_capacity": "20 ATC"}}'),
('Welding Station #3', 'MIG welding workstation', 'equipment', 'active', 'Shop Floor B', 'WELD003', 'Lincoln Electric', 'Power MIG 350MP', '2021-08-20', 12500.00, '{"power_rating": 35, "operating_hours": 1850}'),
('Air Compressor', 'Main facility air compressor', 'equipment', 'active', 'Utility Room', 'COMP001', 'Ingersoll Rand', 'UP6-15C', '2020-03-10', 25000.00, '{"capacity": 125, "power_rating": 125}'),

-- Vehicle assets
('Delivery Truck #1', 'Box truck for parts delivery', 'vehicle', 'active', 'Fleet Parking', 'TRUCK001', 'Ford', 'E-450', '2021-05-12', 45000.00, '{"make": "Ford", "year": 2021, "vin": "1FDXE4FS3MDC12345", "license_plate": "DLV-001", "mileage": 25000, "fuel_type": "gasoline"}'),
('Forklift #2', 'Electric forklift for warehouse', 'vehicle', 'active', 'Warehouse', 'FORK002', 'Toyota', '8FGCU25', '2020-11-08', 32000.00, '{"make": "Toyota", "year": 2020, "fuel_type": "electric", "mileage": 1200}'),

-- Facility assets
('Main Office Building', 'Corporate headquarters building', 'facility', 'active', 'Site 1', 'BLDG001', 'ABC Construction', 'Custom', '2015-01-01', 2500000.00, '{"building_type": "office", "square_footage": 25000, "construction_year": 2015, "hvac_system": "Central Air", "last_inspection_date": "2024-01-15"}'),
('Warehouse A', 'Primary storage facility', 'facility', 'active', 'Site 1', 'WHSE001', 'XYZ Builders', 'Warehouse', '2018-06-01', 800000.00, '{"building_type": "warehouse", "square_footage": 50000, "construction_year": 2018}');

-- Sample work orders
INSERT INTO work_orders (title, description, status, priority, type, asset_id, requested_by, scheduled_date, estimated_hours, estimated_cost)
SELECT 
    'Routine Maintenance - CNC Machine #1',
    'Perform scheduled maintenance including oil change, filter replacement, and calibration check',
    'open',
    'medium',
    'preventive',
    a.id,
    '00000000-0000-0000-0000-000000000001', -- placeholder user ID
    NOW() + INTERVAL '7 days',
    4.0,
    250.00
FROM assets a WHERE a.serial_number = 'CNC001';

INSERT INTO work_orders (title, description, status, priority, type, asset_id, requested_by, scheduled_date, estimated_hours, estimated_cost)
SELECT 
    'Fix Hydraulic Leak - Forklift #2',
    'Investigate and repair hydraulic fluid leak in lift mechanism',
    'open',
    'high',
    'corrective',
    a.id,
    '00000000-0000-0000-0000-000000000001', -- placeholder user ID
    NOW() + INTERVAL '2 days',
    6.0,
    450.00
FROM assets a WHERE a.serial_number = 'FORK002';

-- Sample maintenance schedules
INSERT INTO maintenance_schedules (asset_id, name, description, frequency_type, frequency_value, next_due)
SELECT 
    a.id,
    'Monthly Preventive Maintenance',
    'Monthly inspection and basic maintenance tasks',
    'days',
    30,
    NOW() + INTERVAL '30 days'
FROM assets a WHERE a.category = 'equipment';

INSERT INTO maintenance_schedules (asset_id, name, description, frequency_type, frequency_value, next_due)
SELECT 
    a.id,
    'Annual Vehicle Inspection',
    'Yearly comprehensive vehicle safety inspection',
    'days',
    365,
    NOW() + INTERVAL '365 days'
FROM assets a WHERE a.category = 'vehicle';
