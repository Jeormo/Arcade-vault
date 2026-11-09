# SPEC 01 — MVP visual de Arcade Vault (todas las pantallas)

> **Status:** Aprobado
> **Depends on:** —
> **Date:** 2026-11-09
> **Objective:** Recrear en Next.js/React/Tailwind las cuatro pantallas del prototipo `refereces/arcade-vault-retro-portal/project/Arcade Vault.dc.html` (Biblioteca con detalle, Reproductor, Acceso y Salón de la Fama) con datos simulados y sin implementar ningún juego.

## Por qué existe este spec

El repositorio es todavía el scaffold de `create-next-app`. El prototipo HTML es la única fuente de verdad visual y mezcla estado, datos y motor de juego en un solo componente. Este spec lo separa en rutas, componentes y datos simulados, y deja el motor de juego fuera para que cada juego tenga su propio spec.

## Alcance

**Dentro:**

- Fondo global neón (cuadrícula en perspectiva, horizonte magenta) y overlay de scanlines, siempre activos.
- Barra de navegación sticky con enlaces Biblioteca / Salón de la Fama, botón «Iniciar Sesión» o avatar con iniciales y «Salir», y menú lateral en móvil (< 760 px).
- Pantalla **Biblioteca** (`/`): título con parpadeo, búsqueda por nombre o categoría, chips de categoría, rejilla de 6 tarjetas, estado «SIN RESULTADOS».
- Pantalla **Detalle de juego** (`/juegos/[id]`): descripción larga, controles, botón «JUGAR AHORA», tabla de las 10 mejores puntuaciones con animación de entrada.
- Pantalla **Reproductor** (`/juegos/[id]/jugar`): marco CRT, HUD (puntuación, vidas, nivel, jugador), botones PAUSA/CONTINUAR y SALIR, estado de carga de 1,1 s, overlay de pausa (tecla P o Esc), placeholder del cartucho y botón «SIMULAR FIN DE PARTIDA».
- Modal **FIN DEL JUEGO**: puntuación final, «GUARDAR PUNTUACIÓN» con efecto de tecleo, «JUGAR DE NUEVO», «VOLVER AL VAULT».
- Pantalla **Acceso** (`/acceso`): pestañas Iniciar sesión / Crear cuenta, validación en cliente, botones Google y GitHub simulados, «Jugar como invitado».
- Pantalla **Salón de la Fama** (`/salon-de-la-fama`): pestañas por juego, tabla top 10 con medallas, fila resaltada «TÚ», bloque «TU MEJOR MARCA» o aviso de inicio de sesión.
- Catálogo de 6 juegos y ranking semilla determinista en código.
- Sesión simulada y puntuaciones guardadas en `localStorage`.
- Diseño responsive (móvil, tablet, escritorio) y estados `:hover`, `:active` y `:focus-visible` del prototipo.

**Fuera de alcance (para otros specs):**

- Cualquier motor de juego: Arkanoid y Snake del prototipo **no** se portan, ni su canvas, ni su lógica de colisiones.
- Interfaz `GameEngine` o contrato para enchufar juegos.
- Carga de juegos HTML externos en `iframe` y recepción de puntuaciones por `postMessage`.
- Backend real: Supabase, API de scores, OAuth real con Google o GitHub.
- Sistema de diseño `nocturne` de `_ds/`: el prototipo no lo usa y su paleta contradice el neón.
- Conmutador de efectos CRT y ajuste de dificultad (los «Tweaks» del prototipo).
- Tests automatizados (el repo no tiene runner).
- Internacionalización: la interfaz queda solo en español.

## Modelo de datos

Estructuras nuevas, en `lib/`. Los nombres de campo van en inglés; los textos visibles, en español.

```ts
// lib/games.ts
export type GameCategory = "Bloques" | "Clásico" | "Puzle" | "Laberinto" | "Disparos";

export type Game = {
  id: "arkanoid" | "snake" | "tetris" | "pacman" | "invaders" | "asteroids";
  title: string;        // "SPACE INVADERS"
  category: GameCategory;
  color: string;        // acento principal, hex
  shadowColor: string;  // acento secundario para text-shadow, hex
  glyph: string;        // "▀▄●"
  description: string;  // una frase, para la tarjeta
  longDescription: string;
  controls: string;
};

// lib/scores.ts
export type ScoreEntry = { name: string; score: number; date: string }; // date: ISO 8601

// lib/session.ts
export type User = { name: string }; // mayúsculas, máx. 14 caracteres
```

Convenciones:

- El catálogo y los textos salen literalmente de `GAMES` del prototipo (ids, colores, descripciones, controles).
- `seedScores(id)` replica el generador pseudoaleatorio determinista del prototipo (12 entradas por juego). Mismo `id`, mismas puntuaciones en servidor y cliente, para evitar errores de hidratación.
- Claves de `localStorage`: `av_user` (`User`) y `av_scores` (`Record<GameId, ScoreEntry[]>`). Se mantienen los nombres del prototipo.
- Puntuaciones se muestran con 6 dígitos (`000000`), fechas como `dd/mm/aaaa`, rangos con 2 dígitos.
- Invitado: `playerName` es `"INVITADO"`.
- Un jugador sin nombre de sesión no recibe resaltado «TÚ».

## Plan de implementación

Antes del paso 1, leer la guía relevante de `node_modules/next/dist/docs/` (exigido por `AGENTS.md`). El proyecto tiene `cacheComponents` activo: todo acceso a `localStorage` va en componentes cliente.

1. **Tokens y fondo.** Definir en `app/globals.css` los tokens neón (`--color-cyan`, `--color-magenta`, `--color-yellow`, `--color-green`, `--color-violet`, `--color-orange`, fondo, texto) y los `@keyframes` del prototipo (`flicker`, `grid`, `pulse`, `enter`, `fade`, `row`, `blink`, `slide`, `spin`, `wipe`). Cargar Press Start 2P y Courier Prime con `next/font/google` en `app/layout.tsx`, y reemplazar Geist. Montar `components/background.tsx` (cuadrícula + horizonte) y `components/scanlines.tsx`. Verificación: `npm run dev` muestra el fondo en `/`.
2. **Datos simulados.** Crear `lib/games.ts` (catálogo, constante `CATEGORIES`) y `lib/scores.ts` (`seedScores`, `formatScore`, `formatDate`, `topScores`). Verificación: `npm run lint` sin errores.
3. **Sesión y puntuaciones locales.** Crear `lib/session.ts` y un proveedor cliente `components/session-provider.tsx` que lee `av_user` y `av_scores` tras montar, expone `user`, `login`, `logout`, `saveScore`, `localScores`. Verificación: el proveedor envuelve `app/layout.tsx` sin romper la hidratación.
4. **Navegación.** Crear `components/nav-bar.tsx` (escritorio y menú lateral móvil) y la estructura de grupos de rutas: `app/(portal)/layout.tsx` con la barra, `app/(player)/layout.tsx` sin ella. Verificación: los enlaces cambian de ruta y el estado activo se subraya.
5. **Biblioteca.** Mover `app/page.tsx` a `app/(portal)/page.tsx`. Crear `components/game-card.tsx`, `components/library.tsx` (búsqueda, chips, «SIN RESULTADOS»). Verificación: filtrar por «Disparos» deja 2 tarjetas.
6. **Detalle.** Crear `app/(portal)/juegos/[id]/page.tsx` con `generateStaticParams` y `notFound()` para ids desconocidos, y `components/score-table-compact.tsx`. Verificación: `/juegos/snake` muestra 10 filas; `/juegos/nope` da 404.
7. **Acceso.** Crear `app/(portal)/acceso/page.tsx` y `components/auth-form.tsx` (pestañas, validación, social simulado, invitado). Verificación: login válido redirige a `/` y la barra muestra el avatar.
8. **Salón de la Fama.** Crear `app/(portal)/salon-de-la-fama/page.tsx` y `components/fame-board.tsx` (pestañas, medallas, «TÚ», «TU MEJOR MARCA», aviso de login). Verificación: cambiar de pestaña reinicia la animación de filas.
9. **Reproductor.** Crear `app/(player)/juegos/[id]/jugar/page.tsx`, `components/player-frame.tsx` (HUD, marco CRT, carga, pausa con P/Esc, placeholder) y `components/game-over-modal.tsx` (guardar puntuación, tecleo, rejugar, volver). Verificación: «SIMULAR FIN DE PARTIDA» abre el modal y guardar añade la entrada al Salón de la Fama.
10. **Pulido responsive y accesibilidad.** Revisar móvil, tablet y escritorio; foco visible; `aria-label` del botón de menú; `prefers-reduced-motion` desactiva `flicker`, `blink` y `grid`. Verificación: `npm run lint` y `npm run build` terminan sin errores.

## Criterios de aceptación

- [ ] `npm run lint` y `npm run build` terminan con código 0.
- [ ] Existen las rutas `/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/acceso` y `/salon-de-la-fama`, y cargan sin errores en la consola ni avisos de hidratación.
- [ ] `/juegos/inexistente` devuelve la página 404.
- [ ] La Biblioteca muestra 6 tarjetas; el chip «Todos» las muestra todas y «Disparos» muestra exactamente 2.
- [ ] Buscar «tetris» deja 1 tarjeta; buscar «zzz» muestra «SIN RESULTADOS» y el texto de la búsqueda.
- [ ] Hacer clic en una tarjeta abre su detalle; el botón «JUGAR» de la tarjeta abre el reproductor sin pasar por el detalle.
- [ ] El detalle muestra 10 filas de puntuación, con oro, plata y bronce en las tres primeras.
- [ ] El reproductor oculta la barra de navegación y muestra «CARGANDO CARTUCHO…» durante 1,1 s.
- [ ] Pulsar P o Esc en el reproductor alterna el overlay «PAUSA» y la etiqueta PAUSA/CONTINUAR.
- [ ] «SIMULAR FIN DE PARTIDA» abre el modal con una puntuación de 6 dígitos.
- [ ] «GUARDAR PUNTUACIÓN» escribe en `localStorage["av_scores"]`, muestra «PUNTUACIÓN GUARDADA» y oculta el botón.
- [ ] Una puntuación guardada aparece en el Salón de la Fama del juego correspondiente tras recargar la página.
- [ ] En Acceso, enviar vacío muestra «Introduce tu usuario y tu contraseña.»; contraseña de menos de 4 caracteres muestra el error de longitud; en «Crear cuenta», un correo inválido muestra el error de correo.
- [ ] Un login válido guarda `av_user` en mayúsculas (máx. 14 caracteres) y redirige a `/`.
- [ ] «Salir» borra `av_user` y la barra vuelve a mostrar «Iniciar Sesión».
- [ ] Con sesión iniciada, las filas del usuario en el Salón de la Fama llevan la etiqueta «TÚ» y aparece «TU MEJOR MARCA»; sin sesión aparece el aviso de inicio de sesión.
- [ ] «Jugar como invitado» muestra «Jugarás como INVITADO» en el detalle y deja el HUD con jugador `INVITADO`.
- [ ] A menos de 760 px la barra muestra el botón de menú, y el panel lateral se abre y se cierra.
- [ ] No hay ningún `<canvas>` de juego ni código de Arkanoid o Snake en el repositorio.
- [ ] Ningún archivo importa o copia `refereces/`.

## Decisiones tomadas y descartadas

- **Sí:** rutas reales del App Router. URLs compartibles y botón atrás funcional; el prototipo usaba un `screen` en estado solo por limitación del medio.
- **No:** detalle como modal con rutas interceptadas. Es más complejo y no aporta al MVP; el detalle es una página con botón «VOLVER AL VAULT».
- **Sí:** grupos de rutas `(portal)` y `(player)`. El reproductor oculta la barra y se resuelve con layouts, sin condicionales.
- **Sí:** placeholder en el reproductor con «SIMULAR FIN DE PARTIDA». Permite probar el modal, el guardado y el Salón de la Fama sin motor de juego.
- **No:** `<canvas>` ni interfaz `GameEngine` ahora. Se diseñará con el primer juego real, para no inventar un contrato sin uso.
- **Sí:** datos simulados más `localStorage`, con las claves del prototipo (`av_user`, `av_scores`). Mantiene el comportamiento esperado sin backend.
- **No:** Supabase o API de scores. Es un spec propio; el prototipo ya marca en comentarios dónde enchufarlo.
- **Sí:** ranking semilla determinista. Evita desajustes de hidratación entre servidor y cliente.
- **Sí:** estilo neón fiel al prototipo, con tokens en `app/globals.css` y utilidades de Tailwind.
- **No:** sistema `nocturne` de `_ds/`. El prototipo no lo importa y su dirección (violeta sobrio, Inter) contradice el neón retro.
- **No:** conmutadores de scanlines, rejilla animada y dificultad. Eran controles del editor de diseño, no producto.
- **Sí:** `prefers-reduced-motion` desactiva las animaciones intensas. El prototipo no lo cubría; es una adición mínima de accesibilidad.
- **Sí:** textos solo en español, como el prototipo.

## Riesgos identificados

| Riesgo                                                                                          | Mitigación                                                                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Este Next.js (16, `cacheComponents`, `partialPrefetching`) cambia APIs respecto a lo conocido   | Leer la guía en `node_modules/next/dist/docs/` antes de escribir rutas; `localStorage` solo en cliente. |
| Errores de hidratación por leer `localStorage` en el primer render                              | El proveedor lee tras montar; el primer render pinta el estado «sin sesión» y sin puntuaciones locales. |
| `localStorage` bloqueado o con JSON corrupto                                                    | Lectura y escritura dentro de `try/catch`; si falla, estado en memoria y la app sigue funcionando.      |
| Copiar la estructura del prototipo (estilos en línea, un solo componente) en lugar de recrearla | Componentes pequeños con Tailwind; el prototipo se usa como referencia visual, no como código.          |
| Fuente Press Start 2P ilegible a tamaños pequeños (7–9 px en el prototipo)                      | Respetar los tamaños del diseño; el texto largo va en Courier Prime.                                    |
| Rendimiento de la cuadrícula en perspectiva animada en móviles                                  | Capa fija con `pointer-events: none`; se desactiva con `prefers-reduced-motion`.                        |

## Qué **no** está en este spec

- Ningún juego jugable (Arkanoid, Snake ni los otros cuatro).
- Motor de juego, `<canvas>` o contrato `GameEngine`.
- Juegos externos en `iframe` y `postMessage`.
- Backend, autenticación real u OAuth real.
- Sistema de diseño `nocturne`.
- Controles de efectos CRT o de dificultad.
- Tests automatizados.

Cada uno de estos puntos, si se aborda, va en su propio spec.
