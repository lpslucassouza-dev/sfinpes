"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarUsuario(
  nome: string,
  email: string,
  senha: string
) {

  const senhaHash =
    await bcrypt.hash(
      senha,
      10
    );

  await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
    },
  });

  revalidatePath("/usuarios");
}

export async function atualizarUsuario(
  id: number,
  nome: string,
  email: string
) {
  await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      nome,
      email,
    },
  });

  revalidatePath("/usuarios");
}

export async function alternarStatusUsuario(
  id: number
) {
  const usuario =
    await prisma.usuario.findUnique({
      where: {
        id,
      },
    });

  if (!usuario) return;

  await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      ativo: !usuario.ativo,
    },
  });

  revalidatePath("/usuarios");
}

export async function alterarSenhaUsuario(
  id: number,
  senha: string
) {

  const hash =
    await bcrypt.hash(
      senha,
      10
    );

  await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      senha: hash,
    },
  });

  revalidatePath("/usuarios");
}
