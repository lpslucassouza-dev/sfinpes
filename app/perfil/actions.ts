"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function atualizarPerfil(
  nome: string,
  email: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  await prisma.usuario.update({
    where: {
      id: Number(session.user.id),
    },
    data: {
      nome,
      email,
    },
  });
}

export async function alterarMinhaSenha(
  senha: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const hash =
    await bcrypt.hash(
      senha,
      10
    );

  await prisma.usuario.update({
    where: {
      id: Number(session.user.id),
    },
    data: {
      senha: hash,
    },
  });
}