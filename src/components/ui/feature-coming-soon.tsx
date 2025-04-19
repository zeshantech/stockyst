"use client";

import React from "react";
import { Clock, CalendarClock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FeatureComingSoonProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonLink?: string;
  className?: string;
  variant?: "default" | "minimal" | "centered";
  estimatedTime?: string;
  icon?: React.ReactNode;
}

export function FeatureComingSoon({
  title = "Feature Coming Soon",
  description = "We're working hard to bring you this feature. Stay tuned for updates!",
  showBackButton = true,
  backButtonLink,
  className,
  variant = "default",
  estimatedTime,
  icon,
}: FeatureComingSoonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backButtonLink) {
      router.push(backButtonLink);
    } else {
      router.back();
    }
  };

  const renderIcon = () => {
    if (icon) return icon;
    return variant === "minimal" ? (
      <Clock className="h-8 w-8 text-muted-foreground" />
    ) : (
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-full bg-primary/20 blur-sm"></div>
        <div className="relative bg-background rounded-full p-4 border shadow-sm">
          <CalendarClock className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  };

  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-muted/30",
          className
        )}
      >
        {renderIcon()}
        <h3 className="mt-4 text-lg font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          {description}
        </p>
        {estimatedTime && (
          <p className="mt-2 text-xs text-muted-foreground">
            Estimated availability: {estimatedTime}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-6 text-center",
        variant === "centered" ? "h-[calc(100vh-220px)]" : "",
        className
      )}
    >
      {renderIcon()}
      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-muted-foreground max-w-md">{description}</p>

      {estimatedTime && (
        <div className="mt-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
          Estimated availability: {estimatedTime}
        </div>
      )}

      {showBackButton && (
        <Button variant="outline" onClick={handleBack} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      )}
    </div>
  );
}
