export type NotificationChannel =
  | "email"
  | "whatsapp"
  | "phone"
  | "slack"
  | "browser";

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: {
    type: "stock_level" | "stock_value" | "stock_age" | "custom";
    operator: "less_than" | "greater_than" | "equals" | "between";
    value: number;
    value2?: number; // For between operator
  };
  products: {
    type: "all" | "category" | "specific";
    ids?: string[]; // For specific products
    categoryIds?: string[]; // For category-based alerts
  };
  notificationChannels: NotificationChannel[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  channel: NotificationChannel;
  isEnabled: boolean;
  details?: {
    email?: string;
    phone?: string;
    slackWebhook?: string;
    whatsappNumber?: string;
  };
}

export interface AlertRuleFormData {
  name: string;
  description: string;
  condition: AlertRule["condition"];
  products: AlertRule["products"];
  notificationChannels: NotificationChannel[];
}
