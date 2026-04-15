import type { Metadata } from "next";
import { Inter, Newsreader, Poppins } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "BridgeID - Progressive Identity",
  description: "A Progressive Identity System for the Undocumented",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable, newsreader.variable, inter.className, poppins.variable, "font-sans scroll-smooth overflow-x-hidden")}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground w-full">
        <SmoothScroll>
          <Navigation />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

