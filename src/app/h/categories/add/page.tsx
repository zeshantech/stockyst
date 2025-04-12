"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IconArrowLeft, IconCheck, IconInfoCircle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Category created successfully");
      router.push("/h/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold">Add New Category</h1>
          <p className="text-muted-foreground">Create a new product category</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input
              {...form.register("name")}
              label="Category Name"
              placeholder="Electronics"
              error={form.formState.errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              {...form.register("description")}
              label="Description"
              placeholder="Describe the category..."
              className="min-h-[100px]"
              info="Provide a clear description of what this category includes"
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

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              <IconCheck />
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
