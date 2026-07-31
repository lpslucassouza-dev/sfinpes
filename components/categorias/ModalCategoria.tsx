"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { criarCategoria } from "@/app/categorias/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ModalCategoria() {

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [nome, setNome] = useState("");

  async function handleSalvar() {

    if (!nome.trim()) {
      return;
    }

    await criarCategoria(nome);

    toast.success(
      "Categoria criada com sucesso."
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
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          + Nova Categoria
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
              text-xl
              font-bold
              mb-4
            "
          >
            Nova Categoria
          </Dialog.Title>

          <div className="space-y-4">

            <input
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              placeholder="Nome da categoria"
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
                hover:bg-green-700
                text-white
                p-2
                rounded-lg
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