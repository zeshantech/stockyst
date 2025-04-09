"use client";

import { PageHeader } from "@/components/landing/page-header";
import { PageFooter } from "@/components/landing/page-footer";
import { RequestDemoComponent } from "@/components/landing/request-demo-component";

export default function RequestDemoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="flex-grow bg-muted/30">
        <RequestDemoComponent />
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
