import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm, type AuthTab } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Acceso · Arcade Vault",
};

type SearchParams = PageProps<"/acceso">["searchParams"];

/** Lee ?tab= en tiempo de petición; con cacheComponents debe ir dentro de Suspense. */
async function AuthFormWithTab({ searchParams }: { searchParams: SearchParams }) {
  const { tab } = await searchParams;
  const initialTab: AuthTab = tab === "registro" ? "register" : "login";
  // key: al navegar entre /acceso y /acceso?tab=registro, el formulario se reinicia en la pestaña pedida.
  return <AuthForm key={initialTab} initialTab={initialTab} />;
}

export default function AccessPage({ searchParams }: PageProps<"/acceso">) {
  return (
    <main className="grid min-h-[calc(100vh-70px)] animate-enter place-items-center px-4 py-10">
      <Suspense fallback={null}>
        <AuthFormWithTab searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
