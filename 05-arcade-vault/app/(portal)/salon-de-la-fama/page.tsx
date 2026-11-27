import type { Metadata } from "next";
import { FameBoard } from "@/components/fame-board";

export const metadata: Metadata = {
  title: "Salón de la Fama · Arcade Vault",
};

export default function HallOfFamePage() {
  return (
    <main className="mx-auto flex max-w-275 animate-enter flex-col gap-7 px-5 pt-14 pb-24">
      <h1 className="m-0 font-arcade text-[clamp(22px,4.6vw,48px)] leading-[1.2] font-normal text-[#fff8e0] [text-shadow:0_0_10px_#f5ff00,0_0_30px_#f5ff0088,3px_3px_0_#ff006e]">
        SALÓN DE LA FAMA
      </h1>
      <FameBoard />
      <p className="m-0 text-[13px] text-faint">
        Ranking global de demostración combinado con las partidas guardadas en este dispositivo.
      </p>
    </main>
  );
}
