import { api, apiCall } from "../api";
import { ICustomPlanRequestInput, IPlan, IPlans, ISubscribeToPlanInput, ISubscribeToPlanOutput, ISubscription } from "@/types/plan";
import { IPaymentMethod } from "@/types/subscription";
import { MOCK_INVOICES } from "@/constants/subscription";
import { getLocalStorage } from "../utils";

export async function getPlans() {
  const storeId = getLocalStorage("activeStoreId");
  return apiCall<IPlans>("/subscription/plans", "GET", undefined, { "x-store-id": storeId });
}

export async function subscribeToPlan(input: ISubscribeToPlanInput) {
  const storeId = getLocalStorage("activeStoreId");
  const res = await apiCall<ISubscribeToPlanOutput>(`/subscription/subscribe`, "POST", input, { "x-store-id": storeId });

  console.log("subscribeToPlan", res);

  return res;
}

export async function getCurrentSubscription() {
  const storeId = getLocalStorage("activeStoreId");
  return apiCall<ISubscription>("/subscription/current", "GET", undefined, { "x-store-id": storeId });
}

export async function requestCustomPlan(input: ICustomPlanRequestInput) {
  const storeId = getLocalStorage("activeStoreId");
  const res = await apiCall<IPlan>("/subscription/request-custom-plan", "POST", input, { "x-store-id": storeId });

  return res;
}

export async function cancelSubscription() {
  const storeId = getLocalStorage("activeStoreId");
  return apiCall<ISubscription>("/subscription/cancel", "POST", undefined, { "x-store-id": storeId });
}

export async function getPaymentMethods() {
  const storeId = getLocalStorage("activeStoreId");
  
  return apiCall<IPaymentMethod[]>("/store/payment-methods", "GET", undefined, { "x-store-id": storeId });
}

export async function paymentMethodSetupIntent() {
  const storeId = getLocalStorage("activeStoreId");
  
  return apiCall<{ clientSecret: string }>("/store/payment-methods/setup-intent", "POST", undefined, { "x-store-id": storeId });
}

export async function createCustomerPortalSession() {
  const storeId = getLocalStorage("activeStoreId");
  return apiCall<{ url: string }>("/store/customer-portal", "GET", undefined, { "x-store-id": storeId });
}

export async function getInvoices() {
  return MOCK_INVOICES;
}
