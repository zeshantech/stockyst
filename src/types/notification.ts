import { ISchema } from "./generic";

export type NotificationPriority = "low" | "medium" | "high";
export type NotificationType = "info" | "warning" | "success" | "error";

export interface INotification extends ISchema {
  title: string;
  description?: string;
  read?: boolean;
  priority?: NotificationPriority;
  type?: NotificationType;
  image?: string;
  link?: string;
}
