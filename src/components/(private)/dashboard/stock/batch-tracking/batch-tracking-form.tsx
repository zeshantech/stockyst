import React from "react";
import { useStocks } from "@/hooks/use-stock";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/selector";
import { DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface BatchTrackingFormProps {
  batchId?: string;
  onSuccess?: () => void;
}

const BatchTrackingForm = ({ batchId, onSuccess }: BatchTrackingFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { locations, createStock, updateStock } = useStocks();

  // Form state
  const [formData, setFormData] = React.useState({
    productId: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    quantity: "0",
    location: "",
    notes: "",
  });

  // Error state
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle selector change
  const handleSelectorChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = "Product is required";
    }

    if (!formData.batchNumber) {
      newErrors.batchNumber = "Batch number is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Quantity must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    if (batchId) {
      // Update existing batch
      updateStock({
        id: batchId,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        notes: formData.notes,
      });
    } else {
      // Create new batch
      createStock({
        productId: formData.productId,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        unitCost: 0, // This would be set properly in a real implementation
        reorderPoint: 0, // This would be set properly in a real implementation
        notes: formData.notes,
      });
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  // Location options for selector
  const locationOptions = React.useMemo(
    () =>
      locations.map((location) => ({
        label: location.name,
        value: location.id,
      })),
    [locations]
  );

  // Sample product options (in a real app, these would come from the API)
  const productOptions = [
    { label: "Laptop Pro X1", value: "1" },
    { label: "Office Chair Ergo", value: "2" },
    { label: "Wireless Mouse", value: "3" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <Selector
          label="Product"
          options={productOptions}
          value={formData.productId}
          onChange={handleSelectorChange("productId")}
          placeholder="Select product"
          error={errors.productId}
          required
        />

        <Input
          label="Batch Number"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          error={errors.batchNumber}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Manufacturing Date"
            name="manufacturingDate"
            type="date"
            value={formData.manufacturingDate}
            onChange={handleChange}
          />

          <Input
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            required
          />

          <Selector
            label="Location"
            options={locationOptions}
            value={formData.location}
            onChange={handleSelectorChange("location")}
            placeholder="Select location"
            error={errors.location}
            required
          />
        </div>

        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this batch"
          rows={3}
        />
      </div>

      <DialogFooter className="mt-6">
        <Button type="submit" loading={isLoading}>
          {batchId ? "Update Batch" : "Add Batch"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BatchTrackingForm;
