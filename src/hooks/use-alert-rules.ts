import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertRule, AlertRuleFormData } from "@/types/stock-alerts";

// Query keys
export const ALERT_RULES_QUERY_KEYS = {
  ALL: ["alert-rules"],
  DETAIL: (id: string) => ["alert-rules", id],
};

// Mock data for development
const mockAlertRules: AlertRule[] = [
  {
    id: "1",
    name: "Low Stock Alert",
    description: "Alert when stock falls below reorder point",
    condition: {
      type: "stock_level",
      operator: "less_than",
      value: 10,
    },
    products: {
      type: "all",
    },
    notificationChannels: ["email", "browser"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Out of Stock Alert",
    description: "Alert when stock reaches zero",
    condition: {
      type: "stock_level",
      operator: "equals",
      value: 0,
    },
    products: {
      type: "all",
    },
    notificationChannels: ["email", "browser", "slack"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Expiring Stock Alert",
    description: "Alert when products are approaching their expiry date",
    condition: {
      type: "stock_age",
      operator: "less_than",
      value: 30, // 30 days before expiry
    },
    products: {
      type: "category",
      categoryIds: ["perishable", "food"],
    },
    notificationChannels: ["email", "browser"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface CreateAlertRuleParams extends AlertRuleFormData {}

interface UpdateAlertRuleParams {
  id: string;
  data: AlertRuleFormData;
}

interface DeleteAlertRuleParams {
  id: string;
}

interface ToggleAlertRuleParams {
  id: string;
  isActive: boolean;
}

export function useAlertRules() {
  const queryClient = useQueryClient();

  const { data: alertRules = [], isLoading } = useQuery({
    queryKey: ALERT_RULES_QUERY_KEYS.ALL,
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockAlertRules;
    },
  });

  const getAlertRule = async (id: string): Promise<AlertRule | undefined> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAlertRules.find((rule) => rule.id === id);
  };

  const createAlertRule = useMutation({
    mutationFn: async (params: CreateAlertRuleParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newRule: AlertRule = {
        id: `rule-${Date.now()}`,
        ...params,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERT_RULES_QUERY_KEYS.ALL });
      toast.success("Alert rule created successfully");
    },
    onError: (error) => {
      console.error("Error creating alert rule:", error);
      toast.error("Failed to create alert rule");
    },
  });

  const updateAlertRule = useMutation({
    mutationFn: async (params: UpdateAlertRuleParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedRule: AlertRule = {
        id: params.id,
        ...params.data,
        isActive:
          mockAlertRules.find((rule) => rule.id === params.id)?.isActive ||
          true,
        createdAt:
          mockAlertRules.find((rule) => rule.id === params.id)?.createdAt ||
          new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return updatedRule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ALERT_RULES_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: ALERT_RULES_QUERY_KEYS.DETAIL(data.id),
      });
      toast.success("Alert rule updated successfully");
    },
    onError: (error) => {
      console.error("Error updating alert rule:", error);
      toast.error("Failed to update alert rule");
    },
  });

  const deleteAlertRule = useMutation({
    mutationFn: async (params: DeleteAlertRuleParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return params;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ALERT_RULES_QUERY_KEYS.ALL });
      toast.success("Alert rule deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting alert rule:", error);
      toast.error("Failed to delete alert rule");
    },
  });

  const toggleAlertRule = useMutation({
    mutationFn: async (params: ToggleAlertRuleParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return params;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ALERT_RULES_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: ALERT_RULES_QUERY_KEYS.DETAIL(data.id),
      });
      toast.success(
        `Alert rule ${data.isActive ? "activated" : "deactivated"} successfully`
      );
    },
    onError: (error) => {
      console.error("Error toggling alert rule:", error);
      toast.error("Failed to update alert rule status");
    },
  });

  return {
    alertRules,
    isLoading,
    getAlertRule,
    createAlertRule: createAlertRule.mutate,
    updateAlertRule: updateAlertRule.mutate,
    deleteAlertRule: deleteAlertRule.mutate,
    toggleAlertRule: toggleAlertRule.mutate,

    isCreatingAlertRule: createAlertRule.isPending,
    isUpdatingAlertRule: updateAlertRule.isPending,
    isDeletingAlertRule: deleteAlertRule.isPending,
    isTogglingAlertRule: toggleAlertRule.isPending,
  };
}
