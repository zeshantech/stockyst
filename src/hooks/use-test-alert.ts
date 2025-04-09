import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface TestAlertParams {
  alertRuleId: string;
}

export function useTestAlert() {
  const testAlert = useMutation({
    mutationFn: async ({ alertRuleId }: TestAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Alert tested successfully");
    },
    onError: (error) => {
      console.error("Failed to test alert:", error);
      toast.error("Failed to test alert");
    },
  });

  return {
    testAlert,
  };
}
