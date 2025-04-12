import { Metadata } from "next";
import { PageHeader } from "@/components/(public)/page-header";
import { PageFooter } from "@/components/(public)/page-footer";
import { AboutComponent } from "@/components/(public)/about-component";

export const metadata: Metadata = {
  title: "About Us | Your Company",
  description:
    "Learn about our mission, values, and the team behind Your Company.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="flex-1">
        <AboutComponent
          title="About Your Company"
          subtitle="Building the future of inventory management"
          yearFounded={2023}
          showCompanyStory={true}
          showTeam={true}
          showValues={true}
        />
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
