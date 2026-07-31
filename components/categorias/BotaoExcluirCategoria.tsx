"use client";

import { excluirCategoria } from "@/app/categorias/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  categoriaId: number;
};

export default function BotaoExcluirCategoria({
  categoriaId,
}: Props) {
  const router = useRouter();

  async function handleExcluir() {
    const confirma = confirm(
      "Deseja realmente excluir esta categoria?"
    );

    if (!confirma) return;

    const resultado =
      await excluirCategoria(categoriaId);

    if (!resultado.success) {
      toast.error(
        resultado.message
      );
      
      return;
    }
   
    toast.success(
      "Categoria excluída."
    );

    router.refresh();
  }

  return (
    <button
      onClick={handleExcluir}
      className="
        text-red-600
        border
        border-red-200
        px-3
        py-1
        rounded-lg
        hover:bg-red-50
      "
    >
      🗑 Excluir
    </button>
  );
}