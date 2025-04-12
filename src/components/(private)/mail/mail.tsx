"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { useMail } from "@/hooks/use-mail";
import type { IMail } from "@/types/mail";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { MailList } from "./mail-list";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { MailDisplay } from "./mail-display";

interface MailProps {
  mails: IMail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({ mails, defaultLayout = [75, 25] }: MailProps) {
  const [mail] = useMail();

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={defaultLayout[0]}>
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Inbox</h1>
            <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                All mail
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="all" className="m-0">
            <MailList items={mails} />
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <MailList items={mails.filter((item) => !item.read)} />
          </TabsContent>
        </Tabs>
      </ResizablePanel>

      <ResizableHandle withHandle />
      <ResizablePanel minSize={30} defaultSize={defaultLayout[1]}>
        <MailDisplay
          mail={mails.find((item) => item.id === mail.selected) || null}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

// <TooltipProvider delayDuration={0}>
//   <ResizablePanelGroup
//     direction="horizontal"
//     onLayout={(sizes: number[]) => {
//       document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
//         sizes
//       )}`;
//     }}
//     className="h-full max-h-[800px] items-stretch"
//   >
//     <ResizablePanel
//       defaultSize={defaultLayout[0]}
//       collapsedSize={navCollapsedSize}
//       collapsible={true}
//       minSize={15}
//       maxSize={20}
//       onCollapse={() => {
//         setIsCollapsed(true);
//         document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
//           true
//         )}`;
//       }}
//       onResize={() => {
//         setIsCollapsed(false);
//         document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
//           false
//         )}`;
//       }}
//       className={cn(
//         isCollapsed &&
//           "min-w-[50px] transition-all duration-300 ease-in-out"
//       )}
//     >
//       <div
//         className={cn(
//           "flex h-[52px] items-center justify-center",
//           isCollapsed ? "h-[52px]" : "px-2"
//         )}
//       >
//         <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
//       </div>
//       <Separator />
//       <Nav
//         isCollapsed={isCollapsed}
//         links={
// }
//       />
//       <Separator />
//       <Nav
//         isCollapsed={isCollapsed}
//         links={}
//       />
//     </ResizablePanel>
//     <ResizableHandle withHandle />
//     <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
//       <Tabs defaultValue="all">
//         <div className="flex items-center px-4 py-2">
//           <h1 className="text-xl font-bold">Inbox</h1>
//           <TabsList className="ml-auto">
//             <TabsTrigger
//               value="all"
//               className="text-zinc-600 dark:text-zinc-200"
//             >
//               All mail
//             </TabsTrigger>
//             <TabsTrigger
//               value="unread"
//               className="text-zinc-600 dark:text-zinc-200"
//             >
//               Unread
//             </TabsTrigger>
//           </TabsList>
//         </div>
//         <Separator />
//         <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <form>
//             <div className="relative">
//               <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
//               <Input placeholder="Search" className="pl-8" />
//             </div>
//           </form>
//         </div>
//         <TabsContent value="all" className="m-0">
//           <MailList items={mails} />
//         </TabsContent>
//         <TabsContent value="unread" className="m-0">
//           <MailList items={mails.filter((item) => !item.read)} />
//         </TabsContent>
//       </Tabs>
//     </ResizablePanel>
//     <ResizableHandle withHandle />
//     <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
//       <MailDisplay
//         mail={mails.find((item) => item.id === mail.selected) || null}
//       />
//     </ResizablePanel>
//   </ResizablePanelGroup>
// </TooltipProvider>
