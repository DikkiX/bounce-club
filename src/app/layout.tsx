import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { ExtensionErrorGuard } from "@/components/ExtensionErrorGuard";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bounce Club",
  description: "Amsterdam nightlife",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${barlow.variable} ${inter.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider>
          <ExtensionErrorGuard />
          <SiteHeader />
          <main>{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
