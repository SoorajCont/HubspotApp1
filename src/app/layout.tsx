import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "300"],
  variable: "--font-merriweather",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Business Rule",
  description: "The app which simplify the Process of Discounting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(merriweather.variable, montserrat.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
