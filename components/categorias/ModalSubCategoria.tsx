"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { criarSubCategoria } from "@/app/categorias/actions";
import { useRouter } from "next/navigation";

type Props = {
  categoriaId: number;
  categoriaNome: string;
};

export default function ModalSubCategoria({
  categoriaId,
  categoriaNome,
}: Props) {

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [nome, setNome] =
    useState("");

  async function handleSalvar() {

    if (!nome.trim()) return;

    await criarSubCategoria(
      categoriaId,
      nome
    );

    setNome("");

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
            text-sm
            bg-blue-100
            text-blue-700
            px-3
            py-1
            rounded-lg
          "
        >
          + SubCategoria
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
            className="font-bold text-lg mb-4"
          >
            Nova SubCategoria
          </Dialog.Title>

          <p className="mb-4 text-slate-500">
            Categoria: {categoriaNome}
          </p>

          <input
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            placeholder="Nome da subcategoria"
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
              bg-green-600
              text-white
              p-2
              rounded-lg
            "
          >
            Salvar
          </button>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}