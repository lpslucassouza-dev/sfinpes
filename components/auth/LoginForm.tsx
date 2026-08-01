"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [erro, setErro] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setErro("");

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/compras",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-8
        w-full
        max-w-md
      "
    >

      <h1
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        SFinPes
      </h1>

      <div className="space-y-4">

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        />

        {erro && (
          <p className="text-red-600">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="
            w-full
            bg-blue-700
            text-white
            rounded-lg
            p-3
          "
        >
          Entrar
        </button>

      </div>

    </form>
  );
}