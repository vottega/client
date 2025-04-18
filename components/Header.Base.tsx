import { cn } from "@/lib/utils";
import { Package2 } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";

export function BaseHeader({ children, className, ...props }: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}

BaseHeader.Logo = function Logo({ className }: { className?: string }) {
  return (
    <h1 className={className}>
      <Link href="/">
        <Package2 className="h-6 w-6" />
      </Link>
      <span className="sr-only">vottega</span>
    </h1>
  );
};
