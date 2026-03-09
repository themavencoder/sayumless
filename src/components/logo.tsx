import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={cn(
        "font-semibold tracking-tight group",
        sizeClasses[size],
        className
      )}
    >
      say
      <span className="logo-dim text-muted-foreground font-normal">[um]</span>
      less
    </Link>
  );
}

export function LogoText({ className, size = "md" }: Omit<LogoProps, "href">) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <span
      className={cn(
        "font-semibold tracking-tight",
        sizeClasses[size],
        className
      )}
    >
      say
      <span className="logo-dim text-muted-foreground font-normal">[um]</span>
      less
    </span>
  );
}
