import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export function LoadingSpinner({ className, size = "default" }) {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <BookOpen 
          className={cn(
            sizes[size],
            "text-primary animate-pulse"
          )} 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "rounded-full border-2 border-primary/30 border-t-primary animate-spin",
            size === "sm" ? "h-6 w-6" : size === "lg" ? "h-16 w-16" : "h-12 w-12"
          )} />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground font-serif italic animate-pulse">
        Opening ancient tomes...
      </p>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 md:p-6 animate-pulse">
      <div className="aspect-[2/3] rounded-lg bg-muted mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-16 rounded bg-muted" />
          <div className="h-5 w-12 rounded bg-muted" />
        </div>
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
