"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSession } from "@/components/session-provider";

type Tab = "login" | "register";

const TABS: { id: Tab; label: string }[] = [
  { id: "login", label: "INICIAR SESIÓN" },
  { id: "register", label: "CREAR CUENTA" },
];

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const labelClass = "flex flex-col gap-2 text-sm font-bold text-muted";
const inputClass =
  "h-12 border-2 border-cyan/40 bg-bg px-3.5 font-body text-base text-ink outline-none transition-[box-shadow,border-color] duration-150 focus:border-cyan focus:shadow-[0_0_14px_#00f5ff99,inset_0_0_8px_#00f5ff33] focus-visible:outline-none";
const socialClass =
  "h-11.5 cursor-pointer border border-faint bg-transparent text-[15px] font-bold text-[#c4d6e3] hover:border-cyan hover:text-cyan active:scale-96";

/** Acceso simulado: pestañas, validación en cliente, social simulado e invitado. */
export function AuthForm() {
  const router = useRouter();
  const { login, logout } = useSession();

  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isRegister = tab === "register";

  const enter = (userName: string) => {
    login(userName);
    router.push("/");
  };

  const selectTab = (next: Tab) => {
    setTab(next);
    setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !password) return setError("Introduce tu usuario y tu contraseña.");
    if (isRegister && !EMAIL_PATTERN.test(email)) return setError("Introduce un correo electrónico válido.");
    if (password.length < 4) return setError("La contraseña debe tener al menos 4 caracteres.");
    enter(name);
  };

  const playAsGuest = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex w-[min(430px,100%)] flex-col gap-5.5 border-2 border-cyan/53 bg-[#0d0d16f2] px-6.5 py-8 shadow-[0_0_30px_#00f5ff33,inset_0_0_24px_#00f5ff11]">
      <h1 className="m-0 animate-[flicker_5s_infinite] text-center motion-reduce:animate-none motion-reduce:[text-shadow:0_0_6px_#00f5ff,0_0_18px_#00f5ff,0_0_42px_#00f5ff,3px_3px_0_#ff006e] font-arcade text-xl font-normal text-ink">
        ARCADE VAULT
      </h1>

      <div role="tablist" aria-label="Tipo de acceso" className="grid grid-cols-2 border-2 border-magenta">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="auth-form"
              onClick={() => selectTab(t.id)}
              className={`cursor-pointer border-0 px-1.5 py-3.5 font-arcade text-[9px] ${
                active ? "bg-magenta text-bg" : "bg-transparent text-magenta"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <form id="auth-form" role="tabpanel" noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className={labelClass}>
          Usuario
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu alias de jugador"
            autoComplete="username"
            className={inputClass}
          />
        </label>
        {isRegister && (
          <label className={labelClass}>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jugador@ejemplo.com"
              autoComplete="email"
              className={inputClass}
            />
          </label>
        )}
        <label className={labelClass}>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={isRegister ? "new-password" : "current-password"}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="m-0 text-sm font-bold text-magenta">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-1 cursor-pointer border-2 border-yellow bg-transparent p-4 font-arcade text-[11px] text-yellow shadow-[0_0_12px_#f5ff0055] hover:bg-yellow hover:text-bg active:translate-y-0.5 active:scale-96"
        >
          {isRegister ? "CREAR CUENTA" : "ENTRAR"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-[13px] text-faint">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-faint" />
        o continúa con
        <span className="h-px flex-1 bg-linear-to-r from-faint to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => enter("JUGADOR_G")} className={socialClass}>
          Google
        </button>
        <button type="button" onClick={() => enter("JUGADOR_GH")} className={socialClass}>
          GitHub
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-dashed border-white/13 pt-4 text-center">
        <button
          type="button"
          onClick={playAsGuest}
          className="cursor-pointer border-0 bg-transparent p-0 font-arcade text-[9px] leading-[1.8] text-magenta hover:text-yellow"
        >
          JUGAR COMO INVITADO
        </button>
        <span className="text-[13px] text-[#6f8396]">Sin cuenta: tus puntuaciones no entran en el ranking global.</span>
      </div>
    </div>
  );
}
