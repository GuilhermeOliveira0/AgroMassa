"use client";

import { signOut } from "next-auth/react";

export function AdminSignOutButton() {
  return (
    <button
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border bg-white px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      type="button"
    >
      Sair
    </button>
  );
}
