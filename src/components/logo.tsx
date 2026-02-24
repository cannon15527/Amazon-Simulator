import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ isPrime }: { isPrime?: boolean }) {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <ShoppingCart className="h-8 w-8 text-primary" />
      <div className="flex flex-col">
        <span className="font-bold leading-tight">Amazon</span>
        {isPrime && <span className="text-xs font-bold text-primary leading-tight">Prime</span>}
      </div>
    </Link>
  );
}
