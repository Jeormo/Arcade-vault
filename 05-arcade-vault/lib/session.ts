import type { GameId } from "./games";
import type { ScoreEntry } from "./scores";

/** name: mayúsculas, máx. 14 caracteres. */
export type User = { name: string };

export type LocalScores = Partial<Record<GameId, ScoreEntry[]>>;

export type SessionState = { user: User | null; scores: LocalScores };

export const USER_KEY = "av_user";
export const SCORES_KEY = "av_scores";
export const GUEST_NAME = "INVITADO";
export const MAX_NAME_LENGTH = 14;

export function normalizeUserName(name: string): string {
  return name.trim().toUpperCase().slice(0, MAX_NAME_LENGTH);
}

// ---- localStorage tolerante a fallos (bloqueado, cuota, JSON corrupto) ----

function readJSON(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento: el estado sigue en memoria y la app funciona igual.
  }
}

function parseUser(value: unknown): User | null {
  if (value && typeof value === "object" && typeof (value as User).name === "string") {
    const name = normalizeUserName((value as User).name);
    return name ? { name } : null;
  }
  return null;
}

function parseScores(value: unknown): LocalScores {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LocalScores) : {};
}

// ---- Almacén externo para useSyncExternalStore ----

const SERVER_STATE: SessionState = { user: null, scores: {} };

let state: SessionState | null = null;
const listeners = new Set<() => void>();

function emit(next: SessionState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Snapshot del cliente. Lee localStorage una sola vez y después vive en memoria. */
export function getSessionSnapshot(): SessionState {
  if (state === null) {
    state = { user: parseUser(readJSON(USER_KEY)), scores: parseScores(readJSON(SCORES_KEY)) };
  }
  return state;
}

/** Snapshot del servidor y de la hidratación: sin sesión y sin puntuaciones locales. */
export function getServerSessionSnapshot(): SessionState {
  return SERVER_STATE;
}

export function setSessionUser(user: User | null): void {
  writeJSON(USER_KEY, user);
  emit({ ...getSessionSnapshot(), user });
}

export function addLocalScore(id: GameId, entry: ScoreEntry): void {
  const current = getSessionSnapshot();
  const scores: LocalScores = { ...current.scores, [id]: [...(current.scores[id] ?? []), entry] };
  writeJSON(SCORES_KEY, scores);
  emit({ ...current, scores });
}
