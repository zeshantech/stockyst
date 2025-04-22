import { useQuery } from "@tanstack/react-query";
import { IOrder, IAddress } from "@/types/order";

// Sample data - replace with actual API call
const sampleOrders: IOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1234567890",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Sample Product 1",
        quantity: 2,
        price: 99.99,
        total: 199.98,
      },
      {
        id: "2",
        productId: "2",
        productName: "Sample Product 2",
        quantity: 1,
        price: 49.99,
        total: 49.99,
      },
    ],
    subtotal: 249.97,
    tax: 25.0,
    shipping: 10.0,
    total: 284.97,
    status: "pending",
    paymentStatus: "paid",
    shippingAddress: {
      street: "123 Main St",
      city: "City",
      state: "State",
      zipCode: "12345",
      country: "Country",
    },
    billingAddress: {
      street: "123 Main St",
      city: "City",
      state: "State",
      zipCode: "12345",
      country: "Country",
    },
    notes: "Please handle with care",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+0987654321",
    items: [
      {
        id: "3",
        productId: "3",
        productName: "Sample Product 3",
        quantity: 1,
        price: 149.99,
        total: 149.99,
      },
    ],
    subtotal: 149.99,
    tax: 15.0,
    shipping: 10.0,
    total: 174.99,
    status: "processing",
    paymentStatus: "pending",
    shippingAddress: {
      street: "456 Oak St",
      city: "City",
      state: "State",
      zipCode: "54321",
      country: "Country",
    },
    billingAddress: {
      street: "456 Oak St",
      city: "City",
      state: "State",
      zipCode: "54321",
      country: "Country",
    },
    notes: "",
    createdAt: new Date("2024-03-14"),
    updatedAt: new Date("2024-03-14"),
  },
];

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sampleOrders;
    },
  });
}
