import type { Metadata } from "next";
import "./globals.css";
import { getLanguage } from "@/src/lib/getLanguage";
import Navbar from "@/src/components/Navbar";

export const metadata: Metadata = {
  title: "SwiftShop - Modern E-Commerce",
  description: "Browse and purchase high-quality products with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguage();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 w-full pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
