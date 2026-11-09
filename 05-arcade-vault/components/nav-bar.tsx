"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";

type Section = { href: string; label: string; isActive: (pathname: string) => boolean };

const SECTIONS: Section[] = [
  {
    href: "/",
    label: "Biblioteca",
    // El detalle de un juego forma parte de la Biblioteca.
    isActive: (p) => p === "/" || p.startsWith("/juegos/"),
  },
  {
    href: "/salon-de-la-fama",
    label: "Salón de la Fama",
    isActive: (p) => p.startsWith("/salon-de-la-fama"),
  },
];

const loginButton =
  "cursor-pointer border-2 border-magenta bg-transparent font-arcade text-[10px] text-magenta hover:bg-magenta hover:text-bg active:translate-y-0.5 active:scale-95";

const logoutButton =
  "cursor-pointer border border-faint bg-transparent text-muted hover:border-magenta hover:text-magenta";

function Avatar({ name, size }: { name: string; size: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center border-2 border-yellow font-arcade text-[11px] text-yellow ${
        size === "sm" ? "size-9 shadow-[0_0_10px_#f5ff0066]" : "size-10"
      }`}
    >
      {name.slice(0, 2)}
    </span>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useSession();

  // El menú se abre «en» una ruta: al navegar a otra, queda cerrado sin efectos extra.
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === pathname;
  const closeMenu = () => setMenuOpenAt(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpenAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-cyan/27 bg-bg/90 shadow-[0_4px_24px_#00f5ff14] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-7 px-5 py-3.5">
          <Link
            href="/"
            className="font-arcade text-sm tracking-[1px] text-cyan [text-shadow:0_0_8px_#00f5ff,2px_2px_0_#ff006e] hover:text-cyan"
          >
            ARCADE VAULT
          </Link>

          {/* Escritorio (≥ 760 px) */}
          <div className="hidden flex-1 gap-6 min-[760px]:flex">
            {SECTIONS.map((s) => {
              const active = s.isActive(pathname);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 py-1.5 text-base font-bold tracking-[1px] hover:text-yellow ${
                    active
                      ? "border-cyan text-cyan shadow-[0_6px_10px_-6px_#00f5ff]"
                      : "border-transparent text-muted"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden min-[760px]:block">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size="sm" />
                <span className="font-bold text-text">{user.name}</span>
                <button type="button" onClick={handleLogout} className={`${logoutButton} px-2.5 py-1.5 text-[13px]`}>
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/acceso" className={`${loginButton} inline-block px-3.5 py-2.5 shadow-[0_0_10px_#ff006e55] hover:shadow-[0_0_20px_#ff006e]`}>
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Móvil (< 760 px) */}
          <button
            type="button"
            onClick={() => setMenuOpenAt(pathname)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            className="ml-auto flex size-11 cursor-pointer flex-col items-center justify-center gap-1.25 border-2 border-cyan bg-transparent shadow-[0_0_10px_#00f5ff55] active:scale-94 min-[760px]:hidden"
          >
            <span className="h-0.75 w-5 bg-cyan" />
            <span className="h-0.75 w-5 bg-cyan" />
            <span className="h-0.75 w-5 bg-cyan" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="min-[760px]:hidden">
          <div aria-hidden="true" onClick={closeMenu} className="fixed inset-0 z-70 animate-[fade_0.2s] bg-bg/80" />
          <aside
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-y-0 right-0 z-71 flex w-[min(300px,82vw)] animate-slide flex-col gap-4.5 border-l-2 border-magenta bg-[#0e0e16] p-6 shadow-[-10px_0_40px_#ff006e33]"
          >
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Cerrar menú"
              autoFocus
              className="cursor-pointer self-end border-0 bg-transparent p-2.5 font-arcade text-sm text-magenta"
            >
              X
            </button>

            {SECTIONS.map((s) => {
              const active = s.isActive(pathname);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`border-l-[3px] px-3.5 py-3 text-lg font-bold hover:text-yellow ${
                    active ? "border-cyan text-cyan" : "border-transparent text-muted"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}

            <div className="flex-1" />

            {user ? (
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size="md" />
                <span className="flex-1 font-bold">{user.name}</span>
                <button type="button" onClick={handleLogout} className={`${logoutButton} px-3 py-2.5`}>
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/acceso" onClick={closeMenu} className={`${loginButton} p-3.5 text-center`}>
                Iniciar Sesión
              </Link>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
