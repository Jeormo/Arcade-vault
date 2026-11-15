// Formulario de contacto: tipos, límites, textos y validación.
// Módulo puro (sin dependencias de servidor ni de cliente): lo usan la
// Server Action y el formulario.

export type ContactInput = {
  name: string; // 1–80 caracteres tras trim
  email: string; // formato de correo válido, máx. 120
  message: string; // 10–2000 caracteres tras trim
};

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: ContactFieldErrors;
      values?: ContactInput;
    };

export type ContactValidation =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactFieldErrors };

// ---- Límites ----

export const NAME_MAX_LENGTH = 80;
export const EMAIL_MAX_LENGTH = 120;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 2000;

/** Campo trampa anti-spam: si llega con valor, no se envía nada. */
export const HONEYPOT_FIELD = "website";

// ---- Textos visibles ----

export const CONTACT_TEXTS = {
  nameRequired: "Escribe tu nombre.",
  nameTooLong: `El nombre no puede superar los ${NAME_MAX_LENGTH} caracteres.`,
  emailRequired: "Escribe tu correo.",
  emailInvalid: "Escribe un correo válido.",
  emailTooLong: `El correo no puede superar los ${EMAIL_MAX_LENGTH} caracteres.`,
  messageRequired: "Escribe tu mensaje.",
  messageTooShort: `El mensaje debe tener al menos ${MESSAGE_MIN_LENGTH} caracteres.`,
  messageTooLong: `El mensaje no puede superar los ${MESSAGE_MAX_LENGTH} caracteres.`,
  invalidForm: "Revisa los campos marcados.",
  genericError:
    "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.",
  success: "MENSAJE ENVIADO",
} as const;

// ---- Lectura y validación ----

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Valores tal como los escribió el visitante, para conservarlos si hay error. */
export function getContactValues(formData: FormData): ContactInput {
  return {
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    message: readField(formData, "message"),
  };
}

/** Valida el formulario. Devuelve los datos recortados o los errores por campo. */
export function validateContact(formData: FormData): ContactValidation {
  const raw = getContactValues(formData);
  const name = raw.name.trim();
  const email = raw.email.trim();
  const message = raw.message.trim();
  const errors: ContactFieldErrors = {};

  if (name.length === 0) errors.name = CONTACT_TEXTS.nameRequired;
  else if (name.length > NAME_MAX_LENGTH) errors.name = CONTACT_TEXTS.nameTooLong;

  if (email.length === 0) errors.email = CONTACT_TEXTS.emailRequired;
  else if (email.length > EMAIL_MAX_LENGTH)
    errors.email = CONTACT_TEXTS.emailTooLong;
  else if (!EMAIL_PATTERN.test(email)) errors.email = CONTACT_TEXTS.emailInvalid;

  if (message.length === 0) errors.message = CONTACT_TEXTS.messageRequired;
  else if (message.length < MESSAGE_MIN_LENGTH)
    errors.message = CONTACT_TEXTS.messageTooShort;
  else if (message.length > MESSAGE_MAX_LENGTH)
    errors.message = CONTACT_TEXTS.messageTooLong;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}
