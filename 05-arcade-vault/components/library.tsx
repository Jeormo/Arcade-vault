"use client";

import { useState } from "react";
import { GameCard } from "@/components/game-card";
import { useSession } from "@/components/session-provider";
import { CATEGORIES, GAMES } from "@/lib/games";
import { topScores } from "@/lib/scores";

type Category = (typeof CATEGORIES)[number];

/** Búsqueda por nombre o categoría, chips de categoría y rejilla de cartuchos. */
export function Library() {
  const { localScores } = useSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Todos");

  const q = query.trim().toLowerCase();
  const games = GAMES.filter(
    (g) =>
      (category === "Todos" || g.category === category) &&
      (!q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)),
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3.5">
        <label className="flex max-w-110 flex-[1_1_280px] items-center gap-2.5 border-2 border-cyan/53 bg-bg/80 px-3.5 shadow-[0_0_12px_#00f5ff22] focus-within:border-cyan">
          <span aria-hidden="true" className="font-arcade text-xs text-cyan">
            &gt;
          </span>
          <span className="sr-only">Buscar juego</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar juego por nombre o categoría…"
            className="h-11.5 min-w-0 flex-1 border-0 bg-transparent font-body text-base text-ink outline-none focus-visible:outline-none"
          />
        </label>

        <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={`cursor-pointer border px-3 py-2.5 text-sm font-bold hover:border-yellow active:scale-95 ${
                  active ? "border-magenta bg-magenta/13 text-magenta" : "border-white/13 bg-transparent text-muted"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {games.length === 0 ? (
        <div role="status" className="flex flex-col gap-3 py-12">
          <p className="m-0 font-arcade text-sm text-magenta">SIN RESULTADOS</p>
          <p className="m-0 text-muted">Ningún cartucho coincide con «{query}». Prueba con otro nombre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-7">
          {games.map((g) => (
            <GameCard key={g.id} game={g} best={topScores(g.id, localScores[g.id], 1)[0]?.score ?? 0} />
          ))}
        </div>
      )}
    </>
  );
}
