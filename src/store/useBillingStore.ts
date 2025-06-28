import { useCancelSubscription, useCreateCustomerPortalSession, useGetCurrentSubscription, useGetInvoices, useGetPaymentMethods, useGetSubscriptionPlans, usePaymentMethodSetupIntent, useRequestCustomPlan, useSubscribeToPlan } from "@/hooks/use-billing";
import { noop } from "@/lib/utils";
import { ICustomPlanRequestInput, ISubscribeToPlanInput, ISubscribeToPlanOutput, ISubscription, IPaymentMethod, IInvoice, IPlans } from "@/types/plan";
import { useEffect } from "react";
import { create } from "zustand";

interface IBillingStore {
  currentSubscription: ISubscription | null;
  isCurrentSubscriptionLoading: boolean;

  plans: IPlans | null;
  isPlansLoading: boolean;

  invoices: IInvoice[];
  isLoadingInvoices: boolean;

  subscribeToPlan: (input: ISubscribeToPlanInput) => void;
  isSubscribeToPlanPending: boolean;
  subscribeToPlanResult: ISubscribeToPlanOutput | null;
  clearSubscribeToPlanResult: () => void;
  isSubscribeToPlanSuccess: boolean;

  requestCustomPlan: (plan: ICustomPlanRequestInput) => Promise<void>;
  isRequestCustomPlanPending: boolean;

  cancelSubscription: () => void;
  isCancelSubscriptionPending: boolean;

  paymentMethods: IPaymentMethod[];
  isPaymentMethodsLoading: boolean;
  refetchPaymentMethods: () => void;

  paymentMethodSetupIntent: () => Promise<{ clientSecret: string }>;
  isPaymentMethodSetupIntentPending: boolean;
  paymentMethodSetupIntentResult: { clientSecret: string } | null;
  clearPaymentMethodSetupIntentResult: () => void;

  createCustomerPortalSession: () => void;
  isCreateCustomerPortalSessionPending: boolean;
}

export const useBillingStore = create<IBillingStore>((set) => ({
  currentSubscription: null,
  isCurrentSubscriptionLoading: false,

  plans: null,
  isPlansLoading: false,

  invoices: [],
  isLoadingInvoices: false,

  subscribeToPlan: noop,
  isSubscribeToPlanPending: false,
  subscribeToPlanResult: null,
  clearSubscribeToPlanResult: noop,
  isSubscribeToPlanSuccess: false,

  requestCustomPlan: noop,
  isRequestCustomPlanPending: false,

  cancelSubscription: noop,
  isCancelSubscriptionPending: false,

  paymentMethods: [],
  isPaymentMethodsLoading: false,
  refetchPaymentMethods: noop,

  paymentMethodSetupIntent: noop,
  isPaymentMethodSetupIntentPending: false,
  paymentMethodSetupIntentResult: null,
  clearPaymentMethodSetupIntentResult: noop,

  createCustomerPortalSession: noop,
  isCreateCustomerPortalSessionPending: false,
}));

export function useInitializeBillingStore() {
  const currentSubscriptionQuery = useGetCurrentSubscription();
  const plansQuery = useGetSubscriptionPlans();
  const subscribeToPlanMutation = useSubscribeToPlan();
  const requestCustomPlanMutation = useRequestCustomPlan();
  const cancelSubscriptionMutation = useCancelSubscription();
  const paymentMethodsQuery = useGetPaymentMethods();
  const paymentMethodSetupIntentMutation = usePaymentMethodSetupIntent();
  const createCustomerPortalSessionMutation = useCreateCustomerPortalSession();
  const invoicesQuery = useGetInvoices();

  useEffect(() => {
    useBillingStore.setState({
      currentSubscription: currentSubscriptionQuery.data,
      isCurrentSubscriptionLoading: currentSubscriptionQuery.isLoading,
    });
  }, [currentSubscriptionQuery.data, currentSubscriptionQuery.isLoading]);

  useEffect(() => {
    useBillingStore.setState({
      plans: plansQuery.data || null,
      isPlansLoading: plansQuery.isLoading,
    });
  }, [plansQuery.data, plansQuery.isLoading]);

  useEffect(() => {
    useBillingStore.setState({
      subscribeToPlan: (input: ISubscribeToPlanInput) => {
        subscribeToPlanMutation.mutate(input);
      },
      isSubscribeToPlanPending: subscribeToPlanMutation.isPending,
      subscribeToPlanResult: subscribeToPlanMutation.data,
      isSubscribeToPlanSuccess: subscribeToPlanMutation.isSuccess,
      clearSubscribeToPlanResult: subscribeToPlanMutation.reset,
    });
  }, [subscribeToPlanMutation.mutate, subscribeToPlanMutation.isPending]);

  useEffect(() => {
    useBillingStore.setState({
      requestCustomPlan: async (plan: ICustomPlanRequestInput) => {
        await requestCustomPlanMutation.mutateAsync(plan);
      },
      isRequestCustomPlanPending: requestCustomPlanMutation.isPending,
    });
  }, [requestCustomPlanMutation.mutate, requestCustomPlanMutation.isPending]);

  useEffect(() => {
    useBillingStore.setState({
      cancelSubscription: () => {
        cancelSubscriptionMutation.mutate();
      },
      isCancelSubscriptionPending: cancelSubscriptionMutation.isPending,
    });
  }, [cancelSubscriptionMutation.mutate, cancelSubscriptionMutation.isPending]);

  useEffect(() => {
    useBillingStore.setState({
      paymentMethods: paymentMethodsQuery.data,
      isPaymentMethodsLoading: paymentMethodsQuery.isLoading,
      refetchPaymentMethods: paymentMethodsQuery.refetch,
    });
  }, [paymentMethodsQuery.data, paymentMethodsQuery.isLoading]);

  useEffect(() => {
    useBillingStore.setState({
      paymentMethodSetupIntent: paymentMethodSetupIntentMutation.mutateAsync,
      paymentMethodSetupIntentResult: paymentMethodSetupIntentMutation.data,
      isPaymentMethodSetupIntentPending: paymentMethodSetupIntentMutation.isPending,
      clearPaymentMethodSetupIntentResult: paymentMethodSetupIntentMutation.reset,
    });
  }, [paymentMethodSetupIntentMutation.mutate, paymentMethodSetupIntentMutation.isPending, paymentMethodSetupIntentMutation.data]);

  useEffect(() => {
    useBillingStore.setState({
      createCustomerPortalSession: () => {
        createCustomerPortalSessionMutation.mutate();
      },
      isCreateCustomerPortalSessionPending: createCustomerPortalSessionMutation.isPending,
    });
  }, [createCustomerPortalSessionMutation.mutate, createCustomerPortalSessionMutation.isPending]);

  useEffect(() => {
    useBillingStore.setState({
      invoices: invoicesQuery.data,
      isLoadingInvoices: invoicesQuery.isLoading,
    });
  }, [invoicesQuery.data, invoicesQuery.isLoading]);
}
