"use client";

import { useSession } from "@/components/session-provider";
import { GUEST_NAME } from "@/lib/session";

/** «Jugando como NOMBRE» o «Jugarás como INVITADO», según la sesión. */
export function PlayingAs() {
  const { user } = useSession();
  return (
    <span className="text-sm text-dim">
      {user ? `Jugando como ${user.name}` : `Jugarás como ${GUEST_NAME}`}
    </span>
  );
}
