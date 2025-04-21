"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  IconArrowLeft,
  IconCheck,
  IconEdit,
  IconTrash,
  IconInfoCircle,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ICategory } from "@/components/(private)/dashboard/categories/categories-table";

// Sample data - replace with actual API call
const sampleCategory: ICategory = {
  id: "1",
  name: "Electronics",
  description: "Electronic devices and accessories",
  productCount: 45,
  status: "active",
  createdAt: "2024-01-01",
  updatedAt: "2024-03-15",
};

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryDetailsPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [category, setCategory] = React.useState<ICategory>(sampleCategory);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      status: category.status,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the local state
      setCategory({
        ...category,
        name: data.name,
        description: data.description,
        status: data.status,
      });

      toast.success("Category updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Category deleted successfully");
      router.push("/h/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/h/categories")}
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Category Details</h1>
          <p className="text-muted-foreground">
            View and manage category information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="rounded-lg border p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Input
                    {...form.register("name")}
                    label="Category Name"
                    error={form.formState.errors.name?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Textarea
                    info="Provide a clear description of what this category includes"
                    {...form.register("description")}
                    className="min-h-[100px]"
                    error={form.formState.errors.description?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Select
                    onValueChange={(value) =>
                      form.setValue("status", value as "active" | "inactive")
                    }
                    defaultValue={form.getValues("status")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconInfoCircle className="size-4" />
                    <span>Active categories can be used for products</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    <IconCheck />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Category Information</h2>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <IconEdit />
                  Edit Category
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={category.status === "active" ? "success" : "muted"}
                  >
                    {category.status.charAt(0).toUpperCase() +
                      category.status.slice(1)}
                  </Badge>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{category.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="font-medium">{category.productCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated At</p>
                  <p className="font-medium">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Status</CardTitle>
              <CardDescription>Current status of the category</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant={category.status === "active" ? "success" : "muted"}
              >
                {category.status.charAt(0).toUpperCase() +
                  category.status.slice(1)}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.status === "active"
                  ? "This category is active and can be used for products"
                  : "This category is inactive and cannot be used for products"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Products in this category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {category.productCount}
              </div>
              <p className="text-sm text-muted-foreground">
                Total products in this category
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button color="error" className="w-full" onClick={handleDelete}>
                <IconTrash />
                Delete Category
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
