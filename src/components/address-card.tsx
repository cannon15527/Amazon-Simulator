"use client";

import type { Address } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useAddresses } from "@/hooks/use-addresses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "./address-form";
import { useState } from "react";
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
import { Badge } from "./ui/badge";

export function AddressCard({ address }: { address: Address }) {
  const { deleteAddress, updateAddress, addresses } = useAddresses();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSetDefault = () => {
    // Unset other defaults
    addresses.forEach(addr => {
        if (addr.isDefault && addr.id !== address.id) {
            updateAddress({ ...addr, isDefault: false });
        }
    });
    // Set current as default
    updateAddress({ ...address, isDefault: true });
  }

  return (
    <Card className="flex flex-col hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle>{address.name}</CardTitle>
            {address.isDefault && <Badge variant="outline">Default</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="flex flex-col">
          <span>{address.street}</span>
          <span>
            {address.city}, {address.zip}
          </span>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleSetDefault} disabled={address.isDefault}>Set as default</Button>
        <div className="flex gap-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit address</DialogTitle>
              </DialogHeader>
              <AddressForm
                address={address}
                onSave={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete this address.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAddress(address.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
