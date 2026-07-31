"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarCompra } from "@/app/compras/actions";

type Props = {
    
  compraId: number;

  descricao: string;

  usuarioId: number;

  categoriaId: number;

  subCategoriaId: number | null;

  usuarios: {
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

export default function ModalEditarCompra({
  compraId,
  descricao,
  usuarioId,
  categoriaId,
  subCategoriaId,
  usuarios,
  categorias,
}: Props) {

    const [open, setOpen] = useState(false);

    const router = useRouter();

    const [descricaoAtual, setDescricaoAtual] =
    useState(descricao);

    const [usuarioAtual, setUsuarioAtual] =
    useState(usuarioId);

    const [categoriaAtual, setCategoriaAtual] =
    useState(categoriaId);

    const [subCategoriaAtual, setSubCategoriaAtual] =
    useState<number | null>(
        subCategoriaId
    );

    const categoriaSelecionada =
    categorias.find(
        (categoria) =>
        categoria.id === categoriaAtual
    );

    async function handleSalvar() {

        await atualizarCompra(
            compraId,
            {
            descricao: descricaoAtual,
            usuarioId: usuarioAtual,
            categoriaId: categoriaAtual,
            subCategoriaId:
                subCategoriaAtual,
            }
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
            px-2
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
            className="text-xl font-bold"
          >
            Editar Compra
          </Dialog.Title>

          <div className="space-y-4 mt-4">

            <div>
                <label className="block text-sm mb-1">
                Descrição
                </label>

                <input
                value={descricaoAtual}
                onChange={(e) =>
                    setDescricaoAtual(
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
            </div>

            <div>
                <label className="block text-sm mb-1">
                Usuário
                </label>

                <select
                value={usuarioAtual}
                onChange={(e) =>
                    setUsuarioAtual(
                    Number(
                        e.target.value
                    )
                    )
                }
                className="
                    w-full
                    border
                    rounded-lg
                    p-2
                "
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
                <label className="block text-sm mb-1">
                Categoria
                </label>

                <select
                value={categoriaAtual}
                onChange={(e) =>
                    setCategoriaAtual(
                    Number(
                        e.target.value
                    )
                    )
                }
                className="
                    w-full
                    border
                    rounded-lg
                    p-2
                "
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
                <label className="block text-sm mb-1">
                SubCategoria
                </label>

                <select
                value={
                    subCategoriaAtual ?? ""
                }
                onChange={(e) =>
                    setSubCategoriaAtual(
                    e.target.value
                        ? Number(
                            e.target.value
                        )
                        : null
                    )
                }
                className="
                    w-full
                    border
                    rounded-lg
                    p-2
                "
                >
                <option value="">
                    Selecione
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

            <button
                onClick={handleSalvar}
                className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
                p-2
                "
            >
                Salvar Alterações
            </button>

            </div>

        </Dialog.Content>

      </Dialog.Portal>

    </Dialog.Root>
  );
}