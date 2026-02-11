import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { TooltipProvider, Toaster } from "@/components";
import { AuthProvider } from "@/lib/contexts/auth-context";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LexAI Labs - Learn AI from Industry Experts",
  description: "Master AI skills with LexAI Labs - A modern learning platform for Machine Learning, Deep Learning, and AI",
  icons: {
    icon: "/lexai-logo.png",
    apple: "/lexai-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${lora.variable}`}>
      <body className="antialiased font-sans">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
