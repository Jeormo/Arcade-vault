export type GameCategory = "Bloques" | "Clásico" | "Puzle" | "Laberinto" | "Disparos";

export type GameId = "arkanoid" | "snake" | "tetris" | "pacman" | "invaders" | "asteroids";

export type Game = {
  id: GameId;
  title: string;
  category: GameCategory;
  /** Acento principal (hex). */
  color: string;
  /** Acento secundario para text-shadow (hex). */
  shadowColor: string;
  glyph: string;
  /** Una frase, para la tarjeta. */
  description: string;
  longDescription: string;
  controls: string;
};

const CYAN = "#00f5ff";
const MAGENTA = "#ff006e";
const YELLOW = "#f5ff00";

export const GAMES: readonly Game[] = [
  {
    id: "arkanoid",
    title: "ARKANOID",
    category: "Bloques",
    color: CYAN,
    shadowColor: MAGENTA,
    glyph: "▀▄●",
    description: "Destruye cada ladrillo con tu nave y una bola de energía.",
    longDescription:
      "Controla la nave Vaus y rebota la bola de energía contra el muro de ladrillos. Cada nivel acelera el ritmo y reduce tu margen de error. Rompe todos los bloques sin dejar caer la bola.",
    controls: "Ratón, toque o ← → para mover · Espacio o clic para lanzar · P para pausar",
  },
  {
    id: "snake",
    title: "SNAKE",
    category: "Clásico",
    color: "#39ff88",
    shadowColor: YELLOW,
    glyph: "■■■●",
    description: "Come, crece y no muerdas tu propia cola.",
    longDescription:
      "Guía a la serpiente por la rejilla y devora cada bit de energía para crecer. Cada cinco bocados subes de nivel y la velocidad aumenta. Un choque contra la pared o contra ti mismo te cuesta una vida.",
    controls: "Flechas o WASD · Desliza en móvil · P para pausar",
  },
  {
    id: "tetris",
    title: "TETRIS",
    category: "Puzle",
    color: MAGENTA,
    shadowColor: CYAN,
    glyph: "▙▟",
    description: "Encaja las piezas que caen y limpia líneas sin parar.",
    longDescription:
      "Gira y coloca los tetrominós antes de que toquen el techo. Completa líneas horizontales para eliminarlas y sumar puntos. Cuantas más líneas a la vez, mayor la recompensa.",
    controls: "Flechas para mover · ↑ para girar · Espacio para caída rápida",
  },
  {
    id: "pacman",
    title: "PAC-MAN",
    category: "Laberinto",
    color: YELLOW,
    shadowColor: MAGENTA,
    glyph: "◖···",
    description: "Recorre el laberinto, come puntos y esquiva fantasmas.",
    longDescription:
      "Come todos los puntos del laberinto mientras cuatro fantasmas te persiguen. Las píldoras de poder invierten la caza durante unos segundos. Despeja el tablero para pasar de nivel.",
    controls: "Flechas o WASD para moverte",
  },
  {
    id: "invaders",
    title: "SPACE INVADERS",
    category: "Disparos",
    color: "#b26bff",
    shadowColor: CYAN,
    glyph: "▚▞",
    description: "Defiende la Tierra de oleadas de invasores alienígenas.",
    longDescription:
      "Las filas de invasores descienden cada vez más rápido. Dispara desde tu cañón y cúbrete tras los búnkeres antes de que lleguen al suelo. Atento al platillo misterioso: vale puntos extra.",
    controls: "← → para mover · Espacio para disparar",
  },
  {
    id: "asteroids",
    title: "ASTEROIDS",
    category: "Disparos",
    color: "#ff8a00",
    shadowColor: CYAN,
    glyph: "◇ △",
    description: "Pilota tu nave y pulveriza rocas en el espacio profundo.",
    longDescription:
      "Gira, acelera y dispara para fragmentar los asteroides en piezas cada vez más pequeñas. La inercia no perdona: controla el empuje. Usa el hiperespacio solo como último recurso.",
    controls: "← → para girar · ↑ para acelerar · Espacio para disparar",
  },
];

export const CATEGORIES: readonly ("Todos" | GameCategory)[] = [
  "Todos",
  "Bloques",
  "Clásico",
  "Puzle",
  "Laberinto",
  "Disparos",
];

export function getGame(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

/** Número de cartucho con 2 dígitos según su posición en el catálogo ("01"…"06"). */
export function gameNumber(game: Game): string {
  return String(GAMES.indexOf(game) + 1).padStart(2, "0");
}
