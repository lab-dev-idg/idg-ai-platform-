import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white/80 backdrop-blur-lg border border-white/40 shadow-sm rounded-2xl dark:bg-slate-900/80 dark:border-slate-800/40",
      className
    )}
    {...props}
  />
));
GlassCard.displayName = "GlassCard";

export const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded bg-slate-200 dark:bg-slate-800", className)}
    {...props}
  />
));
Skeleton.displayName = "Skeleton";

export { Button } from "@/shared/ui/button";
export { Badge } from "@/shared/ui/badge";
export { cn } from "@/lib/utils/cn";
