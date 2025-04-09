"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { ComposeEmailDialog } from "./compose-email-dialog";

export function MailSidebar() {
  const { open } = useSidebar();
  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <ComposeEmailDialog />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <Separator />
          <SidebarGroup>
            <SidebarMenu>
              {items2.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarTrigger className="absolute bottom-4 right-4" />
      </Sidebar>
    </>
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

const items = [
  {
    title: "Inbox",
    label: "128",
    icon: Inbox,
    variant: "default",
    url: "/mail/inbox",
  },
  {
    title: "Drafts",
    label: "9",
    icon: File,
    variant: "ghost",
    url: "/mail/drafts",
  },
  {
    title: "Sent",
    label: "",
    icon: Send,
    variant: "ghost",
    url: "/mail/sent",
  },
  {
    title: "Junk",
    label: "23",
    icon: ArchiveX,
    variant: "ghost",
    url: "/mail/junk",
  },
  {
    title: "Trash",
    label: "",
    icon: Trash2,
    variant: "ghost",
    url: "/mail/trash",
  },
  {
    title: "Archive",
    label: "",
    icon: Archive,
    variant: "ghost",
    url: "/mail/archive",
  },
];
const items2 = [
  {
    title: "Social",
    label: "972",
    icon: Users2,
    variant: "ghost",
    url: "/mail/social",
  },
  {
    title: "Updates",
    label: "342",
    icon: AlertCircle,
    variant: "ghost",
    url: "/mail/updates",
  },
  {
    title: "Forums",
    label: "128",
    icon: MessagesSquare,
    variant: "ghost",
    url: "/mail/forums",
  },
  {
    title: "Shopping",
    label: "8",
    icon: ShoppingCart,
    variant: "ghost",
    url: "/mail/shopping",
  },
  {
    title: "Promotions",
    label: "21",
    icon: Archive,
    variant: "ghost",
    url: "/mail/promotions",
  },
];
