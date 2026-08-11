"use client";

import { Trash2 } from "lucide-react";
import { excluirLancamento } from "@/app/conta-corrente/actions";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
};

export default function BotaoExcluirLancamento({
  id,
}: Props) {

  const router = useRouter();

  async function handleExcluir() {

    const confirmar =
      window.confirm(
        "Deseja realmente excluir este lançamento?"
      );

    if (!confirmar) {
      return;
    }

    await excluirLancamento(id);

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
      <Trash2 size={18} />
    </button>
  );
}