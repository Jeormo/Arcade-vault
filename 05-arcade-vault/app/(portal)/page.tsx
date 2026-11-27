import { Library } from "@/components/library";

export default function LibraryPage() {
  return (
    <main className="mx-auto max-w-7xl animate-enter px-5 pt-14 pb-24">
      <header className="mb-11 flex flex-col gap-4.5">
        <h1 className="m-0 animate-flicker font-arcade motion-reduce:animate-none motion-reduce:[text-shadow:0_0_6px_#00f5ff,0_0_18px_#00f5ff,0_0_42px_#00f5ff,3px_3px_0_#ff006e] text-[clamp(28px,6.4vw,72px)] leading-[1.15] font-normal text-ink">
          ARCADE VAULT
        </h1>
        <p className="m-0 animate-blink font-arcade motion-reduce:animate-none text-[clamp(10px,1.4vw,14px)] text-yellow [text-shadow:0_0_8px_#f5ff0099]">
          INSERTA UNA MONEDA PARA JUGAR
        </p>
      </header>
      <Library />
    </main>
  );
}
