import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import Nav from "@/app/components/Nav";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Ubuntu_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "c.dev",
  description: "citadin's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-black-900 ${inter.className}`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
