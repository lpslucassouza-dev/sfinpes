"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarCartao } from "@/app/cartoes/actions";

export default function ModalCartao() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [nome, setNome] = useState("");

  const [cashback, setCashback] = useState("");

  async function handleSalvar() {
    if (!nome.trim()) {
      return;
    }

    await criarCartao(
      nome,
      Number(cashback || 0)
    );

    setNome("");
    setCashback("");

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
          + Novo Cartão
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
            Novo Cartão
          </Dialog.Title>

          <div className="space-y-4">

            <div>
              <label className="block mb-1 text-sm">
                Nome do Cartão
              </label>

              <input
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-2
                "
                placeholder="Ex.: XP"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">
                Cashback (%)
              </label>

              <input
                type="number"
                step="0.01"
                value={cashback}
                onChange={(e) =>
                  setCashback(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-2
                "
                placeholder="1.20"
              />
            </div>

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