"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarCartao(
  nome: string,
  cashbackPercent: number
) {

  await prisma.cartao.create({
    data: {
      nome,
      cashbackPercent,
    },
  });

  revalidatePath("/cartoes");

  return {
    success: true,
  };
}

export async function atualizarCartao(
  id: number,
  nome: string,
  cashbackPercent: number
) {

  await prisma.cartao.update({
    where: {
      id,
    },

    data: {
      nome,
      cashbackPercent,
    },
  });

  revalidatePath("/cartoes");

  return {
    success: true,
  };
}

export async function alternarStatusCartao(
  id: number
) {

  const cartao =
    await prisma.cartao.findUnique({
      where: { id },
    });

  if (!cartao) return;

  await prisma.cartao.update({
    where: { id },

    data: {
      ativo: !cartao.ativo,
    },
  });

  revalidatePath("/cartoes");
}