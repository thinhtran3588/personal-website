"use client";

import { useCallback, useState } from "react";

import { Chip } from "@/common/components/chip";
import { cn } from "@/common/utils/cn";

const inputClass =
  "min-h-[1.5rem] min-w-0 flex-1 border-0 bg-transparent py-1 pr-0 pl-0 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export type TagsInputProps = {
  value: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
};

export function TagsInput({
  value,
  onChange,
  placeholder = "Add…",
  id,
  disabled = false,
  readOnly = false,
  className,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed || value.includes(trimmed) || !onChange) return;
      onChange([...value, trimmed]);
    },
    [value, onChange],
  );

  const removeTag = useCallback(
    (index: number) => {
      if (onChange) onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        addTag(trimmed);
        setInputValue("");
      }
    }
  }

  function handleBlur() {
    const trimmed = inputValue.trim();
    if (trimmed) {
      addTag(trimmed);
    }
    setInputValue("");
  }

  if (readOnly) {
    return (
      <div className={cn("flex flex-wrap gap-1.5", className)}>
        {value.length > 0 ? (
          value.map((tag, index) => <Chip key={`${tag}-${index}`}>{tag}</Chip>)
        ) : (
          <span className="text-sm text-[var(--text-muted)]">—</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[2.5rem] flex-col gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-3 py-2 shadow-sm transition-colors focus-within:border-[var(--glass-border)] focus-within:bg-[var(--surface-soft)] focus-within:outline-none",
        disabled && "opacity-50",
        className,
      )}
    >
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, index) => (
            <Chip
              key={`${tag}-${index}`}
              onRemove={() => removeTag(index)}
              disabled={disabled}
            >
              {tag}
            </Chip>
          ))}
        </div>
      )}
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(inputClass)}
      />
    </div>
  );
}
