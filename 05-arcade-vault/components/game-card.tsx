import Link from "next/link";
import { gameVars } from "@/components/game-style";
import { gameNumber, type Game } from "@/lib/games";
import { formatScore } from "@/lib/scores";

/**
 * Tarjeta de cartucho. Toda la tarjeta enlaza al detalle (enlace estirado sobre el título);
 * el botón JUGAR queda por encima y abre el reproductor directamente.
 */
export function GameCard({ game, best }: { game: Game; best: number }) {
  return (
    <article
      style={gameVars(game)}
      className="group relative flex flex-col border-2 border-(--game-dim) bg-[linear-gradient(180deg,#13131e,#0c0c14)] shadow-[0_0_14px_var(--game-faint)] transition-[transform,box-shadow,border-color] duration-220 ease-out transform-3d hover:transform-[perspective(900px)_translateY(-8px)_scale(1.03)_rotateX(5deg)_rotateY(-4deg)] hover:border-(--game) hover:shadow-[0_0_22px_var(--game),0_0_60px_var(--game-faint),inset_0_0_16px_var(--game-faint)]"
    >
      <div className="relative aspect-16/10 overflow-hidden border-b-2 border-(--game-dim) [background:var(--game-thumb)]">
        <div className="absolute inset-x-0 bottom-[22%] h-0.5 bg-(--game) shadow-[0_0_12px_var(--game)]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-arcade text-[clamp(34px,4vw,48px)] text-(--game) [text-shadow:0_0_14px_var(--game),4px_4px_0_var(--game-shadow)]"
        >
          {game.glyph}
        </div>
        <span className="absolute top-2.5 left-2.5 border border-(--game-dim) bg-bg/80 px-2 py-1.5 font-arcade text-[8px] text-(--game)">
          {game.category}
        </span>
        <span className="absolute top-2.5 right-2.5 font-arcade text-[8px] text-muted">{gameNumber(game)}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4.5">
        <h2 className="m-0 font-arcade text-[15px] leading-[1.4] font-normal text-ink">
          <Link
            href={`/juegos/${game.id}`}
            className="text-ink after:absolute after:inset-0 after:content-[''] hover:text-ink focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-yellow"
          >
            {game.title}
          </Link>
        </h2>
        <p className="m-0 flex-1 text-[15px] leading-[1.4] text-pretty text-[#a9bccc]">{game.description}</p>
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div className="flex flex-col gap-1.25">
            <span className="text-[11px] font-bold tracking-[1px] text-dim">MEJOR PUNTUACIÓN</span>
            <span className="font-arcade text-[11px] text-yellow [text-shadow:0_0_6px_#f5ff0088]">
              {formatScore(best)}
            </span>
          </div>
          <Link
            href={`/juegos/${game.id}/jugar`}
            aria-label={`Jugar a ${game.title}`}
            className="relative z-10 border-2 border-(--game) bg-transparent px-3.5 py-2.5 font-arcade text-[10px] text-(--game) transition-all duration-150 hover:bg-(--game) hover:text-bg hover:shadow-[0_0_18px_var(--game)] active:translate-y-0.5 active:scale-92"
          >
            JUGAR
          </Link>
        </div>
      </div>
    </article>
  );
}
