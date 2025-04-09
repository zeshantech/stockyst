import { useQuery } from "@tanstack/react-query";

// Mock location data
const mockLocations = [
  { id: "all", name: "All Locations" },
  { id: "wh1", name: "Warehouse 1" },
  { id: "wh2", name: "Warehouse 2" },
  { id: "st1", name: "Store 1" },
  { id: "dc1", name: "Distribution Center 1" },
];

export function useLocations() {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockLocations;
    },
  });

  return {
    locations,
    isLoading,
  };
}
