"use client";

import { useEffect, useRef, useState } from "react";
import { formatScore } from "@/lib/scores";

const SAVED_MESSAGE = "PUNTUACIÓN GUARDADA";
const TYPE_INTERVAL_MS = 65;

type Props = {
  score: number;
  /** Texto bajo el botón de guardar (cuenta o invitado). */
  saveNote: string;
  onSave: () => void;
  onReplay: () => void;
  onExit: () => void;
};

/** Modal FIN DEL JUEGO: puntuación final, guardado con efecto de tecleo, rejugar y volver. */
export function GameOverModal({ score, saveNote, onSave, onReplay, onExit }: Props) {
  const [saved, setSaved] = useState(false);
  const [typed, setTyped] = useState("");
  const firstAction = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstAction.current?.focus();
  }, []);

  // Tecleo letra a letra de «PUNTUACIÓN GUARDADA» tras guardar.
  useEffect(() => {
    if (!saved) return;
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(SAVED_MESSAGE.slice(0, i));
      if (i >= SAVED_MESSAGE.length) window.clearInterval(timer);
    }, TYPE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [saved]);

  const handleSave = () => {
    onSave();
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-80 grid animate-[fade_0.25s] place-items-center bg-bg/90 p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        className="flex w-[min(460px,100%)] animate-[enter_0.3s] flex-col items-center gap-5 border-3 border-magenta bg-panel px-6.5 py-8 text-center shadow-[0_0_30px_#ff006e88,inset_0_0_20px_#ff006e33]"
      >
        <h2
          id="game-over-title"
          className="m-0 font-arcade text-[clamp(20px,5vw,28px)] font-normal text-magenta [text-shadow:0_0_12px_#ff006e]"
        >
          FIN DEL JUEGO
        </h2>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[1px] text-dim">PUNTUACIÓN FINAL</span>
          <span className="font-arcade text-3xl text-yellow [text-shadow:0_0_14px_#f5ff00]">{formatScore(score)}</span>
        </div>

        {saved ? (
          <>
            <span role="status" className="sr-only">
              {SAVED_MESSAGE}
            </span>
            <span
              aria-hidden="true"
              className="min-h-5 font-arcade text-xs text-green [text-shadow:0_0_10px_#39ff88]"
            >
              {typed}
              <span className="animate-[blink_0.6s_steps(1)_infinite] motion-reduce:animate-none">_</span>
            </span>
          </>
        ) : (
          <>
            <button
              ref={firstAction}
              type="button"
              onClick={handleSave}
              className="w-full cursor-pointer border-2 border-yellow bg-transparent p-4 font-arcade text-[11px] text-yellow shadow-[0_0_12px_#f5ff0066] hover:bg-yellow hover:text-bg active:translate-y-0.5 active:scale-96"
            >
              GUARDAR PUNTUACIÓN
            </button>
            <span className="text-[13px] text-dim">{saveNote}</span>
          </>
        )}

        <div className="flex w-full flex-wrap gap-3">
          <button
            type="button"
            onClick={onReplay}
            className="flex-[1_1_150px] cursor-pointer border-2 border-cyan bg-transparent px-2.5 py-3.5 font-arcade text-[9px] text-cyan hover:bg-cyan hover:text-bg active:translate-y-0.5 active:scale-95"
          >
            JUGAR DE NUEVO
          </button>
          <button
            type="button"
            onClick={onExit}
            className="flex-[1_1_150px] cursor-pointer border-2 border-magenta bg-transparent px-2.5 py-3.5 font-arcade text-[9px] text-magenta hover:bg-magenta hover:text-bg active:translate-y-0.5 active:scale-95"
          >
            VOLVER AL VAULT
          </button>
        </div>
      </div>
    </div>
  );
}
