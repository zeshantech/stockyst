import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as subscriptionRepositories from "@/lib/repositories/billing";
import { useUser } from "@auth0/nextjs-auth0";

// export function useSubscription() {
//   const queryClient = useQueryClient();
//   const isAuthenticated = true;

//   // Queries
//   const activeSubscriptionQuery = useQuery({
//     queryKey: SUBSCRIPTION_QUERY_KEYS.ACTIVE_SUBSCRIPTION,
//     queryFn: async () => {
//       // Return mock data instead of API call
//       return MOCK_ACTIVE_SUBSCRIPTION;
//     },
//     enabled: isAuthenticated, // Only fetch when authenticated
//   });

//   const paymentMethodsQuery = useQuery({
//     queryKey: SUBSCRIPTION_QUERY_KEYS.PAYMENT_METHODS,
//     queryFn: async () => {
//       if (!isAuthenticated) {
//         return [];
//       }
//       // Return mock data instead of API call
//       return MOCK_PAYMENT_METHODS;
//     },
//     enabled: isAuthenticated,
//   });

//   const billingInfoQuery = useQuery({
//     queryKey: SUBSCRIPTION_QUERY_KEYS.BILLING_INFO,
//     queryFn: async () => {
//       // Return mock data instead of API call
//       return MOCK_BILLING_INFO;
//     },
//     enabled: isAuthenticated,
//   });

//   const invoicesQuery = useQuery({
//     queryKey: SUBSCRIPTION_QUERY_KEYS.INVOICES,
//     queryFn: async () => {
//       if (!isAuthenticated) {
//         return [];
//       }
//       // Return mock data instead of API call
//       return MOCK_INVOICES;
//     },
//     enabled: isAuthenticated,
//   });

//   const usageStatsQuery = useQuery({
//     queryKey: SUBSCRIPTION_QUERY_KEYS.USAGE_STATS,
//     queryFn: async () => {
//       // Return mock data instead of API call
//       return MOCK_USAGE_STATS;
//     },
//     enabled: isAuthenticated,
//   });

//   // Mutations
//   const addPaymentMethodMutation = useMutation({
//     mutationFn: async (paymentMethod: Partial<IPaymentMethodInput>) => {
//       // Mock successful response instead of API call
//       return paymentMethod;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: SUBSCRIPTION_QUERY_KEYS.PAYMENT_METHODS,
//       });
//       toast.success("Payment method added successfully");
//     },
//     onError: (error) => {
//       console.error("Error adding payment method:", error);
//       toast.error("Failed to add payment method");
//     },
//   });

//   const updateBillingInfoMutation = useMutation({
//     mutationFn: async (billingInfo: Partial<IBillingInfo>) => {
//       // Mock successful response instead of API call
//       return {
//         ...MOCK_BILLING_INFO,
//         ...billingInfo,
//       } as IBillingInfo;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: SUBSCRIPTION_QUERY_KEYS.BILLING_INFO,
//       });
//       toast.success("Billing information updated successfully");
//     },
//     onError: (error) => {
//       console.error("Error updating billing information:", error);
//       toast.error("Failed to update billing information");
//     },
//   });

//   const createSubscriptionMutation = useMutation({
//     mutationFn: async ({ planId, billingCycle }: { planId: string; billingCycle: BillingCycle }) => {
//       // Mock successful response instead of API call
//       return {
//         ...MOCK_ACTIVE_SUBSCRIPTION,
//         planId,
//         billingCycle,
//         id: `sub_${Date.now()}`,
//       } as IActiveSubscription;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: SUBSCRIPTION_QUERY_KEYS.ACTIVE_SUBSCRIPTION,
//       });
//       toast.success("Subscription created successfully");
//     },
//     onError: (error) => {
//       console.error("Error creating subscription:", error);
//       toast.error("Failed to create subscription");
//     },
//   });

//   const cancelSubscriptionMutation = useMutation({
//     mutationFn: async () => {
//       // Mock successful response instead of API call
//       return {
//         ...MOCK_ACTIVE_SUBSCRIPTION,
//         status: "canceled",
//         cancelAtPeriodEnd: true,
//       } as IActiveSubscription;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: SUBSCRIPTION_QUERY_KEYS.ACTIVE_SUBSCRIPTION,
//       });
//       toast.success("Subscription cancelled successfully");
//     },
//     onError: (error) => {
//       console.error("Error cancelling subscription:", error);
//       toast.error("Failed to cancel subscription");
//     },
//   });

//   const updateSubscriptionMutation = useMutation({
//     mutationFn: async ({ planId, billingCycle }: { planId: string; billingCycle: BillingCycle }) => {
//       // Mock successful response instead of API call
//       return {
//         ...MOCK_ACTIVE_SUBSCRIPTION,
//         planId,
//         billingCycle,
//       } as IActiveSubscription;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: SUBSCRIPTION_QUERY_KEYS.ACTIVE_SUBSCRIPTION,
//       });
//       toast.success("Subscription updated successfully");
//     },
//     onError: (error) => {
//       console.error("Error updating subscription:", error);
//       toast.error("Failed to update subscription");
//     },
//   });

//   // Helper functions
//   const getSubscriptionPlanById = (planId: string): ISubscriptionPlan | undefined => {
//     return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
//   };

//   const getCurrentPlan = (): ISubscriptionPlan | undefined => {
//     const activeSubscription = activeSubscriptionQuery.data;
//     if (!activeSubscription) return undefined;
//     return getSubscriptionPlanById(activeSubscription.planId);
//   };

//   const getSubscriptionPlans = (): ISubscriptionPlan[] => {
//     return SUBSCRIPTION_PLANS;
//   };

//   // Return a comprehensive object with all subscription functionality
//   return {
//     // Data
//     activeSubscription: isAuthenticated ? activeSubscriptionQuery.data : null,
//     paymentMethods: isAuthenticated ? paymentMethodsQuery.data : [],
//     billingInfo: isAuthenticated ? billingInfoQuery.data : null,
//     invoices: isAuthenticated ? invoicesQuery.data : [],
//     usageStats: isAuthenticated ? usageStatsQuery.data : null,
//     currentPlan: isAuthenticated ? getCurrentPlan() : undefined,
//     subscriptionPlans: getSubscriptionPlans(),

//     // Loading states
//     isLoadingActiveSubscription: isAuthenticated && activeSubscriptionQuery.isLoading,
//     isLoadingPaymentMethods: isAuthenticated && paymentMethodsQuery.isLoading,
//     isLoadingBillingInfo: isAuthenticated && billingInfoQuery.isLoading,
//     isLoadingInvoices: isAuthenticated && invoicesQuery.isLoading,
//     isLoadingUsageStats: isAuthenticated && usageStatsQuery.isLoading,

//     // Error states
//     activeSubscriptionError: activeSubscriptionQuery.error,
//     paymentMethodsError: paymentMethodsQuery.error,
//     billingInfoError: billingInfoQuery.error,
//     invoicesError: invoicesQuery.error,
//     usageStatsError: usageStatsQuery.error,

//     // Mutations
//     addPaymentMethod: addPaymentMethodMutation.mutate,
//     updateBillingInfo: updateBillingInfoMutation.mutate,
//     createSubscription: createSubscriptionMutation.mutate,
//     cancelSubscription: cancelSubscriptionMutation.mutate,
//     updateSubscription: updateSubscriptionMutation.mutate,

//     // Mutation states
//     isAddingPaymentMethod: addPaymentMethodMutation.isPending,
//     isUpdatingBillingInfo: updateBillingInfoMutation.isPending,
//     isCreatingSubscription: createSubscriptionMutation.isPending,
//     isCancellingSubscription: cancelSubscriptionMutation.isPending,
//     isUpdatingSubscription: updateSubscriptionMutation.isPending,

//     // Helper functions
//     getSubscriptionPlanById,
//     getCurrentPlan,
//     getSubscriptionPlans,
//     isAuthenticated,
//   };
// }

// // For backward compatibility, export individual hooks that use the main hook
// export function useActiveSubscription() {
//   const { activeSubscription, isLoadingActiveSubscription: isLoading, activeSubscriptionError: error } = useSubscription();
//   return { data: activeSubscription, isLoading, error };
// }

// export function usePaymentMethods() {
//   const { paymentMethods, isLoadingPaymentMethods: isLoading, paymentMethodsError: error } = useSubscription();
//   return { data: paymentMethods, isLoading, error };
// }

// export function useBillingInfo() {
//   const { billingInfo, isLoadingBillingInfo: isLoading, billingInfoError: error } = useSubscription();
//   return { data: billingInfo, isLoading, error };
// }

// export function useInvoices() {
//   const { invoices, isLoadingInvoices: isLoading, invoicesError: error } = useSubscription();
//   return { data: invoices, isLoading, error };
// }

// export function useUsageStats() {
//   const { usageStats, isLoadingUsageStats: isLoading, usageStatsError: error } = useSubscription();
//   return { data: usageStats, isLoading, error };
// }

// export function useAddPaymentMethod() {
//   const { addPaymentMethod, isAddingPaymentMethod: isPending } = useSubscription();
//   return { mutate: addPaymentMethod, isPending };
// }

// export function useUpdateBillingInfo() {
//   const { updateBillingInfo, isUpdatingBillingInfo: isPending } = useSubscription();
//   return { mutate: updateBillingInfo, isPending };
// }

// export function useCreateSubscription() {
//   const { createSubscription, isCreatingSubscription: isPending } = useSubscription();
//   return {
//     mutate: createSubscription,
//     isPending,
//   };
// }

// export function useCancelSubscription() {
//   const { cancelSubscription, isCancellingSubscription: isPending } = useSubscription();
//   return {
//     mutate: cancelSubscription,
//     isPending,
//   };
// }

// export function useUpdateSubscription() {
//   const { updateSubscription, isUpdatingSubscription: isPending } = useSubscription();
//   return {
//     mutate: updateSubscription,
//     isPending,
//   };
// }

// export function useCurrentPlan() {
//   const { currentPlan, activeSubscription, isLoadingActiveSubscription: isLoading } = useSubscription();
//   return { currentPlan, activeSubscription, isLoading };
// }

export function useGetCurrentSubscription() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["subscription", "current"],
    queryFn: subscriptionRepositories.getCurrentSubscription,
    enabled: !!user,
  });
}

export function useGetSubscriptionPlans() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["subscription", "plans"],
    queryFn: subscriptionRepositories.getPlans,
    enabled: !!user,
  });
}

export function useSubscribeToPlan() {
  return useMutation({
    mutationFn: subscriptionRepositories.subscribeToPlan,
    onError: (error) => {
      toast.error(error.message || "Failed to create paid subscription");
    },
  });
}

export function useRequestCustomPlan() {
  return useMutation({
    mutationFn: subscriptionRepositories.requestCustomPlan,
    onSuccess: () => {
      toast.success("Your request has been sent", {
        description: "We will get back to you with-in 6 hours",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request custom plan");
    },
  });
}

export function useCancelSubscription() {
  return useMutation({
    mutationFn: subscriptionRepositories.cancelSubscription,
    onSuccess: () => {
      toast.success("Subscription cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
  });
}

export function useGetPaymentMethods() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["subscription", "payment-methods"],
    queryFn: subscriptionRepositories.getPaymentMethods,
    enabled: !!user,
  });
}

export function usePaymentMethodSetupIntent() {
  return useMutation({
    mutationFn: subscriptionRepositories.paymentMethodSetupIntent,
    onError: (error) => {
      toast.error(error.message || "Failed to add payment method");
    },
  });
}

export function useCreateCustomerPortalSession() {
  return useMutation({
    mutationFn: subscriptionRepositories.createCustomerPortalSession,
    onSuccess: () => {
      toast.success("Customer portal session created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create customer portal session");
    },
  });
}

export function useGetInvoices() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["subscription", "invoices"],
    queryFn: subscriptionRepositories.getInvoices,
    enabled: !!user,
  });
}

export function useStripePaymentMethod() {
  return useMutation({
    mutationFn: async ({ stripe, elements }: { stripe: any; elements: any }) => {
      if (!stripe || !elements) {
        throw new Error("Stripe or Elements not initialized");
      }

      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/h/settings?tab=billing`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Payment method added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add payment method", {
        description: error.message,
      });
    },
  });
}
