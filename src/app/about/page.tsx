"use client";

import { PageHeader } from "@/components/landing/page-header";
import { PageFooter } from "@/components/landing/page-footer";
import { AboutComponent } from "@/components/landing/about-component";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="flex-grow">
        <AboutComponent />
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
