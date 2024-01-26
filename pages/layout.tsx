import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
const instru = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Gift Wears",
  description: "Gift wears",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={instru.className}>
        <Nav />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
