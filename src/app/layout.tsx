import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Big Buck Bunny - Open Source Animation",
  description:
    "Discover the world of Big Buck Bunny - an open-source animated short film featuring our gentle giant rabbit. A heartwarming story of friendship, adventure, and the magic of animated storytelling.",
  keywords: [
    "Big Buck Bunny",
    "animation",
    "open source",
    "Blender Foundation",
    "animated film",
    "character design",
  ],
  icons: {
    icon: "/bigbuck/favicon.png",
    apple: "/bigbuck/favicon.png",
  },
  openGraph: {
    title: "Big Buck Bunny - Open Source Animation",
    description:
      "Discover the world of Big Buck Bunny - an open-source animated short film featuring our gentle giant rabbit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
