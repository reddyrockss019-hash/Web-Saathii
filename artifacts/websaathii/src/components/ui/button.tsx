import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-6 py-2",
  sm: "h-9 rounded-md px-3 text-sm",
  lg: "h-14 rounded-xl px-8 text-lg font-semibold",
  icon: "h-11 w-11",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: { variant?: ButtonProps["variant"]; size?: ButtonProps["size"]; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0 active:scale-95",
    variantClasses[variant ?? "default"],
    sizeClasses[size ?? "default"],
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
