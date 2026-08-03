"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { gerarParcelas } from "@/lib/parcelas";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { criarCompra } from "@/app/compras/actions";
import { useState } from "react";
import { toast } from "sonner";

type CompraModalProps = {
  
  usuarios: {
    id: number;
    nome: string;
  }[];

  cartoes: {
    id: number;
    nome: string;
  }[];

  categorias: {
    id: number;
    nome: string;

    subCategorias: {
      id: number;
      nome: string;
    }[];
  }[];
};

type FormData = {
  dataCompra: string;
  competencia: string;

  usuarioId: string;
  cartaoId: string;

  categoriaId: string;
  subCategoriaId: string;

  descricao: string;

  valorTotal: number;

  totalParcelas: number;
};

export default function CompraModal({
  
usuarios,
  cartoes,
  categorias,
}: CompraModalProps) {

  const hoje = new Date();

  const competenciaAtual = `${hoje.getFullYear()}-${String(
    hoje.getMonth() + 1
  ).padStart(2, "0")}`;

  const { register, watch, handleSubmit } = useForm<FormData>({
    defaultValues: {
      competencia: competenciaAtual,
      totalParcelas: 1,
    },
  });

  const categoriaSelecionadaId = Number(watch("categoriaId"));

  const categoriaSelecionada =
    categorias.find(
      (categoria) =>
        categoria.id ===
        categoriaSelecionadaId
  );


  const [open, setOpen] = useState(false);

  const competencia = watch("competencia");

  const valorTotal = Number(watch("valorTotal")) || 0;

  const totalParcelas = Number(watch("totalParcelas")) || 1;

  const parcelas = useMemo(() => {
    return gerarParcelas(
      competencia,
      valorTotal,
      totalParcelas
    );
  }, [
    competencia,
    valorTotal,
    totalParcelas,
  ]);

  const inputClass = `
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          py-2
          text-slate-900
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          `;

  async function onSubmit(data: FormData) {
    try {
      await criarCompra(data);

      toast.success(
        "Compra cadastrada com sucesso."
      );  

      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Erro ao salvar compra."
      ); 
    }
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
            hover:bg-blue-700
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
            w-full
            max-w-4xl
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-8
            shadow-2xl
            max-h-[90vh]
            overflow-y-auto
          "
        >
          <div className="flex justify-between items-center mb-6">
            
              <div>
                <Dialog.Title className="text-2xl font-bold text-slate-900">
                  Nova Compra
                </Dialog.Title>

                <p className="text-sm text-slate-500 mt-1">
                  Cadastre uma nova compra parcelada ou à vista.
                </p>
              </div>
            

            <Dialog.Close asChild>
              <button>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >

            {/* Linha 1 */}

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Data da Compra
                </label>

                <input
                  type="date"
                  {...register("dataCompra")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Competência
                </label>

                <input
                  type="month"
                  {...register("competencia")}
                  className={inputClass}
                />
              </div>

            </div>

            {/* Linha 2 */}

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Usuário
                </label>

                <select
                  {...register("usuarioId")}
                  className={inputClass}
                >
                  {usuarios.map((usuario) => (
                    <option
                      key={usuario.id}
                      value={usuario.id}
                    >
                      {usuario.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Cartão
                </label>

                <select
                  {...register("cartaoId")}
                  className={inputClass}
                >
                  {cartoes.map((cartao) => (
                    <option
                      key={cartao.id}
                      value={cartao.id}
                    >
                      {cartao.nome}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Linha 3 */}

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Categoria
                </label>

                <select
                  {...register("categoriaId")}
                  className={inputClass}
                >
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Subcategoria
                </label>

                <select
                  {...register("subCategoriaId")}
                  className={inputClass}
                >

                  <option value="">
                    Selecione uma subcategoria
                  </option>

                  {categoriaSelecionada?.subCategorias.map(
                    (subCategoria) => (
                      <option
                        key={subCategoria.id}
                        value={subCategoria.id}
                      >
                        {subCategoria.nome}
                      </option>
                    )
                  )}

                </select>
              </div>

            </div>

            {/* Linha 4 */}

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Descrição
              </label>

              <input
                type="text"
                {...register("descricao")}
                className={inputClass}
                placeholder="Ex.: Notebook Dell"
              />
            </div>

            {/* Linha 5 */}

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Valor Total
                </label>

                <input
                  type="number"
                  step="0.01"
                  {...register("valorTotal")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Parcelas
                </label>

                <input
                  type="number"
                  min="1"
                  max="36"
                  {...register("totalParcelas")}
                  className={inputClass}
                />
              </div>

            </div>

            {/* Preview */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <h3 className="font-semibold text-slate-800 mb-4">
                Prévia das Parcelas
              </h3>

              <div className="space-y-2 max-h-44 overflow-y-auto">

                {parcelas.map((parcela) => (
                  <div
                    key={parcela.numeroParcela}
                    className="
                      flex
                      justify-between
                      rounded-lg
                      bg-slate-50
                      px-3
                      py-2
                      text-sm
                    "
                  >
                    <span>
                      {String(parcela.competenciaMes).padStart(2, "0")}
                      /
                      {parcela.competenciaAno}
                    </span>

                    <span>
                      (
                      {String(parcela.numeroParcela).padStart(2, "0")}
                      /
                      {String(parcela.totalParcelas).padStart(2, "0")}
                      )
                    </span>

                    <span>
                      R$ {parcela.valorParcela.toFixed(2)}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            <button
              type="submit"
              className="
                w-full
                rounded-lg
                bg-emerald-600
                py-3
                font-medium
                text-white
                hover:bg-emerald-700
              "
            >
              Salvar Compra
            </button>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}