import { PageHeader } from "@/components/(public)/page-header";
import { PageFooter } from "@/components/(public)/page-footer";
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
