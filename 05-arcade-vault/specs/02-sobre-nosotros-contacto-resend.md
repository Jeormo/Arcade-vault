# SPEC 02 — Página «Sobre nosotros» con formulario de contacto por Resend

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-11-15
> **Objective:** Recrear en Next.js/React/Tailwind la página «Sobre nosotros» del prototipo `refereces/arcade-vault-retro-portal-Sobre-nosotros/project/Arcade Vault Sobre Nosotros.dc.html`, y añadir un formulario de contacto cuyo mensaje se envía por correo con Resend mediante una Server Action.

## Por qué existe este spec

El portal no tiene página que explique qué es Arcade Vault ni forma de contactar con el equipo. El prototipo trae la página, pero su botón «CONTACTAR» es solo un `mailto:hola@arcadevault.com`: **no existe ningún formulario en el diseño**. Este spec convierte ese botón en un formulario real con envío por Resend. Como el diseño no lo cubre, el formulario se diseña aquí con el estilo neón de la página.

## Alcance

**Dentro:**

- Ruta **`/sobre-nosotros`** dentro del grupo `(portal)` (con la barra de navegación), con estas secciones, textos literales del prototipo:
  - Hero: etiqueta «SOBRE NOSOTROS», título con parpadeo `flicker` («SALVAMOS LAS RECREATIVAS DEL OLVIDO») y párrafo de presentación.
  - «01 · NUESTRA HISTORIA — DE LA SALA AL NAVEGADOR», en dos columnas (una en móvil).
  - «02 · LO QUE NOS MUEVE — NUESTRAS REGLAS DEL JUEGO», con tres tarjetas (▶ cian, ♥ magenta, ★ amarillo) con elevación en `:hover`.
  - «03 · EL EQUIPO — HECHO POR JUGADORES».
  - Bloque final «¿LISTO PARA EL SIGUIENTE NIVEL?» con borde amarillo y dos botones: «CREAR CUENTA» (pulso amarillo) y «CONTACTAR».
  - Línea final parpadeante «GAME OVER? NUNCA. · ARCADE VAULT».
- Entrada **«Sobre nosotros»** en las secciones de `components/nav-bar.tsx`, en escritorio y en el menú lateral móvil, con estado activo.
- «CREAR CUENTA» enlaza a `/acceso?tab=registro` y `components/auth-form.tsx` abre la pestaña «Crear cuenta» cuando recibe ese valor.
- «CONTACTAR» hace scroll a una sección propia **`#contacto`**, justo debajo del bloque final, con un formulario de **nombre, correo y mensaje**.
- Envío con **Resend** desde una **Server Action**: validación en servidor, campo trampa anti-spam (honeypot), `reply-to` con el correo del visitante, estados Enviando / Enviado / Error.
- Configuración por variables de entorno y archivo `.env.example`.
- Diseño responsive (móvil, tablet y escritorio) y estados `:hover`, `:active` y `:focus-visible` del prototipo.

**Fuera de alcance (para otros specs):**

- Copia o confirmación del correo al visitante: solo se envía un correo, al equipo.
- Dominio propio verificado en Resend y remitente `hola@arcadevault.com`.
- Límite de envíos por IP o CAPTCHA. Solo hay honeypot.
- Guardar los mensajes en base de datos o en una bandeja dentro de la app.
- Correo de bienvenida al crear cuenta y cualquier otro correo transaccional (el registro sigue siendo simulado).
- Plantillas HTML de correo con React Email: el correo va en texto plano.
- Barra de navegación propia del prototipo (solo «Inicio» y «Sobre nosotros»): se usa la `NavBar` del portal.
- Internacionalización, tests automatizados y cambios en la página de Inicio.

## Modelo de datos

No se introduce persistencia. Estructuras nuevas, en `lib/`, con nombres de campo en inglés y textos visibles en español.

```ts
// lib/contact.ts
export type ContactInput = {
  name: string;     // 1–80 caracteres tras trim
  email: string;    // formato de correo válido, máx. 120
  message: string;  // 10–2000 caracteres tras trim
};

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: ContactFieldErrors; values?: ContactInput };
```

Convenciones:

- `validateContact(formData)` vive en `lib/contact.ts`, es función pura y devuelve `ContactInput` o `ContactFieldErrors`. El cliente no valida por su cuenta: la única fuente de verdad es el servidor, y el formulario usa los atributos HTML (`required`, `maxLength`, `type="email"`) solo como ayuda.
- Campo honeypot: `website`, oculto de forma accesible (fuera de pantalla, `tabIndex={-1}`, `aria-hidden`, `autoComplete="off"`). Si llega con valor, la acción devuelve `success` sin enviar nada.
- Variables de entorno (solo servidor, nunca `NEXT_PUBLIC_`):
  - `RESEND_API_KEY`
  - `CONTACT_TO_EMAIL`: destinatario (la bandeja del equipo).
  - `CONTACT_FROM_EMAIL`: remitente. En pruebas, `Arcade Vault <onboarding@resend.dev>`.
- Contenido del correo: asunto `Contacto web · {name}` con saltos de línea eliminados; cuerpo en texto plano (`text`), sin HTML, con nombre, correo y mensaje. `replyTo` es el correo del visitante.
- Textos de error y éxito en español, con las constantes en `lib/contact.ts`.

## Plan de implementación

Antes del paso 1, leer en `node_modules/next/dist/docs/` las guías `server-actions.md`, `forms.md` y `environment-variables.md` (exigido por `AGENTS.md`). El proyecto tiene `cacheComponents` activo: lo que lea `searchParams` debe ir en un límite `Suspense`.

1. **Dependencia y entorno.** Instalar `resend`. Crear `.env.example` con las tres variables vacías y añadir `!.env.example` a `.gitignore` (hoy la regla `.env*` también lo ignora), de modo que `.env.local` siga ignorado y `.env.example` quede versionado. Verificación: `npm run lint` sin errores y `git status` no muestra ningún `.env.local`.
2. **Validación.** Crear `lib/contact.ts` con los tipos, los límites, los textos y `validateContact`. Verificación: `npm run lint` sin errores.
3. **Server Action.** Crear `app/(portal)/sobre-nosotros/actions.ts` con `"use server"` y `sendContact(prev, formData): Promise<ContactState>`: comprueba el honeypot, valida, comprueba que existan las tres variables, envía con Resend (`from`, `to`, `replyTo`, `subject`, `text`) y mapea el resultado. Los fallos de Resend y las variables ausentes se registran en el servidor y devuelven el mensaje genérico «No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.» sin exponer detalles. Verificación: con claves de prueba, un envío válido llega a la bandeja de `CONTACT_TO_EMAIL`.
4. **Página estática.** Crear `app/(portal)/sobre-nosotros/page.tsx` con metadata («Sobre nosotros · Arcade Vault») y las secciones del prototipo, sin formulario todavía. «CONTACTAR» enlaza a `#contacto`; «CREAR CUENTA» a `/acceso?tab=registro`. Verificación: `/sobre-nosotros` renderiza las cinco secciones y la línea final.
5. **Navegación.** Añadir «Sobre nosotros» a `SECTIONS` en `components/nav-bar.tsx` con `isActive` por prefijo `/sobre-nosotros`. El corte entre barra de escritorio y menú lateral pasa de 760 px a 1040 px, porque con cuatro enlaces la barra no cabe en una línea por debajo de ese ancho. Verificación: aparece en escritorio y en el menú móvil, subrayada en su ruta.
6. **Pestaña inicial en Acceso.** Hacer que `app/(portal)/acceso/page.tsx` lea `searchParams.tab` dentro de `Suspense` y pase `initialTab` (`"login" | "register"`, por defecto `"login"`) a `AuthForm`. Verificación: `/acceso?tab=registro` abre «Crear cuenta»; `/acceso` abre «Iniciar sesión».
7. **Formulario de contacto.** Crear `components/contact-form.tsx` (cliente, `useActionState` con `sendContact`) y montarlo en la sección `#contacto`. Incluye errores por campo con `aria-describedby`, botón «ENVIAR MENSAJE» desactivado y con texto «ENVIANDO…» mientras dura el envío, mensaje «MENSAJE ENVIADO» al terminar con éxito (y formulario vaciado), y conservación de los valores cuando hay error. Verificación: los tres estados se ven y se alcanzan con teclado.
8. **Pulido responsive y accesibilidad.** Revisar móvil, tablet y escritorio; `prefers-reduced-motion` desactiva `flicker`, `blink` y el pulso del botón; `scroll-margin-top` para que la barra sticky no tape `#contacto`; `aria-live="polite"` en el resultado. Verificación: `npm run lint` y `npm run build` terminan sin errores.

## Criterios de aceptación

- [ ] `npm run lint` y `npm run build` terminan con código 0.
- [ ] `/sobre-nosotros` carga sin errores en la consola ni avisos de hidratación, con la barra de navegación del portal.
- [ ] La página contiene los textos literales del prototipo en las cinco secciones y la línea final «GAME OVER? NUNCA. · ARCADE VAULT».
- [ ] «Sobre nosotros» aparece en la barra (escritorio) y en el menú lateral (< 1040 px; el corte sube desde 760 px porque cuatro enlaces no caben en una línea por debajo de ese ancho), y está marcada como activa en `/sobre-nosotros`.
- [ ] «CREAR CUENTA» lleva a `/acceso?tab=registro` con la pestaña «Crear cuenta» abierta; `/acceso` sin parámetro sigue abriendo «Iniciar sesión».
- [ ] «CONTACTAR» desplaza a `#contacto` y la barra sticky no tapa el título de la sección.
- [ ] Enviar el formulario vacío muestra errores bajo los tres campos y no llama a Resend.
- [ ] Un correo con formato inválido, un nombre de más de 80 caracteres o un mensaje de menos de 10 o más de 2000 caracteres muestran su error y conservan lo escrito.
- [ ] Un envío válido con claves correctas llega a `CONTACT_TO_EMAIL`, con `reply-to` igual al correo del visitante, asunto `Contacto web · {nombre}` y cuerpo en texto plano.
- [ ] Tras un envío correcto aparece «MENSAJE ENVIADO» y los campos quedan vacíos.
- [ ] Mientras se envía, el botón muestra «ENVIANDO…» y no admite un segundo clic.
- [ ] Con una `RESEND_API_KEY` inválida o sin alguna de las tres variables, el usuario ve el mensaje genérico de error, el detalle solo aparece en el log del servidor y los valores escritos se conservan.
- [ ] Con el campo `website` relleno la acción devuelve éxito y no se envía ningún correo.
- [ ] Un nombre con saltos de línea no inyecta cabeceras: el asunto llega en una sola línea.
- [ ] `RESEND_API_KEY` no aparece en el bundle del cliente ni en ningún archivo versionado; `.env.example` sí está versionado y `.env.local` no.
- [ ] `prefers-reduced-motion` desactiva el parpadeo del título, el de la línea final y el pulso de «CREAR CUENTA».
- [ ] Ningún archivo importa o copia `refereces/`.

## Decisiones tomadas y descartadas

- **Sí:** formulario de contacto propio. El prototipo solo tiene `mailto:`, pero el requisito es enviar con Resend; un `mailto:` no pasa por ningún servidor.
- **No:** mantener `mailto:` como alternativa. Dos vías de contacto confunden y no se podrían probar igual.
- **Sí:** Server Action con `useActionState`. Es el mecanismo de formularios de este Next.js, mantiene la clave de API en el servidor y evita un endpoint propio.
- **No:** Route Handler `/api/contacto`. Más código (fetch, serialización, estados manuales) sin beneficio aquí.
- **Sí:** validación solo en servidor, con los atributos HTML como ayuda. Una única fuente de verdad; la validación del cliente nunca es de fiar.
- **Sí:** sección propia con ancla `#contacto` en vez de modal. Sin gestión de foco, funciona sin JS y es enlazable.
- **Sí:** remitente y destinatario por variables de entorno. En pruebas funciona con `onboarding@resend.dev`; pasar a dominio propio es cambiar una variable.
- **No:** dominio verificado ahora. Requiere DNS fuera del repositorio; queda para cuando exista el dominio.
- **Sí:** correo en texto plano. Elimina el riesgo de inyección de HTML con el contenido del visitante.
- **Sí:** `reply-to` del visitante. Permite al equipo responder directamente.
- **No:** copia de confirmación al visitante. Duplica envíos, gasta cuota y abre la puerta a usar el formulario para enviar correo a terceros.
- **Sí:** honeypot como única defensa anti-spam por ahora. Barato y sin dependencias; el límite por IP o CAPTCHA tiene su propio spec si hace falta.
- **Sí:** error genérico al usuario y detalle en log. No se filtra información de Resend ni de la configuración.
- **Sí:** reutilizar `NavBar`, fondo y scanlines del portal en lugar de la barra del prototipo. Es coherente con el resto de pantallas; la página gana un tercer enlace.
- **Sí:** `/acceso?tab=registro` modifica `auth-form.tsx` (spec 01). Cambio mínimo: una prop opcional con valor por defecto.

## Riesgos identificados

| Riesgo                                                                                         | Mitigación                                                                                                       |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Este Next.js (16, `cacheComponents`) cambia APIs; `searchParams` exige `Suspense`              | Leer las guías de `node_modules/next/dist/docs/` antes de escribir; `searchParams` solo dentro de `Suspense`.    |
| Spam o abuso del formulario (consume cuota de Resend y llena la bandeja)                       | Honeypot, límites de longitud y validación en servidor. Límite por IP o CAPTCHA queda para otro spec.            |
| Con `onboarding@resend.dev`, Resend solo entrega al correo propietario de la cuenta            | Usar como `CONTACT_TO_EMAIL` el correo de la cuenta de Resend en pruebas; verificar dominio antes de producción. |
| Fuga de la clave de API                                                                        | Variable sin prefijo `NEXT_PUBLIC_`, uso solo en `actions.ts`, `.env.local` ignorado por git.                     |
| Inyección de cabeceras o HTML con los campos del visitante                                     | Asunto sin saltos de línea, cuerpo en texto plano, `replyTo` solo tras validar el correo.                        |
| No hay test runner: el envío real solo se comprueba a mano                                     | Criterios de aceptación con un envío real de prueba; `validateContact` es pura y queda lista para tests futuros. |
| El prototipo no diseña el formulario: riesgo de estilo ajeno al resto de la página             | Reutilizar los tokens y el estilo de `auth-form.tsx` (bordes neón, `font-arcade`, foco amarillo).                |

## Qué **no** está en este spec

- Correo de confirmación al visitante ni correo de bienvenida al registrarse.
- Dominio propio verificado y remitente `hola@arcadevault.com`.
- CAPTCHA, límite de envíos o panel de mensajes.
- Plantillas HTML de correo (React Email).
- Almacenamiento de mensajes en base de datos.
- Cambios en la página de Inicio o en la Biblioteca.
- Tests automatizados.

Cada uno de estos puntos, si se aborda, va en su propio spec.
