import type { Metadata } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "sonner";
import Modal from "./_components/Modal";
import { Providers } from "./provider/RootProvider";

const font = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
  adjustFontFallback: true,
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "10012 ",
  description: "10012에 오신걸 환영합니다.",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_LOCAL_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "10012",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "10012 블로그",
      },
    ],
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
      className={`${font.className} antialiased`}
    >
      <body>
        <Providers>
                <Toaster />
                <Header />
                <div className="flex min-h-screen items-center justify-center font-sans ">
                  {children}
                </div>
                <div id="modal-root"></div>
                <Modal />
        </Providers>
      </body>
    </html>
  );
}
