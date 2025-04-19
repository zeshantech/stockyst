"use client";

import React from "react";
import { Page } from "@/components/(private)/dashboard/page";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { FeatureComingSoon } from "@/components/ui/feature-coming-soon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanBarcode, Tag, FileCheck, Barcode } from "lucide-react";

export default function SerializePage() {
  return (
    <Page>
      <PageHeader
        title="Stock Serialization"
        description="Track and manage serialized inventory items"
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Serial Number Management</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Serial Number Tracking"
              description="Assign, track, and manage unique serial numbers for individual stock items"
              variant="minimal"
              showBackButton={false}
              estimatedTime="Q3 2024"
              icon={<Tag className="h-8 w-8 text-muted-foreground" />}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Barcode Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Barcode Scanning"
                description="Scan barcodes and QR codes to quickly identify and process serialized items"
                variant="minimal"
                showBackButton={false}
                icon={<ScanBarcode className="h-8 w-8 text-muted-foreground" />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serial Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Serial Number Validation"
                description="Enforce rules and validation for serial number formats and uniqueness"
                variant="minimal"
                showBackButton={false}
                icon={<FileCheck className="h-8 w-8 text-muted-foreground" />}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Label Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Serial Number Labels"
              description="Generate and print labels with serial numbers and barcodes for physical tracking"
              variant="minimal"
              showBackButton={false}
              icon={<Barcode className="h-8 w-8 text-muted-foreground" />}
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
