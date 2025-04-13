"use client";

import * as React from "react";

interface PageProps {
  children: React.ReactNode;
}

export function Page({ children }: PageProps) {
  return <div className="flex flex-col gap-6 p-6">{children}</div>;
}
