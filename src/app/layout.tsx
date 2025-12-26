import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import AuthSession from "./_components/AuthSession";
import { Toaster } from "sonner";
import { ThemeProvider } from "./provider/themeProvider";
import ReactQueryProvider from "./provider/reactqueryProvider";
import { ModalProvider } from "./provider/ModalProvider";
import Modal from "./_components/Modal";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
});

export const metadata: Metadata = {
  title: "10012 ",
  description: "10012에 오신걸 환영합니다.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${noto.className} antialiased`}
    >
      <body>
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
                <Modal />
              </AuthSession>
            </ModalProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
