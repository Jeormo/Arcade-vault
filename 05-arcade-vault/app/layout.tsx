import type { Metadata } from "next";
import { Courier_Prime, Press_Start_2P } from "next/font/google";
import { Background } from "@/components/background";
import { Scanlines } from "@/components/scanlines";
import { SessionProvider } from "@/components/session-provider";
import "./globals.css";

// Sin fallback ajustado: los glifos que Press Start 2P no incluye (■ ▀ ▄ ● de las
// miniaturas) deben caer en la monospace del sistema, como en el diseño de referencia,
// y no en el Arial reescalado que genera next/font.
const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
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
