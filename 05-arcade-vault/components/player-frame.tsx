"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GameOverModal } from "@/components/game-over-modal";
import { gameVars } from "@/components/game-style";
import { useSession } from "@/components/session-provider";
import { getGame, type GameId } from "@/lib/games";
import { formatRank, formatScore } from "@/lib/scores";

const LOADING_MS = 1100;

/** Valores iniciales del HUD. Sin motor de juego, no cambian durante la partida. */
const HUD_START = { score: 0, lives: 3, level: 1 };

const SPINNER_CELLS = [
  "bg-cyan",
  "bg-cyan/53",
  "bg-cyan/27",
  "bg-magenta",
  "",
  "bg-cyan/13",
  "bg-magenta/53",
  "bg-yellow",
  "bg-yellow/53",
];

const hudButton =
  "cursor-pointer border-2 bg-transparent px-3 py-2.5 font-arcade text-[9px] active:translate-y-0.5 active:scale-93 disabled:cursor-not-allowed disabled:opacity-50";

function HudStat({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="text-[11px] font-bold tracking-[1px] text-dim">{label}</span>
      <span className={`font-arcade text-xs ${className}`}>{value}</span>
    </span>
  );
}

/** Reproductor: HUD, marco CRT, carga, pausa con P/Esc, placeholder del cartucho y fin de partida simulado. */
export function PlayerFrame({ gameId }: { gameId: GameId }) {
  const game = getGame(gameId)!;
  const router = useRouter();
  const { user, playerName, saveScore } = useSession();

  // Cada «JUGAR DE NUEVO» incrementa run y reinicia la carga.
  const [run, setRun] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const over = finalScore !== null;
  const canPause = !loading && !over;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [run]);

  useEffect(() => {
    if (!canPause) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P" || e.key === "Escape") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canPause]);

  const exit = () => router.push("/");

  const replay = () => {
    setFinalScore(null);
    setPaused(false);
    setLoading(true);
    setRun((r) => r + 1);
  };

  const simulateEnd = () => {
    setPaused(false);
    setFinalScore(2000 + Math.floor(Math.random() * 30000));
  };

  return (
    <main style={gameVars(game)} className="mx-auto flex max-w-250 animate-fade flex-col gap-4.5 px-4 pt-5 pb-12">
      {/* HUD */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-2 border-cyan/33 bg-bg/87 px-4 py-3">
        <h1 className="m-0 font-arcade text-[11px] font-normal text-(--game) [text-shadow:0_0_8px_var(--game)]">
          {game.title}
        </h1>
        <div className="flex flex-1 flex-wrap gap-5">
          <HudStat label="PUNTUACIÓN" value={formatScore(HUD_START.score)} className="text-yellow" />
          <HudStat label="VIDAS" value={"♥".repeat(HUD_START.lives) || "—"} className="text-magenta" />
          <HudStat label="NIVEL" value={formatRank(HUD_START.level)} className="text-cyan" />
          <HudStat label="JUGADOR" value={playerName} className="text-ink" />
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            disabled={!canPause}
            aria-pressed={paused}
            className={`${hudButton} border-yellow text-yellow enabled:hover:bg-yellow enabled:hover:text-bg`}
          >
            {paused ? "CONTINUAR" : "PAUSA"}
          </button>
          <button
            type="button"
            onClick={exit}
            className={`${hudButton} border-magenta text-magenta hover:bg-magenta hover:text-bg`}
          >
            SALIR
          </button>
        </div>
      </div>

      {/* Carcasa CRT */}
      <div className="rounded-[34px] bg-[linear-gradient(160deg,#26262f,#121218_55%,#0b0b10)] p-[clamp(14px,3vw,34px)] shadow-[0_30px_80px_#000c,inset_0_2px_0_#ffffff14,inset_0_-6px_18px_#0009,0_0_0_2px_#1d1d26]">
        <div className="relative aspect-4/3 overflow-hidden rounded-[22px/26px] bg-screen shadow-[inset_0_0_50px_#000,0_0_30px_var(--game-faint)]">
          {/* Placeholder del cartucho (sin motor de juego) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4.5 p-6 text-center">
            <span className="font-arcade text-[clamp(16px,3vw,22px)] text-(--game) [text-shadow:0_0_12px_var(--game)]">
              {game.title}
            </span>
            <span className="font-bold text-yellow">CARTUCHO NO CARGADO</span>
            <span className="max-w-[36ch] leading-normal text-muted">
              Este juego todavía no tiene motor. Simula el final de una partida para probar el guardado de puntuaciones.
            </span>
          </div>
          <button
            type="button"
            onClick={simulateEnd}
            disabled={!canPause}
            className="absolute right-4 bottom-4 cursor-pointer border-2 border-magenta bg-bg/80 px-3 py-2.5 font-arcade text-[8px] text-magenta hover:bg-magenta hover:text-bg"
          >
            SIMULAR FIN DE PARTIDA
          </button>

          {/* Viñeta, scanlines y reflejo del cristal */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,#0008_100%),repeating-linear-gradient(0deg,#0000004d_0_1px,transparent_1px_3px)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#ffffff10,transparent_35%)]" />

          {loading && (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center gap-5.5 overflow-hidden bg-screen"
            >
              <div className="absolute inset-x-0 h-[30%] animate-wipe bg-[linear-gradient(transparent,#00f5ff33,transparent)]" />
              <div aria-hidden="true" className="grid size-10 animate-spin grid-cols-3 gap-1">
                {SPINNER_CELLS.map((cell, i) => (
                  <span key={i} className={cell} />
                ))}
              </div>
              <span className="font-arcade text-[11px] text-cyan">CARGANDO CARTUCHO…</span>
            </div>
          )}

          {paused && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-screen/80">
              <span className="animate-[blink_1s_steps(1)_infinite] font-arcade motion-reduce:animate-none text-[28px] text-yellow [text-shadow:0_0_14px_#f5ff00]">
                PAUSA
              </span>
              <span className="text-muted">Pulsa P o el botón CONTINUAR</span>
            </div>
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 px-1.5">
          <span className="font-arcade text-[8px] text-faint">ARCADE VAULT · CRT-84</span>
          <span className="text-[13px] text-dim">{game.controls}</span>
          <span aria-hidden="true" className="size-2.5 rounded-full bg-green shadow-[0_0_10px_#39ff88]" />
        </div>
      </div>

      {finalScore !== null && (
        <GameOverModal
          score={finalScore}
          saveNote={user ? "Se registrará en el ranking con tu cuenta." : "Como invitado, se guarda solo en este dispositivo."}
          onSave={() => saveScore(game.id, finalScore)}
          onReplay={replay}
          onExit={exit}
        />
      )}
    </main>
  );
}
