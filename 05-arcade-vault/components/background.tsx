/**
 * Fondo global: resplandor magenta, cuadrícula en perspectiva animada y línea de horizonte.
 * Capa fija bajo todo el contenido, sin eventos de puntero.
 */
export function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg bg-[radial-gradient(ellipse_at_50%_58%,#ff006e22,transparent_55%)]"
    >
      <div className="absolute -inset-x-1/2 top-[58%] h-[80%] origin-top transform-[perspective(420px)_rotateX(62deg)] animate-grid motion-reduce:animate-none bg-[linear-gradient(#00f5ff44_1px,transparent_1px),linear-gradient(90deg,#ff006e33_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,transparent,#000_30%,#000)]" />
      <div className="absolute inset-x-0 top-[58%] h-0.5 bg-magenta shadow-[0_0_18px_#ff006e,0_0_40px_#ff006e]" />
    </div>
  );
}
