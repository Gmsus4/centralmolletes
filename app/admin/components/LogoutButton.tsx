"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login?success=true" })}
      className="
        text-[10px] uppercase tracking-[0.25em] font-medium
        text-stone-700 hover:text-stone-800
        border-b border-stone-300 hover:border-stone-800
        pb-px transition-colors duration-200
        cursor-pointer
      "
    >
      Cerrar sesión
    </button>
  )
}