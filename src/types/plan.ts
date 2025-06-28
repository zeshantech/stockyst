import { IBaseEntity } from "./generic";

export enum IntervalType {
  MONTHLY = "monthly",
  ANNUAL = "annual",
}

export enum PlanType {
  FREE = "free",
  PRO = "pro",
  CUSTOM = "custom",
}

export enum CurrencyType {
  USD = "USD",
  EUR = "EUR",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
}

export interface IInterval {
  interval: IntervalType;
  price: number;
  currency: CurrencyType;
  stripePriceId: string;
}

export interface IPlan {
  planId: string;
  name: string;
  description: string;
  type: string;
  features: Record<string, string>;
  limitations: string[];
  prices: {
    amount: number;
    currency: string;
    stripePriceId: string;
    interval: IntervalType;
  }[];
}

export interface IPlans {
  free: IPlan;
  pro: IPlan;
  custom: IPlan | null;
}

export interface ISubscribeToPlanInput {
  planId: string;
  priceId: string;
}

export interface ISubscribeToPlanOutput {
  subscriptionId: string;
  clientSecret: string;
  customerId: string;
  paymentStatus: "paid" | "pending";
}

export interface ISubscription extends IBaseEntity {
  planId: string;
  store: string;
  type: PlanType;
  status: SubscriptionStatus;
  expiresAt?: Date;
  nextBillingDate?: Date;
  billingCycle?: IntervalType;
  stripeInvoiceId?: string;
  cancelledAt?: Date;
}

export interface ICustomPlanRequestInput {
  description: string;
  companySize: number;
  features: Record<string, number | undefined>;
  limitations: string[];
}

export interface IPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface IInvoice {
  id: string;
  date: Date;
  amount: string;
  status: "paid" | "pending" | "failed";
  invoiceUrl?: string;
  stripeInvoiceId: string;
}
