"use client";

import type { Address } from "@/lib/types";
import { createContext, useState, useEffect, type ReactNode } from "react";
import { z } from "zod";

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

export const AddressContext = createContext<AddressContextType | undefined>(
  undefined
);

const AddressSchema = z.object({
    id: z.string(),
    name: z.string(),
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    isDefault: z.boolean().optional(),
});
const AddressArraySchema = z.array(AddressSchema);


const LOCAL_STORAGE_KEY = "simushop_addresses";

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedAddresses = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAddresses) {
        const parsed = AddressArraySchema.safeParse(JSON.parse(storedAddresses));
        if (parsed.success) {
            setAddresses(parsed.data);
        }
      }
    } catch (error) {
      console.error("Failed to parse addresses from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if(isHydrated) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
    }
  }, [addresses, isHydrated]);

  const addAddress = (address: Omit<Address, "id">) => {
    setAddresses((prev) => [...prev, { ...address, id: crypto.randomUUID() }]);
  };

  const updateAddress = (updatedAddress: Address) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };
  
  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault) || addresses[0];
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, updateAddress, deleteAddress, getDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}
