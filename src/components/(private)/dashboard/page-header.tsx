"use client";

import React, { cloneElement, ReactElement, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconProps } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  titleIcon?: ReactElement<IconProps>;
  backButton?: boolean;
  backUrl?: string;
}

export function PageHeader({
  title,
  description,
  action,
  titleIcon,
  backButton = false,
  backUrl,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backButton ? (
          <Button variant="outline" size="icon" onClick={handleBack}>
            <IconArrowLeft size={18} />
          </Button>
        ) : null}
        {titleIcon
          ? cloneElement(titleIcon, {
              size: 18,
            })
          : null}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
