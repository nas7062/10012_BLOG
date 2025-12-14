import type { Metadata } from "next";
import { Geist_Mono, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import AuthSession from "./_components/AuthSession";
import { Toaster } from "sonner";
import { ThemeProvider } from "./provider/themeProvider";
import ReactQueryProvider from "./provider/reactqueryProvider";
import { ModalProvider } from "./provider/ModalProvider";

const geistNanum = Nanum_Gothic({
  weight: ["400", "700"],
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "10012 ",
  description: "10012에 오신걸 환영합니다.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistNanum.className} ${geistMono.className} antialiased`}
      >
        <ReactQueryProvider>
          <ThemeProvider>
            <ModalProvider>
              <AuthSession>
                <Toaster />
                <Header />
                <div className="flex min-h-screen items-center justify-center font-sans ">
                  {children}
                </div>
                <div id="modal-root"></div>
              </AuthSession>
            </ModalProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
