import { useCancelSubscription, useCreateCustomerPortalSession, useGetCurrentSubscription, useGetInvoices, useGetPaymentMethods, useGetSubscriptionPlans, usePaymentMethodSetupIntent, useRequestCustomPlan, useSubscribeToPlan } from "@/hooks/use-billing";
import { noop } from "@/lib/utils";
import { ICustomPlanRequestInput, IPlan, ISubscribeToPlanInput, IBillingInfo, ISubscribeToPlanOutput, ISubscription, IPaymentMethod, IInvoice } from "@/types/plan";
import { useEffect } from "react";
import { create } from "zustand";

interface IBillingStore {
  currentSubscription: ISubscription | null;
  isCurrentSubscriptionLoading: boolean;

  plans: IPlan[];
  isPlansLoading: boolean;

  invoices: IInvoice[];
  isLoadingInvoices: boolean;

  subscribeToPlan: (input: ISubscribeToPlanInput) => void;
  isSubscribeToPlanPending: boolean;
  subscribeToPlanResult: ISubscribeToPlanOutput | null;
  isSubscribeToPlanSuccess: boolean;

  requestCustomPlan: (plan: ICustomPlanRequestInput) => void;
  isRequestCustomPlanPending: boolean;

  cancelSubscription: () => void;
  isCancelSubscriptionPending: boolean;

  paymentMethods: IPaymentMethod[];
  isPaymentMethodsLoading: boolean;

  paymentMethodSetupIntent: () => Promise<void>;
  isPaymentMethodSetupIntentPending: boolean;
  paymentMethodSetupIntentResult: { clientSecret: string } | null;

  createCustomerPortalSession: () => void;
  isCreateCustomerPortalSessionPending: boolean;

  billingInfo: IBillingInfo | null;
  isLoadingBillingInfo: boolean;

  updateBillingInfo: (input: IBillingInfo) => void;
  isUpdateBillingInfoPending: boolean;
}

export const useBillingStore = create<IBillingStore>((set) => ({
  currentSubscription: null,
  isCurrentSubscriptionLoading: false,

  plans: [],
  isPlansLoading: false,

  invoices: [],
  isLoadingInvoices: false,

  subscribeToPlan: noop,
  isSubscribeToPlanPending: false,
  subscribeToPlanResult: null,
  isSubscribeToPlanSuccess: false,

  requestCustomPlan: noop,
  isRequestCustomPlanPending: false,

  cancelSubscription: noop,
  isCancelSubscriptionPending: false,

  paymentMethods: [],
  isPaymentMethodsLoading: false,

  paymentMethodSetupIntent: noop,
  isPaymentMethodSetupIntentPending: false,
  paymentMethodSetupIntentResult: null,

  createCustomerPortalSession: noop,
  isCreateCustomerPortalSessionPending: false,

  billingInfo: null,
  isLoadingBillingInfo: false,
  updateBillingInfo: noop,
  isUpdateBillingInfoPending: false,
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
      plans: plansQuery.data,
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
    });
  }, [subscribeToPlanMutation.mutate, subscribeToPlanMutation.isPending]);

  useEffect(() => {
    useBillingStore.setState({
      requestCustomPlan: (plan: ICustomPlanRequestInput) => {
        requestCustomPlanMutation.mutate(plan);
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
    });
  }, [paymentMethodsQuery.data, paymentMethodsQuery.isLoading]);

  useEffect(() => {
    useBillingStore.setState({
      paymentMethodSetupIntent: async () => {
        await paymentMethodSetupIntentMutation.mutateAsync();
      },
      paymentMethodSetupIntentResult: paymentMethodSetupIntentMutation.data,
      isPaymentMethodSetupIntentPending: paymentMethodSetupIntentMutation.isPending,
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
