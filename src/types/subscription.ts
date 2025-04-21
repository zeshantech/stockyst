import { ISchema } from "./generic";

export type BillingCycle = "monthly" | "yearly";

export interface ISubscriptionPlan extends Omit<ISchema, "createdAt"> {
  id: string;
  name: string;
  description?: string;
  price: {
    monthly: string;
    yearly: string;
  };
  period: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  limitations?: string[];
  isPopular: boolean;
  buttonText: string;
  buttonVariant:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
  createdAt?: Date;
}

export interface IActiveSubscription {
  id: string;
  planId: string;
  status:
    | "active"
    | "canceled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "incomplete_expired"
    | "unpaid";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  billingCycle: BillingCycle;
  nextBillingDate?: Date;
  cancelAt?: Date;
  trialEndsAt?: Date;
}

export interface IPaymentMethodInput {
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  cvc: string;
  isDefault: boolean;
  cardType: string;
}

export interface IPaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
  cardType: string;
  stripePaymentMethodId: string;
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

export interface IInvoice {
  id: string;
  date: Date;
  amount: string;
  status: "paid" | "pending" | "failed";
  invoiceUrl?: string;
  stripeInvoiceId: string;
}

export interface IUsageStats {
  teamMembers: {
    used: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  apiRequests: {
    used: number;
    total: number;
    percentage: number;
  };
}
