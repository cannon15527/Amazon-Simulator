import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2 bg-primary rounded-lg text-primary-foreground group-hover:bg-primary/90 transition-all duration-300 group-hover:scale-105">
        <ShoppingCart className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="font-headline font-bold text-xl tracking-tight leading-none">
          Amazon
        </span>
        <div className="flex items-center">
            <span className="font-headline font-bold text-primary text-sm leading-none">
            prime
            </span>
            <svg
                width="24"
                height="8"
                viewBox="0 0 24 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary ml-1"
            >
                <path
                d="M1 4C1 4 2.22222 6.66667 4.5 7C6.77778 7.33333 12.875 1.5 15.5 1.5C18.125 1.5 21 4 23 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
        </div>
      </div>
    </Link>
  );
}
