import { useQuery } from "@tanstack/react-query";
import { ISupplier } from "@/types/supplier";
import { IAddress } from "@/types/order";

// Sample suppliers data
const sampleSuppliers: ISupplier[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 234 567 8900",
    address: {
      street: "123 Business Ave, Suite 100",
      city: "Business City",
      state: "BC",
      zipCode: "12345",
      country: "USA",
    },
    status: "active",
    products: 25,
    lastOrder: "2024-03-15T10:00:00Z",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "2",
    name: "Tech Solutions Inc",
    email: "info@techsolutions.com",
    phone: "+1 234 567 8901",
    address: {
      street: "456 Tech Park",
      city: "Innovation City",
      state: "IC",
      zipCode: "67890",
      country: "USA",
    },
    status: "active",
    products: 15,
    lastOrder: "2024-03-10T15:30:00Z",
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
  },
  {
    id: "3",
    name: "Global Supplies Ltd",
    email: "orders@globalsupplies.com",
    phone: "+1 234 567 8902",
    address: {
      street: "789 Global Plaza",
      city: "Trade City",
      state: "TC",
      zipCode: "13579",
      country: "USA",
    },
    status: "inactive",
    products: 8,
    lastOrder: "2024-02-28T09:15:00Z",
    createdAt: new Date("2024-01-03T00:00:00Z"),
    updatedAt: new Date("2024-01-03T00:00:00Z"),
  },
];

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sampleSuppliers;
    },
  });
}
