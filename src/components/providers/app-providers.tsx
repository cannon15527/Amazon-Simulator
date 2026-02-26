"use client";

import { type ReactNode } from "react";
import { CartProvider } from "./cart-provider";
import { WalletProvider } from "./wallet-provider";
import { PrimeProvider } from "./prime-provider";
import { AddressProvider } from "./address-provider";
import { OrderProvider } from "./order-provider";
import { DateProvider } from "./date-provider";
import { FinanceProvider } from "./finance-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <DateProvider>
        <WalletProvider>
          <PrimeProvider>
            <FinanceProvider>
              <AddressProvider>
                <CartProvider>
                  <OrderProvider>{children}</OrderProvider>
                </CartProvider>
              </AddressProvider>
            </FinanceProvider>
          </PrimeProvider>
        </WalletProvider>
      </DateProvider>
    </ThemeProvider>
  );
}
