import { useQuery } from "@tanstack/react-query";

export interface Store {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for stores
const mockStores: Store[] = [
  {
    id: "store-1",
    name: "Main Warehouse",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    phone: "+1 234 567 8901",
    email: "warehouse@inventree.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "store-2",
    name: "Downtown Store",
    address: "456 Market St",
    city: "San Francisco",
    country: "USA",
    phone: "+1 234 567 8902",
    email: "downtown@inventree.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "store-3",
    name: "East Coast Depot",
    address: "789 Broadway",
    city: "Boston",
    country: "USA",
    phone: "+1 234 567 8903",
    email: "eastcoast@inventree.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Function to fetch stores
const fetchStores = async (): Promise<Store[]> => {
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
