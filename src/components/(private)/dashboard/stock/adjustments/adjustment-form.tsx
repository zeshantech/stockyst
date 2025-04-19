import React from "react";
import { useStocks } from "@/hooks/use-stock";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/selector";
import { DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface AdjustmentFormProps {
  adjustmentId?: string;
  onSuccess?: () => void;
}

const AdjustmentForm = ({ adjustmentId, onSuccess }: AdjustmentFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { locations, stocks, createStockAdjustment, updateStockAdjustment } =
    useStocks();

  // Form state
  const [formData, setFormData] = React.useState({
    type: "addition",
    locationId: "",
    reason: "",
    notes: "",
    stockId: "",
    adjustmentQuantity: "0",
    itemReason: "",
    itemNotes: "",
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

    if (!formData.type) {
      newErrors.type = "Adjustment type is required";
    }

    if (!formData.locationId) {
      newErrors.locationId = "Location is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    if (!formData.stockId) {
      newErrors.stockId = "Stock item is required";
    }

    if (formData.adjustmentQuantity === "0") {
      newErrors.adjustmentQuantity = "Adjustment quantity must not be zero";
    }

    if (!formData.itemReason.trim()) {
      newErrors.itemReason = "Item reason is required";
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

    // Get the selected stock item
    const stockItem = stocks.find((item) => item.id === formData.stockId);
    if (!stockItem) {
      setErrors((prev) => ({
        ...prev,
        stockId: "Invalid stock item selected",
      }));
      setIsLoading(false);
      return;
    }

    // Calculate adjustment quantity based on type
    let adjustmentQty = parseInt(formData.adjustmentQuantity);
    if (formData.type === "subtraction" || formData.type === "write-off") {
      adjustmentQty = -Math.abs(adjustmentQty);
    } else {
      adjustmentQty = Math.abs(adjustmentQty);
    }

    // Calculate new quantity
    const newQuantity = stockItem.quantity + adjustmentQty;

    // Check for negative quantity
    if (newQuantity < 0) {
      setErrors((prev) => ({
        ...prev,
        adjustmentQuantity: "Cannot adjust to negative quantity",
      }));
      setIsLoading(false);
      return;
    }

    // Prepare the adjustment items
    const adjustmentItem = {
      stockId: formData.stockId,
      productName: stockItem.productName,
      sku: stockItem.sku,
      previousQuantity: stockItem.quantity,
      adjustmentQuantity: adjustmentQty,
      newQuantity: newQuantity,
      reason: formData.itemReason,
      notes: formData.itemNotes,
    };

    // Create or update adjustment
    if (adjustmentId) {
      // This would be fleshed out in a real implementation
      updateStockAdjustment({
        id: adjustmentId,
        status: "pending-approval",
        notes: formData.notes,
      });
    } else {
      // Create new adjustment
      createStockAdjustment({
        type: formData.type as any,
        locationId: formData.locationId,
        reason: formData.reason,
        items: [
          {
            stockId: formData.stockId,
            adjustmentQuantity: adjustmentQty,
            reason: formData.itemReason,
            notes: formData.itemNotes,
          },
        ],
        notes: formData.notes,
      });
    }

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  // Get location options for selector
  const locationOptions = React.useMemo(
    () =>
      locations.map((location) => ({
        label: location.name,
        value: location.id,
      })),
    [locations]
  );

  // Get stock options for selector
  const stockOptions = React.useMemo(
    () =>
      stocks.map((item) => ({
        label: `${item.productName} (${item.sku}) - ${item.quantity} units`,
        value: item.id,
      })),
    [stocks]
  );

  // Type options
  const typeOptions = [
    { label: "Addition", value: "addition" },
    { label: "Subtraction", value: "subtraction" },
    { label: "Correction", value: "correction" },
    { label: "Write-off", value: "write-off" },
  ];

  // Get selected stock item
  const selectedStock = formData.stockId
    ? stocks.find((item) => item.id === formData.stockId)
    : null;

  // Calculate preview of new quantity
  const calculateNewQuantity = () => {
    if (!selectedStock) return 0;

    let adjustmentQty = parseInt(formData.adjustmentQuantity) || 0;
    if (formData.type === "subtraction" || formData.type === "write-off") {
      adjustmentQty = -Math.abs(adjustmentQty);
    } else {
      adjustmentQty = Math.abs(adjustmentQty);
    }

    return selectedStock.quantity + adjustmentQty;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Selector
            label="Adjustment Type"
            options={typeOptions}
            value={formData.type}
            onChange={handleSelectorChange("type")}
            placeholder="Select type"
            error={errors.type}
            required
            info={
              formData.type === "addition"
                ? "Add stock to inventory"
                : formData.type === "subtraction"
                ? "Remove stock from inventory"
                : formData.type === "correction"
                ? "Correct inventory count"
                : "Write off damaged or obsolete stock"
            }
          />

          <Selector
            label="Location"
            options={locationOptions}
            value={formData.locationId}
            onChange={handleSelectorChange("locationId")}
            placeholder="Select location"
            error={errors.locationId}
            required
          />
        </div>

        <Input
          label="Adjustment Reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for this adjustment"
          error={errors.reason}
          info="Provide a clear reason for making this adjustment"
          required
        />

        <Textarea
          label="Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes"
        />

        <div className="border p-4 rounded-md space-y-4">
          <h3 className="font-medium">Adjustment Items</h3>

          <Selector
            label="Stock Item"
            options={stockOptions}
            value={formData.stockId}
            onChange={handleSelectorChange("stockId")}
            placeholder="Select stock item"
            error={errors.stockId}
            required
          />

          {selectedStock && (
            <div className="text-sm bg-muted/30 p-3 rounded-md">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">
                    Current Quantity:
                  </span>{" "}
                  <span className="font-medium">{selectedStock.quantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span className="font-medium">{selectedStock.location}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={
                formData.type === "addition" || formData.type === "correction"
                  ? "Quantity to Add"
                  : "Quantity to Remove"
              }
              name="adjustmentQuantity"
              type="number"
              min={1}
              value={formData.adjustmentQuantity}
              onChange={handleChange}
              error={errors.adjustmentQuantity}
              required
              info={
                selectedStock
                  ? `New quantity will be: ${calculateNewQuantity()}`
                  : undefined
              }
            />

            <Input
              label="Item Reason"
              name="itemReason"
              value={formData.itemReason}
              onChange={handleChange}
              placeholder="Reason for adjusting this item"
              error={errors.itemReason}
              required
            />
          </div>

          <Textarea
            label="Item Notes (Optional)"
            name="itemNotes"
            value={formData.itemNotes}
            onChange={handleChange}
            placeholder="Additional notes for this item"
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner size="sm" className="mr-2" />}
          {adjustmentId ? "Update Adjustment" : "Create Adjustment"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AdjustmentForm;
