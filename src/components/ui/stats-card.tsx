import React, { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "./badge";

interface StatsCardProps {
  title: string;
  value: string | number;
  badge?: ReactNode;
  trend: {
    value: number;
    isPositive: boolean;
  };
  description: string;
  subtitle: string;
}

export function StatsCard({
  title,
  value,
  trend,
  description,
  subtitle,
  badge,
}: StatsCardProps) {
  const TrendIcon = trend.isPositive ? IconTrendingUp : IconTrendingDown;
  const trendValue = `${trend.isPositive ? "+" : ""}${trend.value}%`;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          {badge && (
            <Badge variant="outline">
              <TrendIcon />
              {trendValue}
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description} <TrendIcon />
        </div>
        <div className="text-muted-foreground">{subtitle}</div>
      </CardFooter>
    </Card>
  );
}
