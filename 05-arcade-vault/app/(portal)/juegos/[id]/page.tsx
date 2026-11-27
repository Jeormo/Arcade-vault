import Link from "next/link";
import { notFound } from "next/navigation";
import { gameVars } from "@/components/game-style";
import { PlayingAs } from "@/components/playing-as";
import { ScoreTableCompact } from "@/components/score-table-compact";
import { GAMES, gameNumber, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default async function GameDetailPage({ params }: PageProps<"/juegos/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return (
    <main
      style={gameVars(game)}
      className="mx-auto flex max-w-295 animate-[enter_0.3s_ease-out] flex-col gap-8 px-5 pt-8 pb-16"
    >
      <Link
        href="/"
        className="self-start border-2 border-cyan bg-transparent px-3.5 py-3 font-arcade text-[10px] text-cyan hover:bg-cyan hover:text-bg active:translate-y-0.5 active:scale-95"
      >
        &lt; VOLVER AL VAULT
      </Link>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-10">
        <section className="flex flex-col gap-5.5">
          <span className="font-arcade text-[10px] text-(--game)">
            {gameNumber(game)} · {game.category}
          </span>
          <h1 className="m-0 font-arcade text-[clamp(28px,5vw,56px)] leading-[1.15] font-normal text-[#f2feff] [text-shadow:0_0_10px_var(--game),0_0_30px_var(--game),4px_4px_0_var(--game-shadow)]">
            {game.title}
          </h1>
          <div
            aria-hidden="true"
            className="grid aspect-16/8 place-items-center border-2 border-(--game) font-arcade text-[56px] text-(--game) shadow-[0_0_24px_var(--game-faint)] [background:var(--game-thumb)] [text-shadow:0_0_18px_var(--game)]"
          >
            {game.glyph}
          </div>
          <p className="m-0 max-w-[60ch] text-lg leading-[1.55] text-pretty text-[#c4d6e3]">{game.longDescription}</p>
          <p className="m-0 text-[15px] text-[#8aa0b2]">
            <span className="font-bold text-yellow">CONTROLES:</span> {game.controls}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-4">
            <Link
              href={`/juegos/${game.id}/jugar`}
              className="animate-pulse border-3 border-yellow bg-yellow/6 px-7 py-5 font-arcade text-base text-yellow hover:bg-yellow hover:text-bg active:translate-y-0.75 active:scale-95"
            >
              JUGAR AHORA
            </Link>
            <PlayingAs />
          </div>
        </section>

        <ScoreTableCompact gameId={game.id} />
      </div>
    </main>
  );
}
