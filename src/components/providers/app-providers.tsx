"use client";

import { type ReactNode } from "react";
import { CartProvider } from "./cart-provider";
import { WalletProvider } from "./wallet-provider";
import { PrimeProvider } from "./prime-provider";
import { AddressProvider } from "./address-provider";
import { OrderProvider } from "./order-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <PrimeProvider>
        <AddressProvider>
          <CartProvider>
            <OrderProvider>
                {children}
            </OrderProvider>
          </CartProvider>
        </AddressProvider>
      </PrimeProvider>
    </WalletProvider>
  );
}
