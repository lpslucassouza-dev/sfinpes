"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      className="
        w-full
        bg-red-600
        hover:bg-red-700
        text-white
        rounded-lg
        py-2
      "
    >
      Sair
    </button>
  );
}