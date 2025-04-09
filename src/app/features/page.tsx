import { PageHeader } from "@/components/landing/page-header";
import { PageFooter } from "@/components/landing/page-footer";
import { ClientFeatures } from "./client-features";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader />
      <main className="flex-1">
        <ClientFeatures />
      </main>
      <PageFooter />
    </div>
  );
}
