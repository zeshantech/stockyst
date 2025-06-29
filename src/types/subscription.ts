import { ISchema } from "./generic";
import { IntervalType } from "./plan";

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
  buttonColor: "success" | "secondary" | "default";
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
  createdAt?: Date;
}

export interface IActiveSubscription {
  id: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "incomplete_expired" | "unpaid";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  billingCycle: IntervalType;
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
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
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
