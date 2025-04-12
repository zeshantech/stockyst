import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@tabler/icons-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: Icon;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
