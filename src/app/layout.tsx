import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata: Metadata = {
  title: "Passcom Mobile",
  description: "Passcom Mobile System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
