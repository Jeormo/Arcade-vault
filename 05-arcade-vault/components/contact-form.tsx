"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/(portal)/sobre-nosotros/actions";
import {
  CONTACT_TEXTS,
  EMAIL_MAX_LENGTH,
  HONEYPOT_FIELD,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  type ContactInput,
  type ContactState,
} from "@/lib/contact";

const INITIAL_STATE: ContactState = { status: "idle" };

const labelClass = "flex flex-col gap-2 text-sm font-bold text-muted";
const fieldClass =
  "border-2 bg-bg px-3.5 font-body text-base text-ink outline-none transition-[box-shadow,border-color] duration-150 focus:border-cyan focus:shadow-[0_0_14px_#00f5ff99,inset_0_0_8px_#00f5ff33] focus-visible:outline-none";

function fieldBorder(hasError: boolean) {
  return hasError ? "border-magenta" : "border-cyan/40";
}

type FieldProps = {
  id: keyof ContactInput;
  label: string;
  error?: string;
  children: (a11y: { "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  const errorId = `contacto-${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`contacto-${id}`} className={labelClass}>
        {label}
      </label>
      {children({ "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}
      {error && (
        <p id={errorId} className="m-0 text-sm font-bold text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}

/** Formulario de contacto: la validación la hace el servidor (sendContact). */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, INITIAL_STATE);

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};
  // Tras un error se conservan los valores; tras un éxito, React vacía el formulario.
  const values = state.status === "error" ? state.values : undefined;

  return (
    <form
      action={formAction}
      noValidate
      className="relative flex flex-col gap-4.5 border-2 border-cyan/53 bg-[#0d0d16f2] px-6 py-7 shadow-[0_0_30px_#00f5ff22,inset_0_0_24px_#00f5ff11]"
    >
      <Field id="name" label="Nombre" error={errors.name}>
        {(a11y) => (
          <input
            id="contacto-name"
            name="name"
            required
            maxLength={NAME_MAX_LENGTH}
            autoComplete="name"
            placeholder="Tu nombre o alias"
            defaultValue={values?.name}
            className={`h-12 ${fieldClass} ${fieldBorder(Boolean(errors.name))}`}
            {...a11y}
          />
        )}
      </Field>

      <Field id="email" label="Correo electrónico" error={errors.email}>
        {(a11y) => (
          <input
            id="contacto-email"
            name="email"
            type="email"
            required
            maxLength={EMAIL_MAX_LENGTH}
            autoComplete="email"
            placeholder="jugador@ejemplo.com"
            defaultValue={values?.email}
            className={`h-12 ${fieldClass} ${fieldBorder(Boolean(errors.email))}`}
            {...a11y}
          />
        )}
      </Field>

      <Field id="message" label="Mensaje" error={errors.message}>
        {(a11y) => (
          <textarea
            id="contacto-message"
            name="message"
            required
            maxLength={MESSAGE_MAX_LENGTH}
            rows={6}
            placeholder="Cuéntanos qué clásico echas de menos, una idea o un fallo que hayas visto."
            defaultValue={values?.message}
            className={`resize-y py-3 leading-normal ${fieldClass} ${fieldBorder(Boolean(errors.message))}`}
            {...a11y}
          />
        )}
      </Field>

      {/* Campo trampa: invisible para personas y lectores de pantalla, los bots lo rellenan. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto size-px overflow-hidden">
        <label htmlFor={`contacto-${HONEYPOT_FIELD}`}>No rellenes este campo</label>
        <input id={`contacto-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="polite" className="empty:hidden">
        {state.status === "error" && (
          <p className="m-0 border-l-[3px] border-magenta pl-3 text-sm font-bold text-magenta">{state.message}</p>
        )}
        {state.status === "success" && (
          <p className="m-0 font-arcade text-[11px] leading-[1.6] text-green [text-shadow:0_0_8px_#39ff88]">
            {CONTACT_TEXTS.success}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 cursor-pointer self-start border-[3px] border-cyan bg-transparent px-5.5 py-4.5 font-arcade text-xs text-cyan shadow-[0_0_12px_#00f5ff55] hover:bg-cyan hover:text-bg active:translate-y-0.5 disabled:cursor-wait disabled:border-faint disabled:text-muted disabled:shadow-none disabled:hover:bg-transparent disabled:active:translate-y-0"
      >
        {pending ? "ENVIANDO…" : "ENVIAR MENSAJE"}
      </button>
    </form>
  );
}
