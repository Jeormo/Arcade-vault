"use server";

import { Resend } from "resend";
import {
  CONTACT_TEXTS,
  HONEYPOT_FIELD,
  getContactValues,
  validateContact,
  type ContactState,
} from "@/lib/contact";

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: un bot lo rellena. Fingimos éxito sin enviar nada.
  const trap = formData.get(HONEYPOT_FIELD);
  if (typeof trap === "string" && trap.trim() !== "") {
    return { status: "success" };
  }

  const values = getContactValues(formData);
  const result = validateContact(formData);
  if (!result.ok) {
    return {
      status: "error",
      message: CONTACT_TEXTS.invalidForm,
      fieldErrors: result.errors,
      values,
    };
  }

  const genericError: ContactState = {
    status: "error",
    message: CONTACT_TEXTS.genericError,
    values,
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !to && "CONTACT_TO_EMAIL",
      !from && "CONTACT_FROM_EMAIL",
    ].filter(Boolean);
    console.error(
      `[contacto] Faltan variables de entorno: ${missing.join(", ")}`,
    );
    return genericError;
  }

  const { name, email, message } = result.data;
  // Sin saltos de línea en el asunto: evita inyección de cabeceras.
  const subject = `Contacto web · ${name.replace(/[\r\n]+/g, " ")}`;
  const text = `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}\n`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });
    if (error) {
      console.error("[contacto] Resend devolvió un error:", error);
      return genericError;
    }
  } catch (err) {
    console.error("[contacto] Fallo al llamar a Resend:", err);
    return genericError;
  }

  return { status: "success" };
}
