"use client";

import React, { useState, useEffect } from "react";
import { ProductSelector } from "./product-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent } from "@/components/ui/card";
import { IProduct } from "@/types/product";

export interface BundleProduct {
  productId: string;
  quantity: number;
}

interface BundleProductSelectorProps {
  onChange: (products: BundleProduct[]) => void;
  initialProducts?: BundleProduct[];
  disabled?: boolean;
}

export function BundleProductSelector({
  onChange,
  initialProducts = [],
  disabled = false,
}: BundleProductSelectorProps) {
  const [products, setProducts] = useState<BundleProduct[]>(initialProducts);
  const { products: allProducts } = useProducts();

  useEffect(() => {
    if (initialProducts.length > 0 && products.length === 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts, products.length]);

  const handleAddProduct = () => {
    const newProducts = [...products, { productId: "", quantity: 1 }];
    setProducts(newProducts);
    onChange(newProducts);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
    onChange(newProducts);
  };

  const handleProductChange = (index: number, productIds: string[]) => {
    const productId = productIds.length > 0 ? productIds[0] : "";
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], productId };
    setProducts(newProducts);
    onChange(newProducts);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], quantity };
    setProducts(newProducts);
    onChange(newProducts);
  };

  const getProductDetails = (productId: string): IProduct | undefined => {
    return allProducts.find((p) => p.id === productId);
  };

  const calculateTotalValue = (): number => {
    return products.reduce((total, item) => {
      const product = getProductDetails(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Bundle Products</h3>
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={handleAddProduct}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No products added to this bundle yet
        </p>
      ) : (
        <div className="space-y-3">
          {products.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      Product
                    </label>
                    <ProductSelector
                      selectedProductIds={[item.productId]}
                      onSelect={(ids) => handleProductChange(index, ids)}
                      placeholder="Select a product"
                      disabled={disabled}
                    />
                  </div>
                  <div className="w-full sm:w-36">
                    <label className="text-sm font-medium mb-1 block">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          index,
                          parseInt(e.target.value) || 1
                        )
                      }
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex items-end sm:ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      disabled={disabled}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {item.productId && (
                  <div className="flex justify-between mt-3 text-sm">
                    <div className="text-muted-foreground">
                      {getProductDetails(item.productId)?.name} ×{" "}
                      {item.quantity}
                    </div>
                    <div>
                      $
                      {getProductDetails(item.productId)?.price &&
                        (
                          getProductDetails(item.productId)!.price *
                          item.quantity
                        ).toFixed(2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between p-3 border rounded-md mt-4 font-medium">
            <span>Total Value:</span>
            <span>${calculateTotalValue().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
