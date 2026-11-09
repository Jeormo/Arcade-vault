import { NavBar } from "@/components/nav-bar";

/** Pantallas del portal: Biblioteca, detalle, Acceso y Salón de la Fama, con barra de navegación. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
