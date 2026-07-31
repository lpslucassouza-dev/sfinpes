"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { excluirCompra } from "@/app/compras/actions";
import { useRouter } from "next/navigation";

type Props = {
  compraId: number;
  descricao: string;
};

export default function ModalExcluirCompra({
  compraId,
  descricao,
}: Props) {
  const router = useRouter();

  async function handleExcluir() {
    await excluirCompra(compraId);

    router.refresh();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="
            px-2
            py-1
            rounded-lg
            border
            hover:bg-red-50
          "
        >
          🗑️
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
            className="text-xl font-bold mb-4"
          >
            Excluir Compra
          </Dialog.Title>

          <p className="mb-6 text-slate-600">
            Deseja excluir a compra:

            <br />

            <strong>
              {descricao}
            </strong>

            ?

            <br /><br />

            Todas as parcelas serão removidas.
          </p>

          <div className="flex justify-end gap-3">

            <Dialog.Close asChild>
              <button
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                "
              >
                Cancelar
              </button>
            </Dialog.Close>

            <button
              onClick={handleExcluir}
              className="
                px-4
                py-2
                rounded-lg
                bg-red-600
                text-white
                hover:bg-red-700
              "
            >
              Excluir
            </button>

          </div>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}