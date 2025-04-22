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
    logo: "https://image.cdn2.seaart.me/temp-convert-webp/png/2024-03-24/co0bc2te878c73crnkpg/2fee08bc9a75fd1f1af8e9f53d0f3142df1ecbf2_low.webp",
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
    logo: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ac567623-29f0-4913-a0a7-f9cc7475d160/dfz051f-fe5b54d7-7c6a-4798-9235-e277539c4c7f.png/v1/fill/w_1280,h_1920,q_80,strp/the_saree_makes_a_woman_look_sexy_yet_graceful_all_by_shadowlegend07_dfz051f-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTkyMCIsInBhdGgiOiJcL2ZcL2FjNTY3NjIzLTI5ZjAtNDkxMy1hMGE3LWY5Y2M3NDc1ZDE2MFwvZGZ6MDUxZi1mZTViNTRkNy03YzZhLTQ3OTgtOTIzNS1lMjc3NTM5YzRjN2YucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Oxmh9OhNSSrNGjo7J502wg1s6M4CC5c5DkdEdFAqQzo",
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
