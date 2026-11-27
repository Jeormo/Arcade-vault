"use client";

import type { CSSProperties } from "react";
import { MEDAL_COLORS } from "@/components/game-style";
import { useSession } from "@/components/session-provider";
import type { GameId } from "@/lib/games";
import { formatDate, formatRank, formatScore, topScores } from "@/lib/scores";

/** Top 10 de un juego en formato compacto (panel lateral del detalle). */
export function ScoreTableCompact({ gameId }: { gameId: GameId }) {
  const { user, localScores } = useSession();
  const rows = topScores(gameId, localScores[gameId]);

  return (
    <aside className="flex flex-col gap-3.5 border-2 border-magenta/53 bg-[#0e0e17] p-5.5 shadow-[0_0_20px_#ff006e22]">
      <h2 className="m-0 mb-1.5 font-arcade text-xs font-normal text-magenta [text-shadow:0_0_8px_#ff006e]">
        MEJORES PUNTUACIONES
      </h2>
      <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
        {rows.map((r, i) => {
          const medal = MEDAL_COLORS[i];
          const isUser = !!user && r.name === user.name;
          const style = {
            "--rank": medal ?? "var(--color-dim)",
            "--name": isUser ? "var(--color-green)" : (medal ?? "var(--color-text)"),
            animationDelay: `${i * 0.06}s`,
          } as CSSProperties;
          return (
            <li
              key={`${r.name}-${r.score}-${r.date}`}
              style={style}
              className="grid animate-[row_0.4s_both] grid-cols-[40px_1fr_auto] items-baseline gap-2.5 border-b border-dashed border-white/8 py-2"
            >
              <span className="font-arcade text-[10px] text-(--rank)">{formatRank(i + 1)}</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-bold text-(--name)">{r.name}</span>
                <span className="text-xs text-[#6f8396]">{formatDate(r.date)}</span>
              </span>
              <span className="font-arcade text-[10px] text-ink">{formatScore(r.score)}</span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
