import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Acceso · Arcade Vault",
};

export default function AccessPage() {
  return (
    <main className="grid min-h-[calc(100vh-70px)] animate-enter place-items-center px-4 py-10">
      <AuthForm />
    </main>
  );
}
