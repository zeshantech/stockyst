import { ISubscriptionPlan, IActiveSubscription } from "@/types/subscription";

export const SUBSCRIPTION_PLANS: ISubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description:
      "Perfect for individuals and small startups just getting started",
    price: {
      monthly: "$0",
      yearly: "$0",
    },
    period: {
      monthly: "/month",
      yearly: "/year",
    },
    features: [
      "Up to 100 inventory items",
      "1 team member",
      "Basic reporting",
      "Community support",
      "CSV import/export",
      "7 day history retention",
    ],
    limitations: ["No API access", "No custom fields", "Limited integrations"],
    isPopular: false,
    buttonText: "Get Started",
    buttonVariant: "outline",
    stripePriceId: {
      monthly: "price_free_monthly",
      yearly: "price_free_yearly",
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing businesses with expanding inventory needs",
    price: {
      monthly: "$49",
      yearly: "$490",
    },
    period: {
      monthly: "/month",
      yearly: "/year",
    },
    features: [
      "Unlimited inventory items",
      "10 team members",
      "Advanced reporting",
      "API access",
      "Email support",
      "Custom fields",
      "All integrations",
      "Barcode scanning",
      "Batch operations",
      "Priority support",
      "1 year history retention",
    ],
    isPopular: true,
    buttonText: "Get Started",
    buttonVariant: "default",
    stripePriceId: {
      monthly: "price_pro_monthly",
      yearly: "price_pro_yearly",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Complete solution for large organizations with complex requirements",
    price: {
      monthly: "$99",
      yearly: "$990",
    },
    period: {
      monthly: "/month",
      yearly: "/year",
    },
    features: [
      "Unlimited inventory items",
      "Unlimited team members",
      "Advanced reporting + custom reports",
      "Premium API access",
      "24/7 priority support",
      "Custom fields & workflows",
      "Dedicated account manager",
      "Advanced security features",
      "Multi-location management",
      "Custom integrations",
      "Unlimited history retention",
      "SLA guarantees",
    ],
    isPopular: false,
    buttonText: "Contact Sales",
    buttonVariant: "default",
    stripePriceId: {
      monthly: "price_enterprise_monthly",
      yearly: "price_enterprise_yearly",
    },
  },
];

// Mock data for development
export const MOCK_ACTIVE_SUBSCRIPTION: IActiveSubscription = {
  id: "sub_123456789",
  planId: "professional",
  status: "active",
  currentPeriodStart: new Date(2023, 5, 15), // June 15, 2023
  currentPeriodEnd: new Date(2023, 6, 15), // July 15, 2023
  cancelAtPeriodEnd: false,
  billingCycle: "monthly" as const,
};

export const MOCK_PAYMENT_METHODS = [
  {
    id: "card-1",
    type: "Credit Card",
    last4: "4242",
    expiryDate: "04/25",
    isDefault: true,
    cardType: "Visa",
    stripePaymentMethodId: "pm_123456789",
  },
  {
    id: "card-2",
    type: "Credit Card",
    last4: "5555",
    expiryDate: "10/24",
    isDefault: false,
    cardType: "Mastercard",
    stripePaymentMethodId: "pm_987654321",
  },
];

export const MOCK_BILLING_INFO = {
  name: "Acme Inc.",
  email: "billing@acmeinc.com",
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  country: "United States",
};

export const MOCK_INVOICES = [
  {
    id: "INV-001",
    date: new Date(2023, 5, 15), // June 15, 2023
    amount: "$49.00",
    status: "paid" as const,
    invoiceUrl: "https://stripe.com/invoice/123456789",
    stripeInvoiceId: "in_123456789",
  },
  {
    id: "INV-002",
    date: new Date(2023, 4, 15), // May 15, 2023
    amount: "$49.00",
    status: "paid" as const,
    invoiceUrl: "https://stripe.com/invoice/987654321",
    stripeInvoiceId: "in_987654321",
  },
  {
    id: "INV-003",
    date: new Date(2023, 3, 15), // April 15, 2023
    amount: "$49.00",
    status: "paid" as const,
    invoiceUrl: "https://stripe.com/invoice/456789123",
    stripeInvoiceId: "in_456789123",
  },
];

export const MOCK_USAGE_STATS = {
  teamMembers: {
    used: 3,
    total: 5,
    percentage: 60,
  },
  storage: {
    used: 2.5, // GB
    total: 10, // GB
    percentage: 25,
  },
  apiRequests: {
    used: 8500,
    total: 10000,
    percentage: 85,
  },
};
