"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarCartao } from "@/app/cartoes/actions";

type Props = {
  id: number;
  nome: string;
  cashbackPercent: number;
};

export default function ModalEditarCartao({
  id,
  nome,
  cashbackPercent,
}: Props) {

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [nomeAtual, setNomeAtual] =
    useState(nome);

  const [cashbackAtual, setCashbackAtual] =
    useState(
      cashbackPercent.toString()
    );

  async function handleSalvar() {

    await atualizarCartao(
      id,
      nomeAtual,
      Number(cashbackAtual)
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
            px-3
            py-1
            rounded-lg
            border
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
              text-xl
              font-bold
              mb-4
            "
          >
            Editar Cartão
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
              type="number"
              step="0.01"
              value={cashbackAtual}
              onChange={(e) =>
                setCashbackAtual(
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
                bg-blue-600
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