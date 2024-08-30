import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import Nav from "@/app/components/Nav";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Ubuntu_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "c.dev",
  description: "citadin's blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen justify-between text-black-900 ${inter.className}`}>
        <Nav />
        <main className="flex justify-between min-h-[calc(100vh-110px)] flex-col text-black-900">
          <div className="w-[90%] md:w-[80%] xl:w-[50%] mx-auto">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
