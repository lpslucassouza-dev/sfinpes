"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  atualizarPerfil,
} from "@/app/perfil/actions";

type Props = {
  nome: string;
  email: string;
};

export default function ModalEditarPerfil({
  nome,
  email,
}: Props) {

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [nomeAtual, setNomeAtual] =
    useState(nome);

  const [emailAtual, setEmailAtual] =
    useState(email);

  async function handleSalvar() {

    await atualizarPerfil(
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

        <button
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Editar Perfil
        </button>

      </Dialog.Trigger>

      <Dialog.Portal>

        <Dialog.Overlay
          className="
            fixed
            inset-0
            bg-black/50
          "
        />

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

          <Dialog.Title
            className="
              text-lg
              font-bold
              mb-4
            "
          >
            Editar Perfil
          </Dialog.Title>

          <div className="space-y-4">

            <input
              value={nomeAtual}
              onChange={(e) =>
                setNomeAtual(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                p-2
              "
            />

            <input
              value={emailAtual}
              onChange={(e) =>
                setEmailAtual(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                p-2
              "
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