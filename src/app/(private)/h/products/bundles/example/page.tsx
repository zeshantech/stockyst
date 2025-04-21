"use client";

import { useState } from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BundleProductSelector, BundleProduct } from "@/components/(private)/dashboard/bundle-product-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function BundleProductSelectorExample() {
  const [bundleName, setBundleName] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([]);

  const handleCreateBundle = () => {
    // Validate
    if (!bundleName) {
      toast.error("Please enter a bundle name");
      return;
    }

    if (bundleProducts.length === 0) {
      toast.error("Please add at least one product to the bundle");
      return;
    }

    // Check if any products are missing IDs
    const invalidProducts = bundleProducts.filter(p => !p.productId);
    if (invalidProducts.length > 0) {
      toast.error("Please select products for all bundle items");
      return;
    }

    // In a real app, you would save the bundle
    toast.success("Bundle created successfully!");
    console.log({
      name: bundleName,
      description: bundleDescription,
      products: bundleProducts
    });

    // Reset form
    setBundleName("");
    setBundleDescription("");
    setBundleProducts([]);
  };

  return (
    <Page>
      <PageHeader
        title="Create Bundle"
        description="Example of bundle product selector component"
        action={
          <Button onClick={handleCreateBundle}>Create Bundle</Button>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bundle Information</CardTitle>
            <CardDescription>
              Enter the basic information for your product bundle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bundleName">Bundle Name</Label>
              <Input
                id="bundleName"
                value={bundleName}
                onChange={e => setBundleName(e.target.value)}
                placeholder="e.g., Office Starter Kit"
              />
            </div>
            <div>
              <Label htmlFor="bundleDescription">Description</Label>
              <Textarea
                id="bundleDescription"
                value={bundleDescription}
                onChange={e => setBundleDescription(e.target.value)}
                placeholder="Describe the bundle contents and benefits"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bundle Contents</CardTitle>
            <CardDescription>
              Add products to your bundle and set quantities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BundleProductSelector
              onChange={setBundleProducts}
              initialProducts={bundleProducts}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component API Reference</CardTitle>
            <CardDescription>
              How to use the BundleProductSelector component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Props</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">onChange:</span> (products: BundleProduct[]) {"=>"} void - Callback when products change</li>
                <li><span className="font-medium">initialProducts:</span> BundleProduct[] - Initial list of products (optional)</li>
                <li><span className="font-medium">disabled:</span> boolean - Whether the selector is disabled (optional)</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">BundleProduct Interface</h3>
              <div className="bg-muted p-4 rounded-md">
                <p>export interface BundleProduct {'{'}</p>
                <p>  productId: string;</p>
                <p>  quantity: number;</p>
                <p>{'}'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Usage Example</h3>
              <div className="bg-muted p-4 rounded-md">
                <p>import {'{ BundleProductSelector, BundleProduct }'} from '@/components/(private)/dashboard/bundle-product-selector';</p>
                <p>const [products, setProducts] = useState&lt;BundleProduct[]&gt;([]);</p>
                <p>&lt;BundleProductSelector onChange={"setProducts"} /&gt;</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
} 