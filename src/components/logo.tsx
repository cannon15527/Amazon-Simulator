import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <ShoppingCart className="h-6 w-6 text-primary" />
      <span className="hidden font-bold sm:inline-block">Amazon</span>
    </Link>
  );
}
