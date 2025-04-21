import React from "react";
import { IconClipboardList, IconChartBar } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockTable } from "@/components/(private)/dashboard/stock/stock-table";
import { StockAlerts } from "@/components/(private)/dashboard/stock/stock-alerts";
import { useStocks } from "@/hooks/use-stock";

export function StockTabs() {
  const [activeTab, setActiveTab] = React.useState("inventory");

  const { stockAlerts } = useStocks();

  return (
    <Tabs
      defaultValue="inventory"
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList>
        <TabsTrigger value="inventory">
          <IconClipboardList />
          Inventory
        </TabsTrigger>
        <TabsTrigger value="alerts">
          <IconChartBar />
          Stock Alerts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inventory" className="m-0">
        <StockTable />
      </TabsContent>

      <TabsContent value="alerts" className="m-0">
        <StockAlerts alerts={stockAlerts} />
      </TabsContent>
    </Tabs>
  );
}
