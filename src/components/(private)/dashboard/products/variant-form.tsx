"use client";

import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";
import { IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { IProduct, VariantFormValues } from "@/types/product";
import {
  useProductCategories,
  useProductSuppliers,
  useAllProducts,
} from "@/hooks/use-products";
import { TagInput } from "@/components/ui/tag-input";

// Form validation schema
const variantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Variant name must be at least 2 characters.",
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
  parentProduct: z.string().optional(),
  variantAttributes: z.record(z.string(), z.string()).optional(),
  image: z.string().optional(),
});

const defaultValues: Partial<VariantFormValues> = {
  name: "",
  sku: "",
  description: "",
  categoryId: "",
  price: "",
  cost: "",
  quantity: "0",
  reorderPoint: "10",
  supplierId: "",
  location: "",
  status: "active",
  tags: ["variant"],
  specifications: {},
  variantAttributes: { size: "", color: "" },
  image: "",
};

interface VariantFormProps {
  initialValues?: Partial<VariantFormValues>;
  onSubmit: (data: VariantFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

export function VariantForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Variant",
  cancelButtonText = "Cancel",
  onCancel,
}: VariantFormProps) {
  const { data: categories = [] } = useProductCategories();
  const { data: suppliers = [] } = useProductSuppliers();
  const { data: allProducts = [] } = useAllProducts();

  // Filter out products that could be parents (not variants themselves)
  const parentProducts = useMemo(() => {
    return allProducts.filter((product) => !product.tags.includes("variant"));
  }, [allProducts]);
  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema) as Resolver<VariantFormValues>,
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const variantAttributes = form.watch("variantAttributes") || {};
  const specifications = form.watch("specifications") || {};

  const handleAddAttribute = () => {
    const newAttributes = { ...variantAttributes, "": "" };
    form.setValue("variantAttributes", newAttributes);
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...variantAttributes };
    delete newAttributes[key];
    form.setValue("variantAttributes", newAttributes);
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

  const handleChangeAttributeKey = (oldKey: string, newKey: string) => {
    const newAttributes = { ...variantAttributes };
    const value = newAttributes[oldKey];
    delete newAttributes[oldKey];
    newAttributes[newKey] = value;
    form.setValue("variantAttributes", newAttributes);
  };

  const handleChangeAttributeValue = (key: string, value: string) => {
    const newAttributes = { ...variantAttributes };
    newAttributes[key] = value;
    form.setValue("variantAttributes", newAttributes);
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

  const handleSubmit = (data: VariantFormValues) => {
    // Ensure "variant" tag is included
    const tags = data.tags || [];
    if (!tags.includes("variant")) {
      tags.push("variant");
    }
    data.tags = tags;

    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          {...form.register("name")}
          label="Variant Name"
          placeholder="Enter variant name (e.g. T-Shirt - Red - Large)"
          error={form.formState.errors.name?.message}
          required
        />

        <Input
          {...form.register("sku")}
          label="SKU"
          placeholder="Enter SKU (e.g. TSHIRT-RED-L)"
          error={form.formState.errors.sku?.message}
          required
        />

        <Selector
          label="Category"
          value={form.watch("categoryId")}
          onChange={(value) => form.setValue("categoryId", value)}
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          placeholder="Select a category"
          error={form.formState.errors.categoryId?.message}
          required
        />

        <Selector
          label="Parent Product"
          value={form.watch("parentProduct") || ""}
          onChange={(value) => form.setValue("parentProduct", value)}
          options={parentProducts.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
          placeholder="Select parent product"
          info="Optional. Select the main product this is a variant of"
          error={form.formState.errors.parentProduct?.message}
        />

        <Input
          {...form.register("price")}
          type="number"
          label="Price"
          placeholder="0.00"
          step="0.01"
          min="0"
          error={form.formState.errors.price?.message}
          required
        />

        <Input
          {...form.register("cost")}
          type="number"
          label="Cost"
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
          placeholder="10"
          min="0"
          info="The quantity at which to reorder this variant"
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

        <Selector
          label="Supplier"
          value={form.watch("supplierId")}
          onChange={(value) => form.setValue("supplierId", value)}
          options={suppliers.map((supplier) => ({
            value: supplier.id,
            label: supplier.name,
          }))}
          placeholder="Select a supplier"
          error={form.formState.errors.supplierId?.message}
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
        placeholder="Enter variant description"
        className="min-h-[100px]"
        error={form.formState.errors.description?.message}
        required
      />

      {/* Variant Attributes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium">Variant Attributes</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAttribute}
          >
            Add Attribute
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(variantAttributes).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <Input
                value={key}
                onChange={(e) => handleChangeAttributeKey(key, e.target.value)}
                placeholder="Attribute (e.g. Size, Color)"
                className="flex-1"
              />
              <Input
                value={value}
                onChange={(e) =>
                  handleChangeAttributeValue(key, e.target.value)
                }
                placeholder="Value (e.g. Large, Red)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveAttribute(key)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

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
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      {form.watch("tags") !== undefined && (
        <TagInput
          label="Tags"
          value={form.watch("tags") || []}
          onChange={(tags: string[]) => form.setValue("tags", tags)}
          placeholder="Add tags and press Enter"
          info="Add tags to help categorize this variant"
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
