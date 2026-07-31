"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarSubCategoria } from "@/app/categorias/actions";

type Props = {
  id: number;
  nome: string;
};

export default function ModalEditarCategoria({
  id,
  nome,
}: Props) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [nomeAtual, setNomeAtual] =
    useState(nome);

  async function handleSalvar() {
    await atualizarSubCategoria(
      id,
      nomeAtual
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
            border
            px-3
            py-1
            rounded-lg
            hover:bg-slate-100
          "
        >
          ✏️
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
            rounded-xl
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
            Editar SubCategoria
          </Dialog.Title>

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
              mb-4
            "
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}