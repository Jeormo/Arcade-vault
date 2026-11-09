import type { Metadata } from "next";
import { Courier_Prime, Press_Start_2P } from "next/font/google";
import { Background } from "@/components/background";
import { Scanlines } from "@/components/scanlines";
import { SessionProvider } from "@/components/session-provider";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Juega online y compite por la puntuación más alta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${pressStart.variable} ${courierPrime.variable} antialiased`}>
      <body>
        <Background />
        <Scanlines />
        <SessionProvider>
          <div className="relative z-1 min-h-screen">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
