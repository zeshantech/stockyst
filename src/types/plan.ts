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

export interface IPlan extends IBaseEntity {
  name: string;
  description: string;
  type: PlanType;
  monthlyInterval: IInterval;
  annualInterval: IInterval;
  stripeProductId: string;
  features: { name: string; count?: number }[];
  limitations: string[];
}

export interface ISubscribeToPlanInput {
  planId: string;
  interval: IntervalType;
}

export interface ISubscribeToPlanOutput {
  subscriptionId: string;
  clientSecret: string;
  customerId: string;
}

export interface ISubscription extends IBaseEntity {
  plan: string;
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
  features: { name: string; count?: number }[];
  limitations: string[];
}

export interface IBillingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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
