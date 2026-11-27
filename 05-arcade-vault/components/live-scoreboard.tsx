"use client";

import { useEffect, useState } from "react";
import { MEDAL_COLORS } from "@/components/game-style";
import { GAMES, type GameId } from "@/lib/games";
import { formatScore } from "@/lib/scores";

type Row = { id: string; name: string; game: GameId; score: number };

const NAMES = ["NEO_K", "PIXELQUEEN", "KRAKEN", "R4DIX", "LUNA8BIT", "DR.BYTE", "ZEROCOOL", "MAYA_X", "TURBO", "GLITCH", "VECTRA", "NOVA", "CHIPTUNE", "BLAST"];
const VISIBLE = 8;
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const gameOf = (id: GameId) => GAMES.find((g) => g.id === id)!;

// Estado inicial determinista (sin Math.random) para que servidor y cliente coincidan.
const INITIAL: Row[] = Array.from({ length: VISIBLE }, (_, i) => ({
  id: `s${i}`,
  name: NAMES[i],
  game: GAMES[i % GAMES.length].id,
  score: Math.floor((98000 * Math.pow(0.88, i)) / 10) * 10,
}));

type Hot = { id: string; move: number | "NEW" };

/**
 * Marcador simulado en directo. Backend: sustituir el intervalo por una suscripción
 * en tiempo real (WebSocket / Supabase Realtime).
 */
export function LiveScoreboard() {
  const [live, setLive] = useState(INITIAL);
  const [hot, setHot] = useState<Hot | null>(null);
  const [lastEvent, setLastEvent] = useState("Conectado al marcador en directo…");
  const [online, setOnline] = useState(128);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return;
      const list = live.map((r) => ({ ...r }));
      const isNew = Math.random() < 0.25;
      let row: Row;
      if (isNew) {
        row = { id: `n${Date.now()}`, name: pick(NAMES), game: pick(GAMES).id, score: list[list.length - 1].score + Math.floor(Math.random() * 8000) };
        list.push(row);
      } else {
        row = pick(list);
        row.score += 50 * (1 + Math.floor(Math.random() * 60));
      }
      const prev = new Map(live.map((r, i) => [r.id, i]));
      list.sort((a, b) => b.score - a.score);
      const top = list.slice(0, VISIBLE);
      const pos = top.findIndex((r) => r.id === row.id);
      const before = prev.get(row.id);
      const moved = pos >= 0 && before !== undefined ? before - pos : 0;
      const title = gameOf(row.game).title;
      setLive(top);
      setHot({ id: row.id, move: pos < 0 ? 0 : isNew ? "NEW" : moved });
      setLastEvent(
        pos < 0
          ? `${row.name} suma puntos en ${title}`
          : isNew
            ? `${row.name} entra en el top con ${formatScore(row.score)} en ${title}`
            : moved > 0
              ? `${row.name} sube ${moved} ${moved === 1 ? "puesto" : "puestos"} en ${title}`
              : `${row.name} suma puntos en ${title}`,
      );
      setOnline((o) => Math.max(80, o + Math.floor(Math.random() * 9) - 4));
    }, 2200);
    return () => clearInterval(timer);
  }, [live]);

  return (
    <section aria-labelledby="live-title" className="border-2 border-magenta/53 bg-[#0b0b13ee] shadow-[0_0_24px_#ff006e22]">
      <div className="flex items-center gap-3 border-b-2 border-magenta/33 px-4.5 py-4">
        <span aria-hidden="true" className="size-2.5 animate-[blink_1s_steps(1)_infinite] rounded-full bg-magenta shadow-[0_0_10px_#ff006e] motion-reduce:animate-none" />
        <h2 id="live-title" className="m-0 flex-1 font-arcade text-xs font-normal text-magenta [text-shadow:0_0_8px_#ff006e]">
          PUNTUACIÓN EN VIVO
        </h2>
        <span className="font-arcade text-[8px] text-dim">{online} JUGANDO</span>
      </div>
      <div className="grid grid-cols-[44px_minmax(0,1fr)_auto] gap-2.5 border-b border-white/6 px-4.5 py-2.5 font-arcade text-[8px] text-dim">
        <span>#</span>
        <span>JUGADOR · JUEGO</span>
        <span className="text-right">PUNTOS</span>
      </div>
      <ol className="m-0 list-none p-0">
        {live.map((r, i) => {
          const isHot = hot?.id === r.id;
          const mv = isHot ? hot.move : 0;
          const game = gameOf(r.game);
          const delta = mv === "NEW" ? "NUEVO" : mv > 0 ? `▲${mv}` : "";
          return (
            <li
              key={r.id}
              className={`grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-white/4 px-4.5 py-2.75 transition-[background,box-shadow] duration-600 ${
                isHot ? "bg-green/8 shadow-[inset_3px_0_0_#39ff88]" : ""
              }`}
            >
              <span className="font-arcade text-[10px]" style={{ color: MEDAL_COLORS[i] ?? "#7f93a5" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-col gap-0.75">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-bold text-ink">{r.name}</span>
                  <span className="flex-none font-arcade text-[7px] text-green">{delta}</span>
                </span>
                <span className="text-xs font-bold" style={{ color: game.color }}>{game.title}</span>
              </span>
              <span className={`text-right font-arcade text-[11px] ${isHot ? "text-green [text-shadow:0_0_10px_#39ff88]" : "text-yellow"}`}>
                {formatScore(r.score)}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex min-h-11 items-center gap-2.5 px-4.5 py-3 text-sm text-muted">
        <span aria-hidden="true" className="font-arcade text-[8px] text-green">&gt;</span>
        <span role="status" className="min-w-0 flex-1 truncate">{lastEvent}</span>
      </div>
    </section>
  );
}
