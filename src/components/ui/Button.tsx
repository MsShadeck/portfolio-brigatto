"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_2px_12px_rgba(229,161,59,0.15)] hover:brightness-110 hover:shadow-[0_4px_24px_rgba(229,161,59,0.4)]",
  secondary: "border border-border bg-surface text-foreground hover:bg-surface-hover",
  danger: "bg-danger text-white shadow-[0_2px_12px_rgba(193,39,45,0.2)] hover:brightness-110",
  ghost: "text-foreground-muted hover:text-foreground",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ variant = "primary", className, ...props }: Props) {
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    />
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    >
      {pending ? pendingLabel ?? "Salvando..." : children}
    </button>
  );
}
