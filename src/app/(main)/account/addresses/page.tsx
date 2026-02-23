"use client";

import { useAddresses } from "@/hooks/use-addresses";
import { Button } from "@/components/ui/button";
import { AddressCard } from "@/components/address-card";
import { PlusCircle, Home } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddressForm } from "@/components/address-form";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function AddressesPage() {
  const { addresses } = useAddresses();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-semibold">Your Addresses</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new address</DialogTitle>
            </DialogHeader>
            <AddressForm onSave={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
            ))}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed">
            <CardHeader>
                <Home className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No addresses saved</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Add a virtual address to get your non-existent items delivered.</p>
            </CardContent>
             <CardFooter className="justify-center">
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                       Add your first address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a new address</DialogTitle>
                    </DialogHeader>
                    <AddressForm onSave={() => setIsFormOpen(false)} />
                  </DialogContent>
                </Dialog>
             </CardFooter>
        </Card>
      )}
    </div>
  );
}
