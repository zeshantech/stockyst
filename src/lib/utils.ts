import { loadStripe } from "@stripe/stripe-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string (USD).
 * @param amount The number to format.
 * @returns A formatted currency string (e.g., $1,234.56).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function noop(...args: any[]): any {
  return;
}

export const getStripe = async () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
  return loadStripe(publishableKey);
};

// local storage
export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
