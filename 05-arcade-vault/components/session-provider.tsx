"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { GameId } from "@/lib/games";
import type { ScoreEntry } from "@/lib/scores";
import {
  GUEST_NAME,
  addLocalScore,
  getServerSessionSnapshot,
  getSessionSnapshot,
  normalizeUserName,
  setSessionUser,
  subscribeSession,
  type LocalScores,
  type User,
} from "@/lib/session";

type SessionValue = {
  user: User | null;
  /** Nombre con el que se juega: el del usuario o "INVITADO". */
  playerName: string;
  localScores: LocalScores;
  login: (name: string) => void;
  logout: () => void;
  /** Guarda una partida con el nombre del jugador actual y la fecha de ahora. */
  saveScore: (id: GameId, score: number) => ScoreEntry;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // El primer render (servidor e hidratación) usa el estado «sin sesión»;
  // tras montar, React vuelve a leer el snapshot del cliente desde localStorage.
  const { user, scores } = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  const value = useMemo<SessionValue>(() => {
    const playerName = user?.name ?? GUEST_NAME;
    return {
      user,
      playerName,
      localScores: scores,
      login: (name) => setSessionUser({ name: normalizeUserName(name) }),
      logout: () => setSessionUser(null),
      saveScore: (id, score) => {
        const entry: ScoreEntry = { name: playerName, score, date: new Date().toISOString() };
        addLocalScore(id, entry);
        return entry;
      },
    };
  }, [user, scores]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession debe usarse dentro de <SessionProvider>.");
  return value;
}
