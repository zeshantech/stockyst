"use client";

import { Button } from "@/components/ui/button";
import { IconBuildingSkyscraper, IconChevronRight } from "@tabler/icons-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function CustomPlanRequest() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleRequestCustomPlan = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    router.push("/h/settings?tab=billing");
  };

  return (
      <Card>
        <div className="rounded-full bg-primary/10 p-3 mx-auto">
          <IconBuildingSkyscraper className="size-8" />
        </div>

        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl ">Need a Custom Solution?</CardTitle>
          <CardDescription>Let us build a tailored plan that perfectly fits your business requirements</CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-center">
          <Button onClick={handleRequestCustomPlan} className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground group">
            Request Custom Plan
            <IconChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
  );
}
