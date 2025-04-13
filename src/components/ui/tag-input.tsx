import * as React from "react";
import { X } from "lucide-react";

import { Label } from "./label";
import { cn } from "@/lib/utils";
import { Info } from "./info";
import { Badge } from "./badge";

interface TagInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  label?: string;
  error?: string;
  info?: string;
  container?: {
    className: string;
  };
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

function TagInput({
  className,
  label,
  error,
  info,
  container,
  value = [],
  onChange,
  placeholder = "Add tag...",
  maxTags,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && (!maxTags || value.length < maxTags)) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    if (index >= 0 && index < value.length) {
      const newTags = value.filter((_, i) => i !== index);
      onChange(newTags);
    }
  };

  return (
    <div className={cn("space-y-2", container?.className)}>
      {label && (
        <Label className="flex gap-1 items-center">
          {label}{" "}
          {props.required && <span className="text-destructive">*</span>}
          {info && <Info tooltip={info} />}
        </Label>
      )}
      <div
        className={cn(
          "border-input flex min-h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] flex-wrap gap-1.5 items-center",
          error &&
            "ring-destructive/20 dark:ring-destructive/40 border-destructive",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <Badge key={index}>
            {tag}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
            />
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none min-w-[120px] h-7"
          disabled={maxTags !== undefined && value.length >= maxTags}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-error">{error}</span>}
      {maxTags && (
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxTags} tags
        </span>
      )}
    </div>
  );
}

export { TagInput };
