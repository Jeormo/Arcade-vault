import type { CSSProperties } from "react";
import type { Game } from "@/lib/games";

/** Oro, plata y bronce para los tres primeros puestos de un ranking. */
export const MEDAL_COLORS = ["#ffd700", "#d8e4f0", "#ff9a4d"] as const;

/**
 * Variables CSS con los acentos de un juego, para usarlas en utilidades de Tailwind:
 * text-(--game), border-(--game-dim), shadow-[0_0_14px_var(--game-faint)], [background:var(--game-thumb)]…
 */
export function gameVars(game: Game): CSSProperties {
  const { color, shadowColor } = game;
  return {
    "--game": color,
    "--game-dim": `${color}88`,
    "--game-faint": `${color}33`,
    "--game-shadow": shadowColor,
    "--game-thumb": [
      `radial-gradient(circle at 25% 30%, ${color}55, transparent 55%)`,
      `radial-gradient(circle at 85% 85%, ${shadowColor}44, transparent 50%)`,
      "repeating-linear-gradient(0deg, #ffffff0a 0 2px, transparent 2px 10px)",
      "repeating-linear-gradient(90deg, #ffffff0a 0 2px, transparent 2px 10px)",
      "#0d0d16",
    ].join(", "),
  } as CSSProperties;
}
