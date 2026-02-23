"use client";

import { type ReactNode } from "react";
import { CartProvider } from "./cart-provider";
import { WalletProvider } from "./wallet-provider";
import { PrimeProvider } from "./prime-provider";
import { AddressProvider } from "./address-provider";
import { OrderProvider } from "./order-provider";
import { DateProvider } from "./date-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DateProvider>
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
    </DateProvider>
  );
}
