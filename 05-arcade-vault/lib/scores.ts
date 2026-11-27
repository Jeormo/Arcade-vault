import type { GameId } from "./games";

/** date: ISO 8601 */
export type ScoreEntry = { name: string; score: number; date: string };

const NAMES = [
  "NEO_K",
  "PIXELQUEEN",
  "KRAKEN",
  "R4DIX",
  "LUNA8BIT",
  "DR.BYTE",
  "ZEROCOOL",
  "MAYA_X",
  "TURBO",
  "GLITCH",
  "VECTRA",
  "NOVA",
  "CHIPTUNE",
  "BLAST",
];

/**
 * Ranking semilla determinista: 12 entradas por juego con el mismo generador
 * congruencial del prototipo. Mismo id → mismas puntuaciones en servidor y cliente.
 * Las fechas se crean en UTC para que no dependan de la zona horaria del entorno.
 */
export function seedScores(id: GameId): ScoreEntry[] {
  let s = [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const top = 40000 + Math.floor(rnd() * 60000);
  return Array.from({ length: 12 }, (_, i) => ({
    name: NAMES[Math.floor(rnd() * NAMES.length)],
    score: Math.floor((top * Math.pow(0.86, i) * (0.95 + rnd() * 0.05)) / 10) * 10,
    date: new Date(Date.UTC(2026, Math.floor(rnd() * 10), 1 + Math.floor(rnd() * 27))).toISOString(),
  }));
}

/** Puntuación con 6 dígitos: 4210 → "004210". */
export function formatScore(score: number): string {
  return String(Math.max(0, Math.floor(score))).padStart(6, "0");
}

/** Rango con 2 dígitos: 3 → "03". */
export function formatRank(rank: number): string {
  return String(rank).padStart(2, "0");
}

/** Fecha ISO → "dd/mm/aaaa" (en UTC, idéntica en servidor y cliente). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

/**
 * Ranking de un juego: semilla + partidas locales, ordenado de mayor a menor.
 * `limit` recorta el resultado (por defecto, top 10).
 */
export function topScores(id: GameId, local: readonly ScoreEntry[] = [], limit = 10): ScoreEntry[] {
  return [...seedScores(id), ...local].sort((a, b) => b.score - a.score).slice(0, limit);
}
