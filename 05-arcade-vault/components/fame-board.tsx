"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { MEDAL_COLORS, gameVars } from "@/components/game-style";
import { useSession } from "@/components/session-provider";
import { GAMES, type GameId } from "@/lib/games";
import { formatDate, formatRank, formatScore, topScores } from "@/lib/scores";

const COLUMNS =
  "grid grid-cols-[minmax(56px,90px)_minmax(0,1fr)_auto_minmax(90px,140px)] gap-2 px-3 py-3.5 sm:gap-3 sm:px-4.5";

/** Ranking por juego: pestañas, top 10 con medallas, fila «TÚ» y mejor marca del usuario. */
export function FameBoard() {
  const { user, localScores } = useSession();
  const [gameId, setGameId] = useState<GameId>("arkanoid");

  const ranking = topScores(gameId, localScores[gameId], Infinity);
  const rows = ranking.slice(0, 10);
  const userBestIndex = user ? ranking.findIndex((r) => r.name === user.name) : -1;
  const userBest = userBestIndex >= 0 ? ranking[userBestIndex] : null;

  return (
    <>
      <div role="tablist" aria-label="Juego" className="flex gap-2 overflow-x-auto pb-1.5">
        {GAMES.map((g) => {
          const active = g.id === gameId;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="fame-ranking"
              onClick={() => setGameId(g.id)}
              style={gameVars(g)}
              className={`flex-none cursor-pointer border-2 px-3.5 py-3 font-arcade text-[9px] hover:border-yellow active:scale-95 ${
                active
                  ? "border-(--game) bg-(--game)/13 text-(--game) shadow-[0_0_14px_var(--game-dim)]"
                  : "border-white/13 bg-transparent text-muted"
              }`}
            >
              {g.title}
            </button>
          );
        })}
      </div>

      {userBest ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-2 border-green bg-green/5 px-5 py-4 shadow-[0_0_16px_#39ff8833]">
          <span className="font-arcade text-[10px] text-green">TU MEJOR MARCA</span>
          <span className="font-bold text-ink">{user?.name}</span>
          <span className="ml-auto font-arcade text-xs text-yellow">{formatScore(userBest.score)}</span>
          <span className="text-sm text-[#8aa0b2]">Puesto #{userBestIndex + 1}</span>
        </div>
      ) : (
        !user && (
          <p className="m-0 text-[#8aa0b2]">
            Inicia sesión para ver <span className="font-bold text-green">TU MEJOR MARCA</span> destacada en el ranking.{" "}
            <Link href="/acceso" className="font-bold text-cyan underline">
              Iniciar sesión
            </Link>
          </p>
        )
      )}

      <div
        id="fame-ranking"
        role="table"
        aria-label={`Top 10 de ${GAMES.find((g) => g.id === gameId)?.title}`}
        className="border-2 border-cyan/33 bg-[#0b0b13ee] shadow-[0_0_24px_#00f5ff1a]"
      >
        <div role="row" className={`${COLUMNS} border-b-2 border-cyan/33 font-arcade text-[9px] text-cyan`}>
          <span role="columnheader">RANGO</span>
          <span role="columnheader">JUGADOR</span>
          <span role="columnheader" className="text-right">
            PUNTUACIÓN
          </span>
          <span role="columnheader" className="text-right">
            FECHA
          </span>
        </div>

        {/* La key fuerza el remontaje al cambiar de juego, y con él la animación de filas. */}
        <div key={gameId} role="rowgroup">
          {rows.map((r, i) => {
            const medal = MEDAL_COLORS[i];
            const isUser = !!user && r.name === user.name;
            const accent = isUser ? "#39ff88" : medal;
            const style = {
              "--rank": medal ?? "var(--color-dim)",
              "--name": accent ?? "var(--color-text)",
              background: isUser ? "#39ff8814" : medal ? `${medal}0d` : "transparent",
              boxShadow: accent ? `inset 3px 0 0 ${accent}` : "none",
              animationDelay: `${i * 0.06}s`,
            } as CSSProperties;
            return (
              <div
                key={`${i}-${r.name}-${r.score}`}
                role="row"
                style={style}
                className={`${COLUMNS} animate-row items-center border-b border-white/6`}
              >
                <span
                  role="cell"
                  className={`font-arcade text-(--rank) ${medal ? "text-sm [text-shadow:0_0_10px_var(--rank)]" : "text-[11px]"}`}
                >
                  {formatRank(i + 1)}
                </span>
                <span role="cell" className="flex min-w-0 items-center gap-2.5">
                  <span className="truncate text-base font-bold text-(--name)">{r.name}</span>
                  {isUser && (
                    <span className="flex-none border border-green px-1.5 py-1 font-arcade text-[7px] text-green">TÚ</span>
                  )}
                </span>
                <span role="cell" className="text-right font-arcade text-[11px] text-ink">
                  {formatScore(r.score)}
                </span>
                <span role="cell" className="text-right text-sm text-dim">
                  {formatDate(r.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
