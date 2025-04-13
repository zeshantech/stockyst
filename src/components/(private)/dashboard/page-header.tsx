import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  backButtonHref?: string;
}

export function PageHeader({
  title,
  description,
  action,
  backButtonHref,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backButtonHref && (
          <Button variant="outline" size="icon" href={backButtonHref}>
            <IconArrowLeft />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
