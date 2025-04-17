import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface TestAlertParams {
  ruleId: string;
  productId: string;
  value: string;
  notes?: string;
}

export function useTestAlert() {
  const testAlert = useMutation({
    mutationFn: async (params: TestAlertParams) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This would be replaced with an actual API call in a real application
      return {
        success: true,
        triggered: Math.random() > 0.5, // Randomly determine if the alert is triggered for demo purposes
        message: "Alert rule test completed successfully",
      };
    },
    onSuccess: (data) => {
      if (data.triggered) {
        toast.success(
          "Alert rule test was successful - would trigger in production"
        );
      } else {
        toast.info(
          "Alert rule test was successful - would not trigger in production"
        );
      }
    },
    onError: (error) => {
      console.error("Error testing alert rule:", error);
      toast.error("Failed to test alert rule");
    },
  });

  return {
    testAlert: testAlert.mutate,
    isTestingAlert: testAlert.isPending,
  };
}
