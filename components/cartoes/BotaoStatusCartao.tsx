"use client";

import { useRouter } from "next/navigation";
import { alternarStatusCartao }
  from "@/app/cartoes/actions";

type Props = {
  id: number;
  ativo: boolean;
};

export default function BotaoStatusCartao({
  id,
  ativo,
}: Props) {

  const router = useRouter();

  async function handleClick() {

    await alternarStatusCartao(id);

    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className={`
        mt-4
        px-4
        py-2
        rounded-lg
        text-white
        ${
          ativo
            ? "bg-red-600"
            : "bg-green-600"
        }
      `}
    >
      {ativo
        ? "Inativar"
        : "Ativar"}
    </button>
  );
}