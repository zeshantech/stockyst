import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IProduct,
  DeleteProductParams,
  BulkDeleteProductsParams,
  BulkUploadProductsParams,
  UpdateProductStatusParams,
  IVariant,
  IBundle,
} from "@/types/product";

// Find variant groups function
// Group variants by parent product
export const findVariantGroups = (
  variants: IVariant[],
  products: IProduct[] = []
) => {
  const variantGroups: Record<string, IVariant[]> = {};

  // Group variants by parent product
  variants.forEach((variant) => {
    const parentId = variant.parentProduct;

    if (!variantGroups[parentId]) {
      variantGroups[parentId] = [];
    }

    variantGroups[parentId].push(variant);
  });

  // Filter out single variant groups
  return Object.entries(variantGroups)
    .filter(([_, variants]) => variants.length > 1)
    .map(([key, variants]) => {
      // Try to find the parent product to use its name
      const parentProduct = products.find((p) => p.id === key);
      const groupName = parentProduct
        ? parentProduct.name
        : variants[0].name.split(" - ")[0];

      return {
        parentId: key,
        name: groupName,
        variants,
      };
    });
};

// API endpoints (to be implemented with actual backend)
const API_ENDPOINTS = {
  PRODUCTS: "/api/products",
  PRODUCT: (id: string) => `/api/products/${id}`,
  BULK_DELETE: "/api/products/bulk-delete",
  BULK_UPLOAD: "/api/products/bulk-upload",
  UPDATE_STATUS: (id: string) => `/api/products/${id}/status`,
};

// Query keys
export const PRODUCTS_QUERY_KEYS = {
  ALL: ["products"],
  DETAIL: (id: string) => ["products", id],
  CATEGORIES: ["products", "categories"],
  SUPPLIERS: ["products", "suppliers"],
  STATISTICS: ["products", "statistics"],
  VARIANTS: ["products", "variants"],
  BUNDLES: ["products", "bundles"],
  BUNDLE_PRODUCTS: (bundleId: string) => ["products", "bundle", bundleId],
};

// Sample data - replace with actual API call
const sampleProducts: IProduct[] = [
  {
    id: "1",
    name: "Laptop Pro X1",
    sku: "LP-X1-2024",
    description: "High-performance laptop for professionals",
    categoryId: "electronics",
    price: 1299.99,
    cost: 899.99,
    quantity: 45,
    reorderPoint: 10,
    supplierId: "tech-suppliers",
    location: "Warehouse A",
    status: "active",
    lastRestocked: new Date("2024-03-15"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-15"),
    tags: ["laptop", "professional", "high-performance"],
    specifications: {
      processor: "Intel i7",
      ram: "16GB",
      storage: "512GB SSD",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "2",
    name: "Office Chair Ergo",
    sku: "OC-E-2024",
    description: "Ergonomic office chair with lumbar support",
    categoryId: "furniture",
    price: 299.99,
    cost: 199.99,
    quantity: 8,
    reorderPoint: 15,
    supplierId: "furnicorp",
    location: "Warehouse B",
    status: "active",
    lastRestocked: new Date("2024-02-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-15"),
    tags: ["chair", "ergonomic", "office"],
    specifications: {
      material: "Mesh",
      color: "Black",
      weight: "15kg",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "3",
    name: "Wireless Mouse",
    sku: "WM-2024",
    description: "Ergonomic wireless mouse",
    categoryId: "electronics",
    price: 49.99,
    cost: 29.99,
    quantity: 0,
    reorderPoint: 20,
    supplierId: "tech-suppliers",
    location: "Warehouse A",
    status: "inactive",
    lastRestocked: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
    tags: ["mouse", "wireless", "ergonomic"],
    specifications: {
      connectivity: "Bluetooth",
      battery: "AA",
      dpi: "1600",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
];

const sampleStatistics = {
  totalProducts: 1234,
  totalStock: 45678,
  lowStockItems: 23,
  outOfStockItems: 5,
  totalValue: 45678.99,
  monthlyGrowth: 12.5,
  monthlyData: [
    { month: "Jan", value: 38000, stock: 950 },
    { month: "Feb", value: 39500, stock: 1000 },
    { month: "Mar", value: 41000, stock: 1050 },
    { month: "Apr", value: 42500, stock: 1100 },
    { month: "May", value: 44000, stock: 1150 },
    { month: "Jun", value: 45500, stock: 1200 },
  ],
};

// Sample data for variants and bundles
const sampleVariants: IVariant[] = [
  {
    id: "v1",
    name: "T-Shirt - Small",
    sku: "TS-SM-RED",
    description: "Cotton T-shirt in red color, small size",
    categoryId: "clothing",
    price: 19.99,
    cost: 8.99,
    quantity: 25,
    reorderPoint: 10,
    supplierId: "textile-exports",
    location: "Warehouse C",
    status: "active",
    lastRestocked: new Date("2024-03-10"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-10"),
    tags: ["tshirt", "small", "red", "variant"],
    specifications: {
      color: "Red",
      size: "Small",
      material: "100% Cotton",
    },
    parentProduct: "p1", // Parent product ID
    variantAttributes: {
      color: "Red",
      size: "Small",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "v2",
    name: "T-Shirt - Medium",
    sku: "TS-MD-RED",
    description: "Cotton T-shirt in red color, medium size",
    categoryId: "clothing",
    price: 19.99,
    cost: 8.99,
    quantity: 30,
    reorderPoint: 10,
    supplierId: "textile-exports",
    location: "Warehouse C",
    status: "active",
    lastRestocked: new Date("2024-03-10"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-10"),
    tags: ["tshirt", "medium", "red", "variant"],
    specifications: {
      color: "Red",
      size: "Medium",
      material: "100% Cotton",
    },
    parentProduct: "p1",
    variantAttributes: {
      color: "Red",
      size: "Medium",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "v3",
    name: "T-Shirt - Large",
    sku: "TS-LG-RED",
    description: "Cotton T-shirt in red color, large size",
    categoryId: "clothing",
    price: 19.99,
    cost: 8.99,
    quantity: 15,
    reorderPoint: 10,
    supplierId: "textile-exports",
    location: "Warehouse C",
    status: "active",
    lastRestocked: new Date("2024-03-10"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-10"),
    tags: ["tshirt", "large", "red", "variant"],
    specifications: {
      color: "Red",
      size: "Large",
      material: "100% Cotton",
    },
    parentProduct: "p1",
    variantAttributes: {
      color: "Red",
      size: "Large",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "v4",
    name: "T-Shirt - Small",
    sku: "TS-SM-BLU",
    description: "Cotton T-shirt in blue color, small size",
    categoryId: "clothing",
    price: 19.99,
    cost: 8.99,
    quantity: 20,
    reorderPoint: 10,
    supplierId: "textile-exports",
    location: "Warehouse C",
    status: "active",
    lastRestocked: new Date("2024-03-10"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-10"),
    tags: ["tshirt", "small", "blue", "variant"],
    specifications: {
      color: "Blue",
      size: "Small",
      material: "100% Cotton",
    },
    parentProduct: "p2",
    variantAttributes: {
      color: "Blue",
      size: "Small",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "v5",
    name: "T-Shirt - Medium",
    sku: "TS-MD-BLU",
    description: "Cotton T-shirt in blue color, medium size",
    categoryId: "clothing",
    price: 19.99,
    cost: 8.99,
    quantity: 25,
    reorderPoint: 10,
    supplierId: "textile-exports",
    location: "Warehouse C",
    status: "active",
    lastRestocked: new Date("2024-03-10"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-10"),
    tags: ["tshirt", "medium", "blue", "variant"],
    specifications: {
      color: "Blue",
      size: "Medium",
      material: "100% Cotton",
    },
    parentProduct: "p2",
    variantAttributes: {
      color: "Blue",
      size: "Medium",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "v6",
    name: "T-Shirt - Large",
    sku: "TS-LG-BLU",
    description: "Cotton T-shirt in blue color, large size",
    categoryId: "clothing",
    price: 19.99,
    cost: 8.99,
    quantity: 10,
    reorderPoint: 10,
    supplierId: "textile-exports",
    location: "Warehouse C",
    status: "active",
    lastRestocked: new Date("2024-03-10"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-10"),
    tags: ["tshirt", "large", "blue", "variant"],
    specifications: {
      color: "Blue",
      size: "Large",
      material: "100% Cotton",
    },
    parentProduct: "p2",
    variantAttributes: {
      color: "Blue",
      size: "Large",
    },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
];

const sampleBundles: IBundle[] = [
  {
    id: "b1",
    name: "Office Starter Kit",
    sku: "OSK-2024",
    description: "Complete office setup with desk, chair, and accessories",
    categoryId: "furniture",
    price: 549.99,
    cost: 399.99,
    quantity: 5,
    reorderPoint: 2,
    supplierId: "furnicorp",
    location: "Warehouse B",
    status: "active",
    lastRestocked: new Date("2024-03-01"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-01"),
    tags: ["bundle", "office", "desk", "chair"],
    specifications: {
      includedItems: "Desk, Chair, Lamp, Drawer Unit",
      warranty: "2 years",
    },
    bundledProducts: ["2", "10", "11"], // IDs of products in the bundle
    bundledProductQuantities: { "2": 1, "10": 1, "11": 1 },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "b2",
    name: "Tech Essentials Bundle",
    sku: "TEB-2024",
    description: "Laptop, mouse, keyboard, and headset in one package",
    categoryId: "electronics",
    price: 1499.99,
    cost: 999.99,
    quantity: 8,
    reorderPoint: 3,
    supplierId: "tech-suppliers",
    location: "Warehouse A",
    status: "active",
    lastRestocked: new Date("2024-02-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-15"),
    tags: ["bundle", "electronics", "laptop", "accessories"],
    specifications: {
      includedItems:
        "Laptop Pro X1, Wireless Mouse, Mechanical Keyboard, Premium Headset",
      warranty: "1 year",
    },
    bundledProducts: ["1", "3", "12", "13"], // IDs of products in the bundle
    bundledProductQuantities: { "1": 1, "3": 1, "12": 1, "13": 1 },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
  {
    id: "b3",
    name: "Home Office Bundle",
    sku: "HOB-2024",
    description: "Essential items for a productive home office setup",
    categoryId: "office-supplies",
    price: 1899.99,
    cost: 1299.99,
    quantity: 3,
    reorderPoint: 2,
    supplierId: "office-solutions",
    location: "Warehouse B",
    status: "active",
    lastRestocked: new Date("2024-03-05"),
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-03-05"),
    tags: ["bundle", "home office", "desk", "chair", "electronics"],
    specifications: {
      includedItems:
        "Standing Desk, Ergonomic Chair, Monitor, Laptop Stand, Desk Organizer",
      warranty: "2 years on furniture, 1 year on electronics",
    },
    bundledProducts: ["2", "14", "15", "16"], // IDs of products in the bundle
    bundledProductQuantities: { "2": 1, "14": 1, "15": 1, "16": 1 },
    image:
      "https://images-cdn.ubuy.qa/6567037d452ea5027855e9a3-zelaprox-clear-heels-for-women-silver.jpg",
  },
];

/**
 * Comprehensive hook for managing products
 */
export function useProducts() {
  const queryClient = useQueryClient();
  const isAuthenticated = true; // TODO: make it dynamic

  // Query for all products
  const allProductsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.ALL,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleProducts;
    },
    enabled: isAuthenticated,
  });

  // Query for product categories
  const categoriesQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.CATEGORIES,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [
        { id: "1", name: "Electronics" },
        { id: "2", name: "Furniture" },
        { id: "3", name: "Office Supplies" },
        { id: "4", name: "Clothing" },
        { id: "5", name: "Food" },
      ];
    },
    enabled: isAuthenticated,
  });

  // Query for suppliers
  const suppliersQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.SUPPLIERS,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [
        { id: "1", name: "TechSuppliers Inc" },
        { id: "2", name: "FurniCorp" },
        { id: "3", name: "Office Solutions" },
        { id: "4", name: "Textile Exports" },
        { id: "5", name: "Food Distributors" },
      ];
    },
    enabled: isAuthenticated,
  });

  // Query for product statistics
  const statisticsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      return sampleStatistics;
    },
    enabled: isAuthenticated,
  });

  // Query for variants
  const variantsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.VARIANTS,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleVariants;
    },
    enabled: isAuthenticated,
  });

  // Query for bundles
  const bundlesQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.BUNDLES,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleBundles;
    },
    enabled: isAuthenticated,
  });

  // Function to get a specific product by ID
  const getProductById = (id: string): IProduct | undefined => {
    return allProductsQuery.data?.find((product) => product.id === id);
  };
  const getVariantById = (id: string): IVariant | undefined => {
    return variantsQuery.data?.find((variant) => variant.id === id);
  };

  const getBundleById = (id: string): IBundle | undefined => {
    return bundlesQuery.data?.find((bundle) => bundle.id === id);
  };

  // Function to get a product by ID with useQuery
  const useProductById = (id: string) => {
    return useQuery({
      queryKey: PRODUCTS_QUERY_KEYS.DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // First check regular products
        const product = sampleProducts.find((p) => p.id === id);
        if (product) return product;

        throw new Error(`Product with ID ${id} not found`);
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Function to get a product by ID with useQuery
  const useBundleById = (id: string) => {
    return useQuery({
      queryKey: PRODUCTS_QUERY_KEYS.DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const bundle = sampleBundles.find((b) => b.id === id);
        if (bundle) return bundle;

        throw new Error(`Bundle with ID ${id} not found`);
      },
      enabled: isAuthenticated && !!id,
    });
  };

  const useVariantById = (id: string) => {
    return useQuery({
      queryKey: PRODUCTS_QUERY_KEYS.DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Then check variants
        const variant = sampleVariants.find((v) => v.id === id);
        if (variant) return variant;

        throw new Error(`Variant with ID ${id} not found`);
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Function to get products in a bundle
  const useProductsByBundleId = (bundleId: string) => {
    return useQuery({
      queryKey: PRODUCTS_QUERY_KEYS.BUNDLE_PRODUCTS(bundleId),
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const bundle = sampleBundles.find((b) => b.id === bundleId);
        if (!bundle) {
          throw new Error(`Bundle with ID ${bundleId} not found`);
        }

        const bundledProducts = bundle.bundledProducts
          .map((productId) => {
            const product = sampleProducts.find((p) => p.id === productId);
            if (!product) return null;
            return {
              ...product,
              quantity: bundle.bundledProductQuantities[productId] || 1,
            };
          })
          .filter(Boolean) as IProduct[];

        return bundledProducts;
      },
      enabled: isAuthenticated && !!bundleId,
    });
  };

  // Function to get variants for a product
  const getVariantsByProductId = (productId: string): IVariant[] => {
    return (
      variantsQuery.data?.filter(
        (variant) => variant.parentProduct === productId
      ) || []
    );
  };

  // Function to get bundles containing a product
  const getBundlesByProductId = (productId: string): IBundle[] => {
    return (
      bundlesQuery.data?.filter((bundle) =>
        bundle.bundledProducts.includes(productId)
      ) || []
    );
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (
      newProduct: Omit<IProduct, "id" | "createdAt" | "updatedAt">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newProduct,
        id: `prod-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    },
  });

  // Create variant mutation
  const createVariantMutation = useMutation({
    mutationFn: async (
      newVariant: Omit<IVariant, "id" | "createdAt" | "updatedAt">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newVariant,
        id: `var-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IVariant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.VARIANTS });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Variant created successfully");
    },
    onError: (error) => {
      console.error("Error creating variant:", error);
      toast.error("Failed to create variant");
    },
  });

  // Create bundle mutation
  const createBundleMutation = useMutation({
    mutationFn: async (
      newBundle: Omit<IBundle, "id" | "createdAt" | "updatedAt">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newBundle,
        id: `bun-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IBundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.BUNDLES });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Bundle created successfully");
    },
    onError: (error) => {
      console.error("Error creating bundle:", error);
      toast.error("Failed to create bundle");
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<IProduct> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IProduct;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    },
  });

  // Update variant mutation
  const updateVariantMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<IVariant> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IVariant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.VARIANTS });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Variant updated successfully");
    },
    onError: (error) => {
      console.error("Error updating variant:", error);
      toast.error("Failed to update variant");
    },
  });

  // Update bundle mutation
  const updateBundleMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<IBundle> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IBundle;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.BUNDLES });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.BUNDLE_PRODUCTS(data.id),
      });
      toast.success("Bundle updated successfully");
    },
    onError: (error) => {
      console.error("Error updating bundle:", error);
      toast.error("Failed to update bundle");
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async ({ id }: DeleteProductParams) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    },
  });

  // Delete variant mutation
  const deleteVariantMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.VARIANTS });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Variant deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    },
  });

  // Delete bundle mutation
  const deleteBundleMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.BUNDLES });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success("Bundle deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting bundle:", error);
      toast.error("Failed to delete bundle");
    },
  });

  // Bulk delete products mutation
  const bulkDeleteProductsMutation = useMutation({
    mutationFn: async ({ ids }: BulkDeleteProductsParams) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { success: true, count: ids.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success(`${data.count} products deleted successfully`);
    },
    onError: (error) => {
      console.error("Error deleting products:", error);
      toast.error("Failed to delete products");
    },
  });

  // Bulk upload products mutation
  const bulkUploadProductsMutation = useMutation({
    mutationFn: async ({ formData }: BulkUploadProductsParams) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true, count: 5 }; // Assume 5 products were uploaded
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.STATISTICS,
      });
      toast.success(`${data.count} products uploaded successfully`);
    },
    onError: (error) => {
      console.error("Error uploading products:", error);
      toast.error("Failed to upload products");
    },
  });

  // Update product status mutation
  const updateProductStatusMutation = useMutation({
    mutationFn: async ({ id, status }: UpdateProductStatusParams) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, status, success: true };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.DETAIL(data.id),
      });
      toast.success("Product status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    },
  });

  return {
    // Data
    products: allProductsQuery.data || [],
    categories: categoriesQuery.data || [],
    suppliers: suppliersQuery.data || [],
    statistics: statisticsQuery.data || null,
    variants: variantsQuery.data || [],
    bundles: bundlesQuery.data || [],

    // Loading states
    isLoadingProducts: allProductsQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingSuppliers: suppliersQuery.isLoading,
    isLoadingStatistics: statisticsQuery.isLoading,
    isLoadingVariants: variantsQuery.isLoading,
    isLoadingBundles: bundlesQuery.isLoading,

    // Error states
    productsError: allProductsQuery.error,
    categoriesError: categoriesQuery.error,
    suppliersError: suppliersQuery.error,
    statisticsError: statisticsQuery.error,
    variantsError: variantsQuery.error,
    bundlesError: bundlesQuery.error,

    // Utility functions
    getProductById,
    useProductById,
    useBundleById,
    useVariantById,
    useProductsByBundleId,
    getVariantsByProductId,
    getBundlesByProductId,
    getVariantById,
    getBundleById,

    // Mutations
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    bulkDeleteProducts: bulkDeleteProductsMutation.mutate,
    bulkUploadProducts: bulkUploadProductsMutation.mutate,
    updateProductStatus: updateProductStatusMutation.mutate,
    createVariant: createVariantMutation.mutate,
    updateVariant: updateVariantMutation.mutate,
    deleteVariant: deleteVariantMutation.mutate,
    createBundle: createBundleMutation.mutate,
    updateBundle: updateBundleMutation.mutate,
    deleteBundle: deleteBundleMutation.mutate,

    // Mutation states
    isCreatingProduct: createProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending,
    isDeletingProduct: deleteProductMutation.isPending,
    isBulkDeletingProducts: bulkDeleteProductsMutation.isPending,
    isBulkUploadingProducts: bulkUploadProductsMutation.isPending,
    isUpdatingProductStatus: updateProductStatusMutation.isPending,
    isCreatingVariant: createVariantMutation.isPending,
    isUpdatingVariant: updateVariantMutation.isPending,
    isDeletingVariant: deleteVariantMutation.isPending,
    isCreatingBundle: createBundleMutation.isPending,
    isUpdatingBundle: updateBundleMutation.isPending,
    isDeletingBundle: deleteBundleMutation.isPending,

    isAuthenticated,
  };
}

// For specific use cases, export individual hooks that use the main hook
export function useAllProducts() {
  const {
    products,
    isLoadingProducts: isLoading,
    productsError: error,
  } = useProducts();
  return { data: products, isLoading, error };
}

export function useProductCategories() {
  const {
    categories,
    isLoadingCategories: isLoading,
    categoriesError: error,
  } = useProducts();
  return { data: categories, isLoading, error };
}

export function useProductSuppliers() {
  const {
    suppliers,
    isLoadingSuppliers: isLoading,
    suppliersError: error,
  } = useProducts();
  return { data: suppliers, isLoading, error };
}

export function useProductStatistics() {
  const {
    statistics,
    isLoadingStatistics: isLoading,
    statisticsError: error,
  } = useProducts();
  return { data: statistics, isLoading, error };
}

export function useCreateProduct() {
  const { createProduct, isCreatingProduct: isPending } = useProducts();
  return { mutate: createProduct, isPending };
}

export function useUpdateProduct() {
  const { updateProduct, isUpdatingProduct: isPending } = useProducts();
  return { mutate: updateProduct, isPending };
}

export function useDeleteProduct() {
  const { deleteProduct, isDeletingProduct: isPending } = useProducts();
  return { mutate: deleteProduct, isPending };
}

export function useBulkDeleteProducts() {
  const { bulkDeleteProducts, isBulkDeletingProducts: isPending } =
    useProducts();
  return { mutate: bulkDeleteProducts, isPending };
}

export function useBulkUploadProducts() {
  const { bulkUploadProducts, isBulkUploadingProducts: isPending } =
    useProducts();
  return { mutate: bulkUploadProducts, isPending };
}

export function useUpdateProductStatus() {
  const { updateProductStatus, isUpdatingProductStatus: isPending } =
    useProducts();
  return { mutate: updateProductStatus, isPending };
}

// Hook for getting a specific product
export function useProduct(id: string) {
  const { useProductById } = useProducts();
  return useProductById(id);
}

// Hook for getting a specific product
export function useBundle(id: string) {
  const { useBundleById } = useProducts();
  return useBundleById(id);
}

// Hook for getting a specific Variant
export function useVarient(id: string) {
  const { useVariantById } = useProducts();
  return useVariantById(id);
}

// Hook for getting a specific Variant
export function useProductsByBundleId(id: string) {
  const { useProductsByBundleId } = useProducts();
  return useProductsByBundleId(id);
}
