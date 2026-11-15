import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre nosotros · Arcade Vault",
};

const VALUES = [
  {
    icon: "▶",
    title: "JUGAR, SIN BARRERAS",
    text: "Gratis, sin anuncios y sin instalar nada. Funciona en el ordenador y en el móvil.",
    card: "border-cyan/40 shadow-[0_0_16px_#00f5ff1f] hover:border-cyan hover:shadow-[0_0_24px_#00f5ff66]",
    glyph: "text-cyan [text-shadow:0_0_10px_#00f5ff]",
  },
  {
    icon: "♥",
    title: "RESPETO AL ORIGINAL",
    text: "Cuidamos el ritmo, los controles y la estética de cada clásico. Nada de remakes que pierdan la esencia.",
    card: "border-magenta/40 shadow-[0_0_16px_#ff006e1f] hover:border-magenta hover:shadow-[0_0_24px_#ff006e66]",
    glyph: "text-magenta [text-shadow:0_0_10px_#ff006e]",
  },
  {
    icon: "★",
    title: "COMPETIR LIMPIO",
    text: "Un ranking global justo, donde cada récord se gana jugando y cada nombre en el Salón de la Fama cuenta.",
    card: "border-yellow/40 shadow-[0_0_16px_#f5ff001f] hover:border-yellow hover:shadow-[0_0_24px_#f5ff0066]",
    glyph: "text-yellow [text-shadow:0_0_10px_#f5ff00]",
  },
];

const EYEBROW = "font-arcade text-[10px] text-cyan";
const H2 = "m-0 font-arcade text-[clamp(16px,2.2vw,22px)] leading-[1.5] font-normal text-ink";
const SPLIT =
  "grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(28px,5vw,64px)]";

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-295 animate-enter flex-col gap-[clamp(64px,12vh,128px)] px-5 pt-[clamp(48px,10vh,120px)] pb-30">
      <section className="flex max-w-230 flex-col gap-6.5">
        <span className="font-arcade text-[10px] tracking-[2px] text-magenta [text-shadow:0_0_8px_#ff006e]">
          SOBRE NOSOTROS
        </span>
        <h1 className="m-0 animate-[flicker_5s_infinite] font-arcade text-[clamp(26px,5.6vw,64px)] leading-[1.2] font-normal text-ink motion-reduce:animate-none motion-reduce:[text-shadow:0_0_6px_#00f5ff,0_0_18px_#00f5ff,0_0_42px_#00f5ff,3px_3px_0_#ff006e]">
          SALVAMOS LAS
          <br />
          RECREATIVAS DEL
          <br />
          OLVIDO
        </h1>
        <p className="m-0 max-w-[50ch] text-[clamp(18px,2.2vw,22px)] leading-[1.55] text-pretty text-[#c4d6e3]">
          Arcade Vault nació de una idea sencilla: que cualquiera pueda volver a sentir la emoción de la sala
          recreativa sin moneda, sin descarga y sin esperar turno.
        </p>
      </section>

      <section aria-labelledby="historia" className={SPLIT}>
        <div className="flex flex-col gap-3.5">
          <span className={EYEBROW}>01 · NUESTRA HISTORIA</span>
          <h2 id="historia" className={H2}>
            DE LA SALA AL NAVEGADOR
          </h2>
        </div>
        <div className="flex max-w-[60ch] flex-col gap-4.5 text-lg leading-[1.6] text-[#c4d6e3]">
          <p className="m-0 text-pretty">
            Crecimos entre el zumbido de las máquinas, el brillo de las pantallas CRT y las iniciales de tres letras
            en lo alto del marcador. Muchas de esas salas cerraron, pero los juegos no tenían por qué desaparecer con
            ellas.
          </p>
          <p className="m-0 text-pretty">
            Por eso construimos un vault: un lugar donde los clásicos se conservan, se juegan y se compiten como el
            primer día. Abres la página, eliges un cartucho y empiezas a jugar.
          </p>
        </div>
      </section>

      <section aria-labelledby="valores" className="flex flex-col gap-7">
        <div className="flex flex-col gap-3.5">
          <span className={EYEBROW}>02 · LO QUE NOS MUEVE</span>
          <h2 id="valores" className={H2}>
            NUESTRAS REGLAS DEL JUEGO
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5.5">
          {VALUES.map((value) => (
            <article
              key={value.title}
              className={`flex flex-col gap-3.5 border-2 bg-panel/90 p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${value.card}`}
            >
              <span aria-hidden="true" className={`font-arcade text-[22px] ${value.glyph}`}>
                {value.icon}
              </span>
              <h3 className="m-0 font-arcade text-xs leading-[1.6] font-normal text-ink">{value.title}</h3>
              <p className="m-0 text-base leading-[1.55] text-pretty text-[#a9bccc]">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="equipo" className={SPLIT}>
        <div className="flex flex-col gap-3.5">
          <span className={EYEBROW}>03 · EL EQUIPO</span>
          <h2 id="equipo" className={H2}>
            HECHO POR JUGADORES
          </h2>
        </div>
        <p className="m-0 max-w-[60ch] text-lg leading-[1.6] text-pretty text-[#c4d6e3]">
          Somos un pequeño equipo de desarrolladores, diseñadores y coleccionistas con una misma obsesión: el récord
          que nunca conseguimos batir. Cada juego que entra en el vault lo probamos nosotros primero, partida tras
          partida.
        </p>
      </section>

      <section
        aria-labelledby="siguiente-nivel"
        className="flex flex-col items-start gap-5.5 border-[3px] border-yellow bg-[linear-gradient(180deg,#16160bdd,#0c0c14ee)] p-[clamp(28px,5vw,48px)] shadow-[0_0_28px_#f5ff0033,inset_0_0_22px_#f5ff0010]"
      >
        <h2
          id="siguiente-nivel"
          className="m-0 font-arcade text-[clamp(18px,3vw,30px)] leading-[1.4] font-normal text-ink"
        >
          ¿LISTO PARA EL
          <br />
          SIGUIENTE NIVEL?
        </h2>
        <p className="m-0 max-w-[46ch] text-lg text-[#c4d6e3]">
          Crea tu cuenta gratis y deja tus iniciales en el marcador.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <Link
            href="/acceso?tab=registro"
            className="animate-pulse border-[3px] border-yellow bg-yellow/6 px-5.5 py-4.5 font-arcade text-xs text-yellow hover:bg-yellow hover:text-bg active:translate-y-0.5 motion-reduce:animate-none motion-reduce:shadow-[0_0_14px_#f5ff00]"
          >
            CREAR CUENTA
          </Link>
          <a
            href="#contacto"
            className="border-[3px] border-cyan px-5.5 py-4.5 font-arcade text-xs text-cyan hover:bg-cyan hover:text-bg active:translate-y-0.5"
          >
            CONTACTAR
          </a>
        </div>
      </section>

      <p className="m-0 animate-blink font-arcade text-[9px] text-dim motion-reduce:animate-none">
        GAME OVER? NUNCA. · ARCADE VAULT
      </p>
    </main>
  );
}
