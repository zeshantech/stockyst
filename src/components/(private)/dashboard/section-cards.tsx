import { StatsCard } from "@/components/ui/stats-card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value="$1,250.00"
        trend={{
          value: 12.5,
          isPositive: true,
        }}
        description="Trending up this month"
        subtitle="Visitors for the last 6 months"
      />
      <StatsCard
        title="New Customers"
        value="1,234"
        trend={{
          value: 20,
          isPositive: false,
        }}
        description="Down 20% this period"
        subtitle="Acquisition needs attention"
      />
      <StatsCard
        title="Active Accounts"
        value="45,678"
        trend={{
          value: 12.5,
          isPositive: true,
        }}
        description="Strong user retention"
        subtitle="Engagement exceed targets"
      />
      <StatsCard
        title="Growth Rate"
        value="4.5%"
        trend={{
          value: 4.5,
          isPositive: true,
        }}
        description="Steady performance increase"
        subtitle="Meets growth projections"
      />
    </div>
  );
}
