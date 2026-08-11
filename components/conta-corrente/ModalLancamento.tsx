"use client";

import * as Dialog from "@radix-ui/react-dialog";

import {
  useForm,
} from "react-hook-form";

import { useState } from "react";

import { toast } from "sonner";

import { X } from "lucide-react";

import { criarLancamento }
  from "@/app/conta-corrente/actions";

type Props = {
  categorias: {
    id: number;
    nome: string;

    subCategorias: {
      id: number;
      nome: string;
    }[];
  }[];
};

export default function ModalLancamento({
  categorias,
}: Props) {

  const [open, setOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const categoriaId =
    Number(
      watch("categoriaId")
    );

  const categoriaSelecionada =
    categorias.find(
      (c) =>
        c.id === categoriaId
    );

  async function onSubmit(
    data: any
  ) {
    try {

      await criarLancamento({
        ...data,

        valorPlanejado:
          Number(
            data.valorPlanejado
          ),

        valorRealizado:
          Number(
            data.valorRealizado
          ),
      });

      toast.success(
        "Lançamento criado."
      );

      reset();

      setOpen(false);

    } catch {

      toast.error(
        "Erro ao criar lançamento."
      );
    }
  }

  const inputClass = `
    w-full
    border
    rounded-lg
    p-2
  `;

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
          + Novo Lançamento
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
            max-w-3xl
          "
        >

          <div className="flex justify-between mb-4">

            <Dialog.Title
              className="
                text-xl
                font-bold
              "
            >
              Novo Lançamento
            </Dialog.Title>

            <Dialog.Close asChild>
              <button>
                <X size={20} />
              </button>
            </Dialog.Close>

          </div>

          <form
            onSubmit={
              handleSubmit(
                onSubmit
              )
            }
            className="space-y-4"
          >

            <input
              type="date"
              {...register("data")}
              className={inputClass}
            />

            <select
              {...register(
                "modalidade"
              )}
              className={inputClass}
            >
              <option value="RECEITA">
                Receita
              </option>

              <option value="DESPESA">
                Despesa
              </option>

              <option value="INVESTIMENTO">
                Investimento
              </option>

            </select>

            <select
              {...register(
                "categoriaId"
              )}
              className={inputClass}
            >
              <option value="">
                Categoria
              </option>

              {categorias.map(
                (categoria) => (
                  <option
                    key={
                      categoria.id
                    }
                    value={
                      categoria.id
                    }
                  >
                    {categoria.nome}
                  </option>
                )
              )}
            </select>

            <select
              {...register(
                "subCategoriaId"
              )}
              className={inputClass}
            >
              <option value="">
                SubCategoria
              </option>

              {categoriaSelecionada?.subCategorias.map(
                (
                  subCategoria
                ) => (
                  <option
                    key={
                      subCategoria.id
                    }
                    value={
                      subCategoria.id
                    }
                  >
                    {
                      subCategoria.nome
                    }
                  </option>
                )
              )}
            </select>

            <input
              placeholder="Descrição"
              {...register(
                "descricao"
              )}
              className={inputClass}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Valor Planejado"
              {...register(
                "valorPlanejado"
              )}
              className={inputClass}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Valor Realizado"
              {...register(
                "valorRealizado"
              )}
              className={inputClass}
            />

            <button
              type="submit"
              className="
                w-full
                bg-emerald-600
                text-white
                py-3
                rounded-lg
              "
            >
              Salvar
            </button>

          </form>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}