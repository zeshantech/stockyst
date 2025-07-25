"use client";

import { IconCreditCard, IconDotsVertical, IconLogout, IconNotification, IconUserCircle } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="rounded-lg">{user?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.firstName}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="rounded-lg">{user?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.firstName}</span>
                  <span className="text-muted-foreground truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={"/h/settings?tab=profile"}>
                <DropdownMenuItem>
                  <IconUserCircle />
                  Account
                </DropdownMenuItem>
              </Link>
              <Link href={"/h/settings?tab=billing"}>
                <DropdownMenuItem>
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
              </Link>
              <Link href={"/h/notifications"}>
                <DropdownMenuItem>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <IconLogout />
                Log out
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
