"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Star, Wallet, Trash2, Receipt } from "lucide-react";
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
import { useWallet } from "@/hooks/use-wallet";
import { INITIAL_WALLET_BALANCE } from "@/lib/constants";

const accountNav = [
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/prime", label: "Prime" },
  { href: "/account/wallet", label: "Wallet" },
  { href: "/account/affirm", label: "Affirm" },
];

function DeleteAccountDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { toast } = useToast();
  const { setBalance } = useWallet();

  const isConfirmationMatching = confirmationText.toLowerCase() === "delete";

  const handleDelete = () => {
    localStorage.clear();
    setBalance(INITIAL_WALLET_BALANCE);
    setIsOpen(false);
    toast({
        title: "Account Deleted",
        description: "Your account data has been reset. You will be redirected to sign up."
    });
    // Redirect to sign up page.
    setTimeout(() => router.push('/signup'), 1000);
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
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-bold tracking-tight text-4xl md:text-5xl">
          Your Account
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your profile, settings, and virtual life.
        </p>
      </div>

      <nav className="flex items-center justify-center border-b">
         {accountNav.map((item) => (
            <Link key={item.href} href={item.href}
              className={cn(
                  "px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary -mb-px",
                  pathname.startsWith(item.href) && "text-primary border-b-2 border-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="max-w-4xl w-full mx-auto">
        {children}
      </div>
      
      <Separator className="my-8" />

      <div className="space-y-4 max-w-4xl w-full mx-auto">
          <h3 className="font-semibold text-2xl text-destructive">Danger Zone</h3>
          <Card className="border-destructive/50 bg-destructive/5">
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
