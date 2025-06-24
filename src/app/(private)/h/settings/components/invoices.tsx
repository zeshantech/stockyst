"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDownload, IconReceipt } from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingStore } from "@/store/useBillingStore";

export function Invoices() {
  const invoices = useBillingStore((state) => state.invoices);
  const isLoadingInvoices = useBillingStore((state) => state.isLoadingInvoices);

  if (isLoadingInvoices) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices && invoices.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] text-sm font-medium p-4 bg-muted/50">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div></div>
            </div>
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center p-4 border-t">
                <div className="font-medium">{invoice.id}</div>
                <div className="text-sm text-muted-foreground">{format(new Date(invoice.date), "MMM d, yyyy")}</div>
                <div className="text-sm">{invoice.amount}</div>
                <div>
                  <Button variant="ghost" size="icon" onClick={() => window.open(invoice.invoiceUrl, "_blank")}>
                    <IconDownload />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-lg">
            <IconReceipt className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">Your billing history will appear here once you've made payments for your subscription.</p>
          </div>
        )}

        {invoices && invoices.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Invoices</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
