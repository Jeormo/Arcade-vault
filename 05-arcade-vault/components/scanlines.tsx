/** Overlay de scanlines CRT sobre toda la página. Siempre activo. */
export function Scanlines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-90 bg-[repeating-linear-gradient(0deg,#00000055_0_1px,transparent_1px_3px)] mix-blend-multiply"
    />
  );
}
