"use client";

import * as Dialog from "@radix-ui/react-dialog";

type Parcela = {
  id: number;
  numeroParcela: number;
  totalParcelas: number;
  competenciaMes: number;
  competenciaAno: number;
  valorParcela: number;
};

type Props = {
  descricao: string;
  parcelas: Parcela[];
};

export default function ModalParcelas({
  descricao,
  parcelas,
}: Props) {
  return (
    <Dialog.Root>

      <Dialog.Trigger asChild>
        <button
          className="
            px-2
            py-1
            rounded-lg
            border
            hover:bg-slate-100
          "
        >
          📋
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
            w-full
            max-w-lg
            rounded-xl
            bg-white
            p-6
            shadow-xl
          "
        >
          <Dialog.Title
            className="text-xl font-bold mb-4"
          >
            {descricao}
          </Dialog.Title>

          <div className="space-y-2">

            {parcelas
              .sort(
                (a, b) =>
                  a.numeroParcela -
                  b.numeroParcela
              )
              .map((parcela) => (

                <div
                  key={parcela.id}
                  className="
                    flex
                    justify-between
                    border
                    rounded-lg
                    p-3
                  "
                >

                  <span>
                    {String(
                      parcela.competenciaMes
                    ).padStart(2, "0")}
                    /
                    {parcela.competenciaAno}
                  </span>

                  <span>
                    (
                    {String(
                      parcela.numeroParcela
                    ).padStart(2, "0")}
                    /
                    {String(
                      parcela.totalParcelas
                    ).padStart(2, "0")}
                    )
                  </span>

                  <span>
                    R$ {Number(
                      parcela.valorParcela
                    ).toLocaleString(
                      "pt-BR",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>

                </div>

              ))}

          </div>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}
