const today = new Date().toISOString().slice(0, 10);

export const store = {
  products: [
    {
      id: "PRD-1001",
      name: "Wireless Barcode Scanner",
      category: "Hardware",
      sku: "WBS-1001",
      price: 3200,
      stock: 18,
      reorderLevel: 10
    },
    {
      id: "PRD-1002",
      name: "Receipt Printer",
      category: "Hardware",
      sku: "RCP-2200",
      price: 5400,
      stock: 6,
      reorderLevel: 8
    },
    {
      id: "PRD-1003",
      name: "POS Subscription",
      category: "Software",
      sku: "POS-1Y",
      price: 9999,
      stock: 42,
      reorderLevel: 12
    },
    {
      id: "PRD-1004",
      name: "Cash Drawer",
      category: "Hardware",
      sku: "CDR-330",
      price: 2700,
      stock: 9,
      reorderLevel: 5
    }
  ],
  payments: [
    {
      id: "PAY-2001",
      invoiceNumber: "INV-9001",
      customerName: "Metro Mart",
      amount: 12800,
      method: "UPI",
      status: "Completed",
      date: today
    },
    {
      id: "PAY-2002",
      invoiceNumber: "INV-9002",
      customerName: "Green Basket",
      amount: 5400,
      method: "Card",
      status: "Pending",
      date: today
    },
    {
      id: "PAY-2003",
      invoiceNumber: "INV-9003",
      customerName: "Northline Retail",
      amount: 9999,
      method: "Bank Transfer",
      status: "Completed",
      date: today
    }
  ]
};
