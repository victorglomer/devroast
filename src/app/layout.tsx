import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { TRPCProvider } from "@/trpc/provider";

export const metadata: Metadata = {
  title: "Devroast - Brutally Honest Code Review",
  description:
    "Drop your code below and we'll rate it — brutally honest or full roast mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] antialiased">
        <TRPCProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto">{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}
