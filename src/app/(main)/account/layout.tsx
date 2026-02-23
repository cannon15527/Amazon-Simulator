"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Star, Wallet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const accountNav = [
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/prime", label: "Prime", icon: Star },
  { href: "/account/wallet", label: "Wallet", icon: Wallet },
];

function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { toast } = useToast();

  const isConfirmationMatching = confirmationText.toLowerCase() === "delete";

  const handleDelete = () => {
    localStorage.clear();
    setIsOpen(false);
    toast({
        title: "Account Deleted",
        description: "Your account data has been reset. You will be redirected to sign up."
    });
    // Redirect to sign up page.
    setTimeout(() => window.location.href = '/signup', 1000);
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account, orders, addresses, and reset your wallet to the default state.
            <br/><br/>
            Please type <strong>delete</strong> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input 
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="delete"
          className="my-2"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmationText('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={!isConfirmationMatching}
            className="bg-destructive hover:bg-destructive/90"
          >
            I understand, delete my account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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
      
      <Separator />

      <div className="space-y-4">
          <h3 className="font-semibold text-xl text-destructive">Danger Zone</h3>
          <Card className="border-destructive/50">
              <CardHeader className="flex-row justify-between items-center">
                  <div>
                      <CardTitle className="text-lg">Reset All Data</CardTitle>
                      <CardDescription>Permanently reset your account and all associated data to the default state. This action is irreversible.</CardDescription>
                  </div>
                  <DeleteAccountDialog />
              </CardHeader>
          </Card>
      </div>

    </div>
  );
}
