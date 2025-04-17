"use client";

import * as React from "react";
import { Label } from "./label";
import { Info } from "./info";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface Option {
  label: string;
  value: string;
}

interface SelectorProps {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  info?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  containerClass?: string;
  disabled?: boolean;
  required?: boolean;
}

function Selector({
  options,
  value,
  defaultValue,
  onChange,
  label,
  info,
  placeholder = "Select an option",
  error,
  className,
  containerClass,
  disabled,
  required,
}: SelectorProps) {
  return (
    <div className={cn("space-y-2 min-w-32", containerClass)}>
      {label && (
        <Label className="flex gap-1 items-center">
          {label} {required && <span className="text-destructive">*</span>}
          {info && <Info tooltip={info} />}
        </Label>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}

export { Selector, type SelectorProps, type Option };
