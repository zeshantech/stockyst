import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPlan, IntervalType } from "@/types/plan";
import { useBillingStore } from "@/store/useBillingStore";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { useAuth, useClerk } from "@clerk/nextjs";

interface PricingCardProps extends IPlan {
  activeTab: IntervalType;
  className?: string;
  isPopular?: boolean;
}

export function PricingCard({ planId, name, description, features, limitations, prices, activeTab, className, isPopular }: PricingCardProps) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const activePrice = useMemo(() => prices.find((price) => price.interval === activeTab), [prices, activeTab]);
  const isPremiumPlan = name === "Pro" || name === "Custom";

  const handlePlanSelect = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    router.push("/h/settings?tab=billing");
  };

  return (
    <Card className={cn("flex flex-col border-border/40", isPopular && "border-primary shadow-lg scale-[1.02]", isPremiumPlan && "bg-gradient-to-br from-background to-primary/5 border-primary/30", className)}>
      <CardHeader>
        {isPopular && (
          <Badge className="w-fit mb-2" variant="outline">
            Most Popular
          </Badge>
        )}
        {isPremiumPlan && (
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{name === "Pro" ? "Premium" : "Enterprise"}</Badge>
          </div>
        )}
        <CardTitle className={cn("text-xl font-bold", isPremiumPlan && "text-primary")}>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="mt-4">
          <span className={cn("text-3xl font-bold", isPremiumPlan && "bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70")}>${activePrice?.amount}</span>
          <span className="text-muted-foreground ml-1">/{activeTab === "monthly" ? "month" : "year"}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {Object.entries(features).map(([key, value]) => (
            <li key={key} className="flex items-start gap-2">
              <Check className={cn("h-5 w-5 flex-shrink-0 mt-0.5", isPremiumPlan ? "text-primary" : "text-primary")} />
              <span>{key === "members" ? `${value} team members` : key}</span>
            </li>
          ))}
        </ul>
        {limitations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Limitations:</h4>
            <ul className="space-y-1">
              {limitations.map((limitation, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handlePlanSelect} className={cn("w-full", isPremiumPlan && !isPopular && "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground")} variant={isPopular ? "default" : isPremiumPlan ? "default" : "outline"}>
          {isSignedIn ? "Go to Settings" : "Login to continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
