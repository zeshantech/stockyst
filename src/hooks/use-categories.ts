import { useQuery } from "@tanstack/react-query";
import { ICategory } from "@/components/(private)/dashboard/categories/categories-table";

// Sample data - replace with actual API call
const sampleCategories: ICategory[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    productCount: 45,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15",
  },
  {
    id: "2",
    name: "Clothing",
    description: "Apparel and fashion items",
    productCount: 120,
    status: "active",
    createdAt: "2024-01-02",
    updatedAt: "2024-03-14",
  },
  {
    id: "3",
    name: "Home & Kitchen",
    description: "Household items and kitchenware",
    productCount: 78,
    status: "active",
    createdAt: "2024-01-03",
    updatedAt: "2024-03-13",
  },
  {
    id: "4",
    name: "Books",
    description: "Books and publications",
    productCount: 230,
    status: "active",
    createdAt: "2024-01-04",
    updatedAt: "2024-03-12",
  },
  {
    id: "5",
    name: "Sports & Outdoors",
    description: "Sports equipment and outdoor gear",
    productCount: 95,
    status: "inactive",
    createdAt: "2024-01-05",
    updatedAt: "2024-03-11",
  },
];

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sampleCategories;
    },
  });
}
