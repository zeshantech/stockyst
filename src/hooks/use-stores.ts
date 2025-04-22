import { IStore } from "@/types/store";
import { useQuery } from "@tanstack/react-query";

// Mock data for stores
const mockStores: IStore[] = [
  {
    id: "store-1",
    name: "Main Warehouse",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    phone: "+1 234 567 8901",
    email: "warehouse@stockyst.com",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0qCreqkTZL0F0bF9kZctFE1XVFocO__70kw&s",
    type: "warehouse",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "store-2",
    name: "Downtown Store",
    address: "456 Market St",
    city: "San Francisco",
    country: "USA",
    phone: "+1 234 567 8902",
    email: "downtown@stockyst.com",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0qCreqkTZL0F0bF9kZctFE1XVFocO__70kw&s",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "store-3",
    name: "East Coast Depot",
    address: "789 Broadway",
    city: "Boston",
    country: "USA",
    phone: "+1 234 567 8903",
    email: "eastcoast@stockyst.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Function to fetch stores
const fetchStores = async (): Promise<IStore[]> => {
  // This would normally be an API call
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStores);
    }, 500);
  });
};

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });
}

// Hook to get active store from localStorage
export function useActiveStore() {
  const { data: stores, isLoading } = useStores();

  // Check localStorage for active store
  const activeStoreId =
    typeof window !== "undefined"
      ? localStorage.getItem("activeStoreId")
      : null;

  // Find active store from the stores list
  const activeStore =
    !isLoading && stores
      ? stores.find((store) => store.id === activeStoreId) || stores[0]
      : null;

  // Function to set active store
  const setActiveStore = (storeId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeStoreId", storeId);
    }
  };

  return {
    activeStore,
    setActiveStore,
    isLoading,
  };
}
