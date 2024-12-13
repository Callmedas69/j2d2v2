import type { Metadata } from "next";
import "./globals.css";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "J2D2",
  description: "▢▢ ▢◧ ◪▢ ▢▢ ◧▢ ◨◩ ◧◧ ▢▢ ◨◪ ◪▢ ◧◧ ▢▢ ◨◪ ◪◨",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${silkscreen.className} antialiased`}>{children}</body>
    </html>
  );
}
