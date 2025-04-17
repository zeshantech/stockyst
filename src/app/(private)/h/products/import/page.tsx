"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { useBulkUploadProducts } from "@/hooks/use-products";
import { BulkUpload } from "@/components/ui/bulk-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconDownload, IconHelp } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductImportPage() {
  const router = useRouter();
  const { mutate: bulkUploadProducts, isPending: isUploading } =
    useBulkUploadProducts();

  const handleUpload = (formData: FormData) => {
    bulkUploadProducts({ formData });
  };

  const downloadTemplate = (format: string) => {
    // In a real app, this would download a template file
    console.log(`Downloading ${format} template`);
  };

  return (
    <Page>
      <PageHeader
        title="Import Products"
        description="Bulk import products from CSV, Excel or JSON files"
        backButton
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Select a file to import products in bulk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulkUpload
                onUpload={handleUpload}
                isUploading={isUploading}
                allowedTypes={[".csv", ".xlsx", ".xls", ".json"]}
              />
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <div className="text-xs text-muted-foreground">
                Maximum file size: 10MB. Supported formats: CSV, Excel, JSON.
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>Recent product import history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-05-01 09:15</TableCell>
                    <TableCell>products-may2024.csv</TableCell>
                    <TableCell>156</TableCell>
                    <TableCell className="text-success">Completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-04-15 14:22</TableCell>
                    <TableCell>new-inventory.xlsx</TableCell>
                    <TableCell>78</TableCell>
                    <TableCell className="text-success">Completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-04-02 11:05</TableCell>
                    <TableCell>spring-collection.csv</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell className="text-warning">
                      Completed with warnings (3)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Templates & Help</CardTitle>
              <CardDescription>
                Download templates and view help docs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Download Templates</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => downloadTemplate("csv")}
                  >
                    <IconDownload />
                    CSV Template
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => downloadTemplate("excel")}
                  >
                    <IconDownload />
                    Excel Template
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => downloadTemplate("json")}
                  >
                    <IconDownload />
                    JSON Template
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="csv">
                <TabsList className="w-full">
                  <TabsTrigger value="csv" className="flex-1">
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="excel" className="flex-1">
                    Excel
                  </TabsTrigger>
                  <TabsTrigger value="json" className="flex-1">
                    JSON
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="csv" className="space-y-4">
                  <div className="rounded-md bg-muted p-3 text-xs">
                    <pre className="whitespace-pre-wrap">
                      name,sku,description,price,cost,quantity,reorderPoint,category,supplier,location,status
                      "Product A","SKU001","Description
                      here",99.99,49.99,100,20,"Category","Supplier","A1","active"
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="excel" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The Excel template includes the same columns as the CSV
                    format, but in a spreadsheet format. Download the template
                    to see the structure.
                  </p>
                </TabsContent>
                <TabsContent value="json" className="space-y-4">
                  <div className="rounded-md bg-muted p-3 text-xs">
                    <pre className="whitespace-pre-wrap">
                      {`[
  {
    "name": "Product A",
    "sku": "SKU001",
    "description": "Description here",
    "price": 99.99,
    "cost": 49.99,
    "quantity": 100,
    "reorderPoint": 20,
    "category": "Category",
    "supplier": "Supplier",
    "location": "A1",
    "status": "active"
  }
]`}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>

              <Accordion type="single" collapsible>
                <AccordionItem value="faq-1">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <IconHelp className="size-4 mr-1" />
                      Required Fields
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      The following fields are required for each product: name,
                      sku, price, category, and supplier.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <IconHelp className="size-4 mr-1" />
                      File Size Limits
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Maximum file size is 10MB. For larger imports, please
                      split your data into multiple files.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <IconHelp className="size-4 mr-1" />
                      Handling Errors
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      If there are errors in your import file, the import will
                      continue but flag issues. You'll receive a detailed report
                      of any problems that occurred.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
}
