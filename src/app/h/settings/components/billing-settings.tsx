"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IconCreditCard,
  IconCheck,
  IconAlertTriangle,
  IconReceipt,
  IconDownload,
  IconEdit,
  IconPlus,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

// Simulated billing data
const currentPlan = {
  name: "Professional",
  price: "$49",
  billingCycle: "monthly",
  features: [
    "Unlimited inventory items",
    "10 team members",
    "Advanced reporting",
    "API access",
    "Email support",
    "Custom fields",
  ],
  nextBillingDate: new Date(2023, 6, 15), // July 15, 2023
};

const availablePlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$19",
    period: "/month",
    features: [
      "Up to 500 inventory items",
      "2 team members",
      "Basic reporting",
      "Standard support",
    ],
    isPopular: false,
    buttonText: "Downgrade",
    buttonVariant: "outline" as const,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$49",
    period: "/month",
    features: [
      "Unlimited inventory items",
      "10 team members",
      "Advanced reporting",
      "API access",
      "Email support",
      "Custom fields",
    ],
    isPopular: true,
    isCurrent: true,
    buttonText: "Current Plan",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Unlimited inventory items",
      "Unlimited team members",
      "Advanced reporting + custom reports",
      "Premium API access",
      "24/7 priority support",
      "Custom fields & workflows",
      "Dedicated account manager",
    ],
    isPopular: false,
    buttonText: "Upgrade",
    buttonVariant: "default" as const,
  },
];

const paymentMethods = [
  {
    id: "card-1",
    type: "Credit Card",
    last4: "4242",
    expiryDate: "04/25",
    isDefault: true,
    cardType: "Visa",
  },
  {
    id: "card-2",
    type: "Credit Card",
    last4: "5555",
    expiryDate: "10/24",
    isDefault: false,
    cardType: "Mastercard",
  },
];

const invoices = [
  {
    id: "INV-001",
    date: new Date(2023, 5, 15), // June 15, 2023
    amount: "$49.00",
    status: "paid",
  },
  {
    id: "INV-002",
    date: new Date(2023, 4, 15), // May 15, 2023
    amount: "$49.00",
    status: "paid",
  },
  {
    id: "INV-003",
    date: new Date(2023, 3, 15), // April 15, 2023
    amount: "$49.00",
    status: "paid",
  },
];

export function BillingSettings() {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvc: "",
  });

  const [billingInfo, setBillingInfo] = useState({
    name: "Acme Inc.",
    email: "billing@acmeinc.com",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States",
  });

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate card details here
    toast.success("Payment method added successfully");
    setIsAddingCard(false);

    // Reset form
    setCardDetails({
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvc: "",
    });
  };

  const handleBillingInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success("Billing information updated successfully");
    setIsEditingBilling(false);
  };

  const handleChangePlan = (planId: string) => {
    if (planId === "professional") return; // Current plan

    toast.success(
      `Plan will be changed to ${planId} at the next billing cycle`
    );
    setIsChangingPlan(false);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your current subscription plan and usage information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md bg-primary/5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{currentPlan.name} Plan</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {currentPlan.price} billed {currentPlan.billingCycle}
              </p>
              <p className="text-sm mt-3">
                Next billing date:{" "}
                {format(currentPlan.nextBillingDate, "MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={() => setIsChangingPlan(true)}>
                Change Plan
              </Button>
            </div>
          </div>

          {isChangingPlan ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Select a Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availablePlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden ${
                      plan.isCurrent ? "border-primary" : ""
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                        Popular
                      </div>
                    )}
                    {plan.isCurrent && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                        Current
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="flex items-end gap-1 mt-2">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <IconCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full mt-4"
                        variant={plan.buttonVariant}
                        disabled={plan.isCurrent}
                        onClick={() => handleChangePlan(plan.id)}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPlan(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="font-medium">Plan Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Usage</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Team Members</Label>
                    <div className="text-sm font-medium">4 / 10</div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    4 of 10 team members used
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Storage</Label>
                    <div className="text-sm font-medium">5.2 GB / 20 GB</div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "26%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    26% of storage used
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>API Requests</Label>
                    <div className="text-sm font-medium">24,500 / 100,000</div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "24.5%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    24.5% of monthly API quota used
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAddingCard ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add Payment Method</h3>
              <form onSubmit={handleCardSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardholderName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiryDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvc: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingCard(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Card</Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <IconCreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {method.cardType} •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Expires {method.expiryDate}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <IconEdit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddingCard(true)}
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Billing Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingBilling(true)}
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {isEditingBilling ? (
                  <form
                    onSubmit={handleBillingInfoSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="billingName">Business Name</Label>
                      <Input
                        id="billingName"
                        value={billingInfo.name}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingAddress">Address</Label>
                      <Input
                        id="billingAddress"
                        value={billingInfo.address}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          value={billingInfo.city}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              city: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billingState">State</Label>
                        <Input
                          id="billingState"
                          value={billingInfo.state}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              state: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingZip">ZIP Code</Label>
                        <Input
                          id="billingZip"
                          value={billingInfo.zipCode}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              zipCode: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billingCountry">Country</Label>
                        <Input
                          id="billingCountry"
                          value={billingInfo.country}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              country: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingBilling(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2 p-4 border rounded-md bg-muted/20">
                    <div className="font-medium">{billingInfo.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {billingInfo.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {billingInfo.address}
                      <br />
                      {billingInfo.city}, {billingInfo.state}{" "}
                      {billingInfo.zipCode}
                      <br />
                      {billingInfo.country}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] text-sm font-medium p-4 bg-muted/50">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div></div>
            </div>
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center p-4 border-t"
              >
                <div className="font-medium">{invoice.id}</div>
                <div className="text-sm text-muted-foreground">
                  {format(invoice.date, "MMM d, yyyy")}
                </div>
                <div className="text-sm">{invoice.amount}</div>
                <div>
                  <Button variant="ghost" size="sm">
                    <IconDownload className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Invoices</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cancel Subscription</CardTitle>
          <CardDescription>
            Cancel your subscription and delete account data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-4 border rounded-md bg-red-50">
            <div className="mt-0.5">
              <IconAlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">
                Warning: This action cannot be undone
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Cancelling your subscription will immediately revoke access to
                premium features. Your data will be retained for 30 days after
                cancellation.
              </p>
              <Button variant="destructive" className="mt-4">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
