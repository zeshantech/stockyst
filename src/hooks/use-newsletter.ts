import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

export interface NewsletterSubscription {
  email: string;
}

export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiCall<{ message: string }>(
        "/newsletter",
        "POST",
        { email }
      );
      return response;
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
