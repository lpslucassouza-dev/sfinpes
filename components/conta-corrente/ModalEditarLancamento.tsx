"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useForm, } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { atualizarLancamento } from "@/app/conta-corrente/actions";

type Props = {
  lancamento: any;

  categorias: {
    id: number;
    nome: string;

    subCategorias: {
      id: number;
      nome: string;
    }[];
  }[];
};

export default function ModalEditarLancamento({
  lancamento,
  categorias,
}: Props) {

  const [open, setOpen] =
    useState(false);

  const {
        register,
        handleSubmit,
        watch,
        } = useForm({
        defaultValues: {

            data:
            new Date(
                lancamento.data
            )
                .toISOString()
                .split("T")[0],

            modalidade:
            lancamento.modalidade,

            categoriaId:
            String(
                lancamento.categoriaId
            ),

            subCategoriaId:
            String(
                lancamento.subCategoriaId ?? ""
            ),

            descricao:
            lancamento.descricao,

            valorPlanejado:
            Number(
                lancamento.valorPlanejado
            ),

            valorRealizado:
            Number(
                lancamento.valorRealizado
            ),
        },
    });

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

      await atualizarLancamento(
        lancamento.id,
        {
            ...data,

            valorPlanejado:
            Number(
                data.valorPlanejado
            ),

            valorRealizado:
            Number(
                data.valorRealizado
            ),
        }
        );

      toast.success(
        "Lançamento atualizado."
      );

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
    px-3
    py-2
    text-sm
  `;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >

      <Dialog.Trigger asChild>

        <button
            className="
                text-blue-600
                hover:text-blue-800
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
            rounded-2xl
            p-6
            w-full
            max-w-2xl
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
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
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
          </div>
          
          <div className="grid grid-cols-2 gap-3">
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
          </div>


            <input
              placeholder="Descrição"
              {...register(
                "descricao"
              )}
              className={inputClass}
            />

          <div className="grid grid-cols-2 gap-3">
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
          </div>

            <div className="flex justify-center">

              <button
                type="submit"
                className="
                  w-48
                  rounded-lg
                  bg-emerald-600
                  py-3
                  font-medium
                  text-white
                  hover:bg-emerald-700
                "
              >
                Salvar
              </button>

            </div>

          </form>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}