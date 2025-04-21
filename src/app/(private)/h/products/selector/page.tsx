"use client";

import { useState } from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { ProductSelector } from "@/components/(private)/dashboard/product-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProductSelectorPage() {
  const [singleProductId, setSingleProductId] = useState<string[]>([]);
  const [multipleProductIds, setMultipleProductIds] = useState<string[]>([]);
  const { products } = useProducts();

  const selectedSingleProduct = products.find(p => p.id === singleProductId[0]);
  const selectedMultipleProducts = products.filter(p => multipleProductIds.includes(p.id));

  return (
    <Page>
      <PageHeader
        title="Product Selector"
        description="Example of single and multiple product selection components"
      />

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage Examples</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Single Product Selection</CardTitle>
                <CardDescription>
                  Select a single product from the product catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProductSelector
                  selectedProductIds={singleProductId}
                  onSelect={setSingleProductId}
                  placeholder="Select a product"
                  multiple={false}
                />

                {selectedSingleProduct && (
                  <div className="mt-4 border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Selected Product:</h3>
                    <div className="flex flex-col gap-1">
                      <p><span className="font-medium">Name:</span> {selectedSingleProduct.name}</p>
                      <p><span className="font-medium">SKU:</span> {selectedSingleProduct.sku}</p>
                      <p><span className="font-medium">Price:</span> ${selectedSingleProduct.price.toFixed(2)}</p>
                      <p><span className="font-medium">In Stock:</span> {selectedSingleProduct.quantity}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge variant={selectedSingleProduct.status === 'active' ? 'success' : 'secondary'} className="ml-2">
                          {selectedSingleProduct.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multiple Product Selection</CardTitle>
                <CardDescription>
                  Select multiple products from the product catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProductSelector
                  selectedProductIds={multipleProductIds}
                  onSelect={setMultipleProductIds}
                  placeholder="Select products"
                  multiple={true}
                />

                {selectedMultipleProducts.length > 0 && (
                  <div className="mt-4 border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Selected Products ({selectedMultipleProducts.length}):</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>In Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMultipleProducts.map(product => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-between">
                      <span>Total Products: {selectedMultipleProducts.length}</span>
                      <span>Total Value: ${selectedMultipleProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ProductSelector Component</CardTitle>
              <CardDescription>
                API reference for the ProductSelector component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-2">Props</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">multiple</TableCell>
                    <TableCell>boolean</TableCell>
                    <TableCell>false</TableCell>
                    <TableCell>Enable multiple selection</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">selectedProductIds</TableCell>
                    <TableCell>string[]</TableCell>
                    <TableCell>[]</TableCell>
                    <TableCell>IDs of selected products</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">onSelect</TableCell>
                    <TableCell>(productIds: string[]) {"=>"} void</TableCell>
                    <TableCell>required</TableCell>
                    <TableCell>Callback when selection changes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">placeholder</TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>"Select products"</TableCell>
                    <TableCell>Placeholder text when nothing is selected</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">maxItems</TableCell>
                    <TableCell>number</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>Max items to show in selection summary</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">disabled</TableCell>
                    <TableCell>boolean</TableCell>
                    <TableCell>false</TableCell>
                    <TableCell>Disable the selector</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">className</TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>undefined</TableCell>
                    <TableCell>Additional CSS classes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">showImages</TableCell>
                    <TableCell>boolean</TableCell>
                    <TableCell>true</TableCell>
                    <TableCell>Show product images in dropdown</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">preloadedProducts</TableCell>
                    <TableCell>IProduct[]</TableCell>
                    <TableCell>undefined</TableCell>
                    <TableCell>Use custom products instead of loading from hook</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="text-lg font-medium mt-6 mb-2">Usage Example</h3>
              
              <div className="bg-muted p-4 rounded-md overflow-auto text-sm">
                <p>See the examples above for usage patterns.</p>
                <p className="mt-2">The component supports both single and multiple selection modes.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
} 