"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Star, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const accountNav = [
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/prime", label: "Prime", icon: Star },
  { href: "/account/wallet", label: "Wallet", icon: Wallet },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Your Account
        </h1>
        <p className="text-muted-foreground">
          Manage your virtual profile and settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-2">
            {accountNav.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "justify-start",
                  pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
