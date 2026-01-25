"use client";

import AuthSession from "../_components/AuthSession";
import { ModalProvider } from "./ModalProvider";
import ReactQueryProvider from "./reactqueryProvider";
import { ThemeProvider } from "./themeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <ModalProvider>
          <AuthSession>{children}</AuthSession>
        </ModalProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}