export const demoUsers = [
  {
    id: "USR-001",
    name: "Aarav Mehta",
    email: "admin@opshub.local",
    password: "admin123",
    role: "admin",
    roleLabel: "Administrator"
  },
  {
    id: "USR-002",
    name: "Neha Kapoor",
    email: "inventory@opshub.local",
    password: "inventory123",
    role: "inventory_manager",
    roleLabel: "Inventory Manager"
  },
  {
    id: "USR-003",
    name: "Rohan Singh",
    email: "accounts@opshub.local",
    password: "accounts123",
    role: "accountant",
    roleLabel: "Accounts Manager"
  }
];

export const navigationItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    caption: "Overview and pulse",
    icon: "DB",
    roles: ["admin", "inventory_manager", "accountant"]
  },
  {
    to: "/inventory",
    label: "Inventory",
    caption: "Products and stock",
    icon: "IN",
    roles: ["admin", "inventory_manager"]
  },
  {
    to: "/payments",
    label: "Payments",
    caption: "Collections and invoices",
    icon: "PY",
    roles: ["admin", "accountant"]
  },
  {
    to: "/workspace",
    label: "Workspace",
    caption: "Quick actions",
    icon: "WS",
    roles: ["admin", "inventory_manager", "accountant"]
  }
];
