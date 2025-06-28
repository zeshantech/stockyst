import * as React from "react";
import NextLink from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { Loader } from "lucide-react";

const buttonVariants = cva("inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
  variants: {
    variant: {
      default: "",
      outline: "border",
      ghost: "",
      link: "underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3 min-w-[100px]",
      xs: "px-2 text-xs rounded-sm gap-1 has-[>svg]:px-1.5 min-w-[60px]",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 min-w-[80px]",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4 min-w-[120px]",
      icon: "size-9",
      iconSm: "!size-6 rounded-sm [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    },
    color: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 [&.outline]:border-primary/30 [&.outline]:bg-primary/10 [&.outline]:text-primary [&.outline]:hover:bg-primary/20 [&.ghost]:text-primary [&.ghost]:hover:bg-primary/10 [&.ghost]:bg-transparent [&.link]:text-primary [&.link]:hover:text-primary/90 [&.link]:bg-transparent",
      secondary: "bg-secondary text-white hover:bg-secondary/90 focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 [&.outline]:border-secondary/30 [&.outline]:bg-secondary/10 [&.outline]:text-secondary [&.outline]:hover:bg-secondary/20 [&.ghost]:text-secondary [&.ghost]:hover:bg-secondary/10 [&.ghost]:bg-transparent [&.link]:text-secondary [&.link]:hover:text-secondary/90 [&.link]:bg-transparent",
      error: "bg-error text-white hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 [&.outline]:border-error/30 [&.outline]:bg-error/10 [&.outline]:text-error [&.outline]:hover:bg-error/20 [&.ghost]:text-error [&.ghost]:hover:bg-error/10 [&.ghost]:bg-transparent [&.link]:text-error [&.link]:hover:text-error/90 [&.link]:bg-transparent",
      success: "bg-success text-white hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 [&.outline]:border-success/30 [&.outline]:bg-success/10 [&.outline]:text-success [&.outline]:hover:bg-success/20 [&.ghost]:text-success [&.ghost]:hover:bg-success/10 [&.ghost]:bg-transparent [&.link]:text-success [&.link]:hover:text-success/90 [&.link]:bg-transparent",
      info: "bg-info text-white hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 [&.outline]:border-info/30 [&.outline]:bg-info/10 [&.outline]:text-info [&.outline]:hover:bg-info/20 [&.ghost]:text-info [&.ghost]:hover:bg-info/10 [&.ghost]:bg-transparent [&.link]:text-info [&.link]:hover:text-info/90 [&.link]:bg-transparent",
      warning: "bg-warning text-white hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 [&.outline]:border-warning/30 [&.outline]:bg-warning/10 [&.outline]:text-warning [&.outline]:hover:bg-warning/20 [&.ghost]:text-warning [&.ghost]:hover:bg-warning/10 [&.ghost]:bg-transparent [&.link]:text-warning [&.link]:hover:text-warning/90 [&.link]:bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    color: "default",
  },
  compoundVariants: [
    {
      variant: "outline",
      className: "outline",
    },
    {
      variant: "ghost",
      className: "ghost",
    },
    {
      variant: "link",
      className: "link",
    },
  ],
});

export const buttonLoaderVariants = cva("animate-spin", {
  variants: {
    size: {
      default: "size-4",
      xs: "size-3",
      sm: "size-4",
      lg: "size-5",
      icon: "size-6",
      iconSm: "size-4",
    },
  },
});

const ButtonLoader = ({ size }: VariantProps<typeof buttonLoaderVariants>) => {
  return (
    <div>
      <Loader size="sm" className={buttonLoaderVariants({ size })} />
    </div>
  );
};

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  loading?: boolean;
  color?: "default" | "secondary" | "error" | "success" | "info" | "warning";
}

function Button({ className, variant, size, color, asChild = false, href, loading = false, children, disabled, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  if (href) {
    return (
      <NextLink href={href} legacyBehavior passHref>
        <Comp data-slot="button" className={cn(buttonVariants({ variant, size, color, className }), loading && "[&>svg]:hidden")} disabled={loading || disabled} {...props}>
          {loading ? <ButtonLoader size={size} /> : null}
          {children}
        </Comp>
      </NextLink>
    );
  }

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, color, className }), loading && "[&>svg]:hidden")} disabled={loading || disabled} {...props}>
      {loading ? <ButtonLoader size={size} /> : null}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
