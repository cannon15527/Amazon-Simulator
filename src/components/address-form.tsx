"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Address } from "@/lib/types";
import { useAddresses } from "@/hooks/use-addresses";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  street: z.string().min(5, "Street address is required."),
  city: z.string().min(2, "City is required."),
  zip: z.string().regex(/^\d{5}$/, "Must be a 5-digit ZIP code."),
  isDefault: z.boolean().optional(),
});

interface AddressFormProps {
  address?: Address;
  onSave: () => void;
}

export function AddressForm({ address, onSave }: AddressFormProps) {
  const { addAddress, updateAddress, addresses } = useAddresses();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: address || {
      name: "",
      street: "",
      city: "",
      zip: "",
      isDefault: addresses.length === 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.isDefault) {
      // Unset other defaults
      addresses.forEach(addr => {
        if (addr.isDefault && addr.id !== address?.id) {
          updateAddress({ ...addr, isDefault: false });
        }
      });
    }

    if (address) {
      updateAddress({ ...address, ...values });
    } else {
      addAddress(values);
    }
    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name (e.g., Home, Work)</FormLabel>
              <FormControl>
                <Input placeholder="My Virtual House" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Pixel Lane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Simsville" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="98765" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                     <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={address?.isDefault}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Set as default address</FormLabel>
                    </div>
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full">
          Save Address
        </Button>
      </form>
    </Form>
  );
}
