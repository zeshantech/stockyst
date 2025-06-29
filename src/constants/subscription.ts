export const MOCK_INVOICES = [
  {
    id: "INV-001",
    date: new Date(2023, 5, 15), // June 15, 2023
    amount: "$49.00",
    status: "paid" as const,
    invoiceUrl: "https://stripe.com/invoice/123456789",
    stripeInvoiceId: "in_123456789",
  },
  {
    id: "INV-002",
    date: new Date(2023, 4, 15), // May 15, 2023
    amount: "$49.00",
    status: "paid" as const,
    invoiceUrl: "https://stripe.com/invoice/987654321",
    stripeInvoiceId: "in_987654321",
  },
  {
    id: "INV-003",
    date: new Date(2023, 3, 15), // April 15, 2023
    amount: "$49.00",
    status: "paid" as const,
    invoiceUrl: "https://stripe.com/invoice/456789123",
    stripeInvoiceId: "in_456789123",
  },
];

