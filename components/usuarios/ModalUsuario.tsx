"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

import { criarUsuario }
  from "@/app/usuarios/actions";

export default function ModalUsuario() {

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  async function handleSalvar() {

    await criarUsuario(
      nome,
      email,
      senha
    );

    setOpen(false);

    router.refresh();
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >

      <Dialog.Trigger asChild>

        <button
          className="
            bg-blue-700
            text-white
            px-4
            py-2
            rounded-xl
          "
        >
          + Usuário
        </button>

      </Dialog.Trigger>

      <Dialog.Portal>

        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            bg-white
            rounded-2xl
            p-6
            w-full
            max-w-md
          "
        >

          <Dialog.Title className="font-bold text-lg mb-4">
            Novo Usuário
          </Dialog.Title>

          <div className="space-y-4">

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              placeholder="E-mail"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />

            <button
              onClick={handleSalvar}
              className="
                w-full
                bg-green-600
                text-white
                rounded-lg
                p-2
              "
            >
              Salvar
            </button>

          </div>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}