import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Types
export interface NewsletterSubscription {
  email: string;
}

// Query keys
export const NEWSLETTER_QUERY_KEYS = {
  SUBSCRIBE: ["newsletter", "subscribe"],
};

/**
 * Hook for subscribing to the newsletter
 * @returns Mutation object for newsletter subscription
 */
export function useNewsletterSubscribe() {
  return useMutation({
    mutationKey: NEWSLETTER_QUERY_KEYS.SUBSCRIBE,
    mutationFn: async (email: string) => {
      const response = await api.post("/api/newsletter", { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Successfully subscribed to the newsletter");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Failed to subscribe to the newsletter";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for validating an email address
 * @param email Email address to validate
 * @returns Object with validation status and error message if any
 */
export function useEmailValidation(email: string) {
  const isValid = email && email.includes("@") && email.includes(".");
  const errorMessage = !email
    ? "Email is required"
    : !isValid
    ? "Please enter a valid email address"
    : "";

  return {
    isValid,
    errorMessage,
  };
}
