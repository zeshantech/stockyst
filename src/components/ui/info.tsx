"use client";

import * as React from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface InfoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  tooltip?: string;
}

export function Info({ className, children, tooltip, ...props }: InfoProps) {
  return (
    <div
      className={cn(
        "flex items-center border bg-muted/50 p-0. text-sm text-muted-foreground rounded",
        className
      )}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger>
          <IconInfoCircle className="size-4 cursor-help" />
        </TooltipTrigger>
        <TooltipContent>{tooltip || children}</TooltipContent>
      </Tooltip>
      {children}
    </div>
  );
}
