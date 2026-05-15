"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // for aria-label
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, size = "md", className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
