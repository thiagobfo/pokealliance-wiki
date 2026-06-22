import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokeAlliance Wiki",
  description: "Community wiki for the PokeAlliance game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Sidebar />
        <main className="ml-60 min-h-screen p-6 lg:p-10 xl:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
