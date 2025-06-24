import { api } from "../api";
import { ICustomPlanRequestInput, IPlan, ISubscribeToPlanInput, ISubscribeToPlanOutput, ISubscription } from "@/types/plan";
import { IPaymentMethod } from "@/types/subscription";
import { MOCK_INVOICES } from "@/constants/subscription";

export async function getPlans() {
  const res = await api.get<IPlan[]>("/subscription/plans");

  return res.data;
}

export async function subscribeToPlan(input: ISubscribeToPlanInput) {
  const res = await api.post<ISubscribeToPlanOutput>(`/subscription/subscribe`, input);

  return res.data;
}

export async function getCurrentSubscription() {
  const res = await api.get<ISubscription>("/subscription/current");

  return res.data;
}

export async function requestCustomPlan(input: ICustomPlanRequestInput) {
  const res = await api.post<IPlan>("/subscription/request-custom-plan", input);

  return res.data;
}

export async function cancelSubscription() {
  const res = await api.post<ISubscription>("/subscription/cancel");

  return res.data;
}

export async function getPaymentMethods() {
  const res = await api.get<IPaymentMethod[]>("/user/payment-methods");

  return res.data;
}

export async function paymentMethodSetupIntent() {
  const res = await api.post<{ clientSecret: string }>("/user/payment-methods/setup-intent");

  return res.data;
}

export async function createCustomerPortalSession() {
  const res = await api.get<{ url: string }>("/user/customer-portal");

  return res.data;
}

export async function getInvoices() {
  return MOCK_INVOICES;
}
