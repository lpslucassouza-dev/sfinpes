"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  atualizarUsuario,
} from "@/app/usuarios/actions";

type Props = {
  id: number;
  nome: string;
  email: string | null;
};

export default function ModalEditarUsuario({
  id,
  nome,
  email,
}: Props) {

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [nomeAtual, setNomeAtual] =
    useState(nome);

  const [emailAtual, setEmailAtual] =
    useState(email ?? "");

  async function handleSalvar() {

    await atualizarUsuario(
      id,
      nomeAtual,
      emailAtual
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
        <button className="border px-3 py-1 rounded-lg">
          ✏️
        </button>
      </Dialog.Trigger>

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
        <div className="space-y-4">

          <input
            value={nomeAtual}
            onChange={(e) =>
              setNomeAtual(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-2"
          />

          <input
            value={emailAtual}
            onChange={(e) =>
              setEmailAtual(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-2"
          />

          <button
            onClick={handleSalvar}
            className="
              w-full
              bg-blue-600
              text-white
              rounded-lg
              p-2
            "
          >
            Salvar
          </button>

        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}