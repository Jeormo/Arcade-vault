import type { Metadata } from "next";
import Link from "next/link";
import { LiveScoreboard } from "@/components/live-scoreboard";
import { GAMES } from "@/lib/games";

export const metadata: Metadata = {
  title: "Arcade Vault · Inicio",
};

const PERKS = [
  `Acceso a los ${GAMES.length} juegos del Vault`,
  "Partidas ilimitadas, sin anuncios",
  "Tus puntuaciones en el ranking global",
  "Historial y mejores marcas por juego",
  "Perfil de jugador con tu alias",
  "Nuevos cartuchos incluidos al llegar",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-7xl animate-enter flex-col gap-[clamp(48px,9vh,96px)] px-5 pt-[clamp(48px,10vh,120px)] pb-24">
      <section className="flex max-w-225 flex-col gap-6.5">
        <span className="font-arcade text-[10px] tracking-[2px] text-magenta [text-shadow:0_0_8px_#ff006e]">
          PLAYER 1 · LISTO
        </span>
        <h1 className="m-0 animate-flicker font-arcade text-[clamp(34px,8vw,96px)] leading-[1.1] font-normal text-ink motion-reduce:animate-none motion-reduce:[text-shadow:0_0_6px_#00f5ff,0_0_18px_#00f5ff,0_0_42px_#00f5ff,3px_3px_0_#ff006e]">
          ARCADE
          <br />
          VAULT
        </h1>
        <p className="m-0 max-w-[46ch] text-[clamp(18px,2.2vw,22px)] leading-normal text-pretty text-[#c4d6e3]">
          Los clásicos de la sala recreativa, en tu navegador. Juega, bate récords y deja tu nombre en el Salón de la Fama.
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          <Link
            href="/acceso"
            className="animate-pulse border-[3px] border-yellow bg-yellow/6 px-6.5 py-5 font-arcade text-[13px] text-yellow hover:bg-yellow hover:text-bg motion-reduce:animate-none motion-reduce:shadow-[0_0_14px_#f5ff00]"
          >
            CREAR CUENTA
          </Link>
          <Link
            href="/biblioteca"
            className="border-[3px] border-cyan px-6.5 py-5 font-arcade text-[13px] text-cyan shadow-[0_0_12px_#00f5ff55] hover:bg-cyan hover:text-bg hover:shadow-[0_0_24px_#00f5ff]"
          >
            EXPLORAR BIBLIOTECA &gt;
          </Link>
        </div>
        <p className="m-0 animate-blink font-arcade text-[10px] text-muted motion-reduce:animate-none">
          INSERTA UNA MONEDA PARA JUGAR
        </p>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-7">
        <LiveScoreboard />

        <section aria-labelledby="precios" className="flex flex-col gap-4.5">
          <h2 id="precios" className="m-0 font-arcade text-[clamp(16px,2.4vw,22px)] leading-[1.4] font-normal text-ink [text-shadow:0_0_10px_#00f5ff]">
            PRECIOS
          </h2>
          <p className="m-0 max-w-[42ch] text-base text-muted">Un solo plan. Sin monedas reales, sin letra pequeña.</p>
          <div className="relative flex flex-col gap-5 border-[3px] border-yellow bg-[linear-gradient(180deg,#16160b,#0c0c14)] px-6 py-7 shadow-[0_0_28px_#f5ff0044,inset_0_0_22px_#f5ff0014]">
            <span className="absolute -top-3.25 left-5 bg-yellow px-2.5 py-1 font-arcade text-[8px] text-bg">PLAN ÚNICO</span>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-arcade text-base text-yellow">GRATIS</span>
              <span className="flex items-baseline gap-2">
                <span className="font-arcade text-[clamp(30px,4vw,40px)] text-ink [text-shadow:0_0_12px_#f5ff0088]">0 €</span>
                <span className="text-sm text-dim">/ para siempre</span>
              </span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {PERKS.map((perk) => (
                <li key={perk} className="grid grid-cols-[22px_1fr] items-baseline gap-2.5 text-base leading-[1.4]">
                  <span aria-hidden="true" className="font-arcade text-[9px] text-green">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/acceso"
              className="border-[3px] border-yellow bg-yellow p-4 text-center font-arcade text-[11px] text-bg shadow-[0_0_18px_#f5ff0088] hover:bg-transparent hover:text-yellow"
            >
              EMPEZAR GRATIS
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
