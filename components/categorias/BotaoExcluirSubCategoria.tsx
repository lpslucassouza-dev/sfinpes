"use client";

import { excluirSubCategoria } from "@/app/categorias/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  subCategoriaId: number;
};

export default function BotaoExcluirSubCategoria({
  subCategoriaId,
}: Props) {
  const router = useRouter();

  async function handleExcluir() {
    const confirma = confirm(
      "Deseja realmente excluir esta subcategoria?"
    );

    if (!confirma) return;

    const resultado =
      await excluirSubCategoria(
        subCategoriaId
      );

    if (!resultado.success) {
      toast.error(
        resultado.message
      );
      return;
    }

    toast.success(
      "SubCategoria excluída."
    );

    router.refresh();
  }

  return (
    <button
      onClick={handleExcluir}
      className="
        text-red-600
        hover:text-red-800
      "
    >
      🗑
    </button>
  );
}