"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { IProduct, BundleFormValues } from "@/types/product";
import {
  useProductCategories,
  useProductSuppliers,
  useAllProducts,
} from "@/hooks/use-products";
import { TagInput } from "@/components/ui/tag-input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { XIcon } from "lucide-react";

// Form validation schema
const bundleFormSchema = z.object({
  name: z.string().min(2, {
    message: "Bundle name must be at least 2 characters.",
  }),
  sku: z.string().min(3, {
    message: "SKU must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Cost must be a positive number.",
  }),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Quantity must be a non-negative number.",
    }),
  reorderPoint: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Reorder point must be a non-negative number.",
    }),
  supplierId: z.string().min(2, {
    message: "Supplier ID must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive", "discontinued"]).optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  bundledProducts: z.array(z.string()).optional(),
  bundledProductQuantities: z.record(z.string(), z.number()).optional(),
  image: z.string().optional(),
});

const defaultValues: Partial<BundleFormValues> = {
  name: "",
  sku: "",
  description: "",
  categoryId: "",
  price: "",
  cost: "",
  quantity: "0",
  reorderPoint: "5",
  supplierId: "",
  location: "",
  status: "active",
  tags: ["bundle"],
  specifications: {},
  bundledProducts: [],
  bundledProductQuantities: {},
  image: "",
};

interface BundleFormProps {
  initialValues?: Partial<BundleFormValues>;
  onSubmit: (data: BundleFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

export function BundleForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Bundle",
  cancelButtonText = "Cancel",
  onCancel,
}: BundleFormProps) {
  const { data: categories = [] } = useProductCategories();
  const { data: suppliers = [] } = useProductSuppliers();
  const { data: allProducts = [] } = useAllProducts();

  const [selectedProduct, setSelectedProduct] = React.useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = React.useState<number>(1);

  const availableProducts = React.useMemo(() => {
    return allProducts.filter((product) => !product.tags.includes("bundle"));
  }, [allProducts]);
  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleFormSchema) as Resolver<BundleFormValues>,
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const bundledProducts = form.watch("bundledProducts") || [];
  const bundledProductQuantities = form.watch("bundledProductQuantities") || {};
  const specifications = form.watch("specifications") || {};

  const handleAddProduct = () => {
    if (selectedProduct && !bundledProducts.includes(selectedProduct)) {
      form.setValue("bundledProducts", [...bundledProducts, selectedProduct]);
      // Add quantity for this product
      form.setValue("bundledProductQuantities", {
        ...bundledProductQuantities,
        [selectedProduct]: selectedQuantity,
      });
      setSelectedProduct("");
      setSelectedQuantity(1);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    form.setValue(
      "bundledProducts",
      bundledProducts.filter((id) => id !== productId)
    );
    // Remove quantity for this product
    const newQuantities = { ...bundledProductQuantities };
    delete newQuantities[productId];
    form.setValue("bundledProductQuantities", newQuantities);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    form.setValue("bundledProductQuantities", {
      ...bundledProductQuantities,
      [productId]: quantity,
    });
  };

  const getProductById = (id: string) => {
    return availableProducts.find((product) => product.id === id);
  };

  const calculateTotalPrice = () => {
    return bundledProducts.reduce((total, productId) => {
      const product = getProductById(productId);
      const quantity = bundledProductQuantities[productId] || 1;
      return total + (product?.price || 0) * quantity;
    }, 0);
  };

  const handleAddSpecification = () => {
    const newSpecifications = { ...specifications, "": "" };
    form.setValue("specifications", newSpecifications);
  };

  const handleRemoveSpecification = (key: string) => {
    const newSpecifications = { ...specifications };
    delete newSpecifications[key];
    form.setValue("specifications", newSpecifications);
  };

  const handleChangeSpecificationKey = (oldKey: string, newKey: string) => {
    const newSpecifications = { ...specifications };
    const value = newSpecifications[oldKey];
    delete newSpecifications[oldKey];
    newSpecifications[newKey] = value;
    form.setValue("specifications", newSpecifications);
  };

  const handleChangeSpecificationValue = (key: string, value: string) => {
    const newSpecifications = { ...specifications };
    newSpecifications[key] = value;
    form.setValue("specifications", newSpecifications);
  };

  const handleSubmit = (data: BundleFormValues) => {
    // Ensure "bundle" tag is included
    const tags = data.tags || [];
    if (!tags.includes("bundle")) {
      tags.push("bundle");
    }
    data.tags = tags;

    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          {...form.register("name")}
          label="Bundle Name"
          placeholder="Enter bundle name"
          error={form.formState.errors.name?.message}
          required
        />

        <Input
          {...form.register("sku")}
          label="SKU"
          placeholder="Enter bundle SKU"
          error={form.formState.errors.sku?.message}
          required
        />

        <Selector
          label="Category"
          value={form.watch("categoryId")}
          onChange={(value) => form.setValue("categoryId", value)}
          options={categories.map((category) => ({
            value: category.name,
            label: category.name,
          }))}
          placeholder="Select a category"
          error={form.formState.errors.categoryId?.message}
          required
        />

        <Selector
          label="Supplier"
          value={form.watch("supplierId")}
          onChange={(value) => form.setValue("supplierId", value)}
          options={suppliers.map((supplier) => ({
            value: supplier.name,
            label: supplier.name,
          }))}
          placeholder="Select a supplier"
          error={form.formState.errors.supplierId?.message}
          required
        />

        <Input
          {...form.register("price")}
          type="number"
          label="Bundle Price"
          placeholder="0.00"
          step="0.01"
          min="0"
          error={form.formState.errors.price?.message}
          info={`Individual products total: $${calculateTotalPrice().toFixed(
            2
          )}`}
          required
        />

        <Input
          {...form.register("cost")}
          type="number"
          label="Bundle Cost"
          placeholder="0.00"
          step="0.01"
          min="0"
          error={form.formState.errors.cost?.message}
          required
        />

        <Input
          {...form.register("quantity")}
          type="number"
          label="Quantity"
          placeholder="0"
          min="0"
          error={form.formState.errors.quantity?.message}
          required
        />

        <Input
          {...form.register("reorderPoint")}
          type="number"
          label="Reorder Point"
          placeholder="5"
          min="0"
          info="The quantity at which to reorder this bundle"
          error={form.formState.errors.reorderPoint?.message}
          required
        />

        <Input
          {...form.register("location")}
          label="Location"
          placeholder="Enter storage location"
          error={form.formState.errors.location?.message}
          required
        />

        <Input
          {...form.register("image")}
          label="Image URL"
          placeholder="Enter image URL"
          error={form.formState.errors.image?.message}
        />

        {form.watch("status") !== undefined && (
          <Selector
            label="Status"
            value={form.watch("status") || ""}
            onChange={(value) =>
              form.setValue("status", value as IProduct["status"])
            }
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "discontinued", label: "Discontinued" },
            ]}
            placeholder="Select a status"
            error={form.formState.errors.status?.message}
          />
        )}
      </div>

      <Textarea
        {...form.register("description")}
        label="Description"
        placeholder="Enter bundle description"
        className="min-h-[100px]"
        error={form.formState.errors.description?.message}
        required
      />

      {/* Specifications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium">Specifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSpecification}
          >
            Add Specification
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <Input
                value={key}
                onChange={(e) =>
                  handleChangeSpecificationKey(key, e.target.value)
                }
                placeholder="Specification Name (e.g. Weight, Material)"
                className="flex-1"
              />
              <Input
                value={value}
                onChange={(e) =>
                  handleChangeSpecificationValue(key, e.target.value)
                }
                placeholder="Value (e.g. 5kg, Cotton)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveSpecification(key)}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle Products Section */}
      <div>
        <h3 className="text-base font-medium mb-4">Bundle Contents</h3>

        <div className="flex gap-2 mb-4">
          <Selector
            value={selectedProduct}
            onChange={(value) => setSelectedProduct(value)}
            options={availableProducts.map((product) => ({
              value: product.id,
              label: `${product.name} (${product.sku})`,
            }))}
            placeholder="Select a product to add"
            className="flex-1"
          />
          <div className="w-24">
            <Input
              type="number"
              value={selectedQuantity}
              onChange={(e) =>
                setSelectedQuantity(parseInt(e.target.value) || 1)
              }
              min="1"
              placeholder="Qty"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddProduct}
            disabled={!selectedProduct}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Add to Bundle
          </Button>
        </div>

        {bundledProducts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundledProducts.map((productId) => {
                const product = getProductById(productId);
                if (!product) return null;
                const quantity = bundledProductQuantities[productId] || 1;

                return (
                  <TableRow key={productId}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            productId,
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>
                      ${(product.price * quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveProduct(productId)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={4} className="font-medium">
                  Total Individual Value:
                </TableCell>
                <TableCell className="font-bold">
                  ${calculateTotalPrice().toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 border rounded-md text-muted-foreground">
            No products added to this bundle yet
          </div>
        )}
      </div>

      {form.watch("tags") !== undefined && (
        <TagInput
          label="Tags"
          value={form.watch("tags") || []}
          onChange={(tags: string[]) => form.setValue("tags", tags)}
          placeholder="Add tags and press Enter"
          info="Add tags to help categorize this bundle"
        />
      )}

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          <IconCheck />
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
