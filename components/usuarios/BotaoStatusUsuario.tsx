"use client";

import { useRouter } from "next/navigation";

import {
  alternarStatusUsuario,
} from "@/app/usuarios/actions";

type Props = {
  id: number;
  ativo: boolean;
  desabilitado?: boolean;
};

export default function BotaoStatusUsuario({
  id,
  ativo,
  desabilitado,
}: Props) {
  const router = useRouter();

  async function handleClick() {
    await alternarStatusUsuario(id);

    router.refresh();
  }

  return (
    <button
      disabled={desabilitado}
      onClick={handleClick}
      className={`
        px-3
        py-1
        rounded-lg
        text-white

        ${
          desabilitado
            ? "bg-slate-400 cursor-not-allowed"
            : ativo
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }
      `}
    >
      {ativo
        ? "Inativar"
        : "Ativar"}
    </button>
  );
}