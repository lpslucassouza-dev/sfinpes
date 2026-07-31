"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarCategoria(
  nome: string
) {
  await prisma.categoria.create({
    data: {
      nome,
    },
  });

  revalidatePath("/categorias");

  return {
    success: true,
  };
}

export async function criarSubCategoria(
  categoriaId: number,
  nome: string
) {
  await prisma.subCategoria.create({
    data: {
      categoriaId,
      nome,
    },
  });

  revalidatePath("/categorias");

  return {
    success: true,
  };
}

export async function excluirCategoria(
  categoriaId: number
) {
  try {

    await prisma.categoria.delete({
      where: {
        id: categoriaId,
      },
    });

    revalidatePath("/categorias");

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Existem compras vinculadas a esta categoria.",
    };

  }
}


export async function excluirSubCategoria(
  subCategoriaId: number
) {
  try {

    await prisma.subCategoria.delete({
      where: {
        id: subCategoriaId,
      },
    });

    revalidatePath("/categorias");

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Existem compras vinculadas a esta subcategoria.",
    };

  }
}

export async function atualizarCategoria(
  id: number,
  nome: string
) {
  await prisma.categoria.update({
    where: {
      id,
    },

    data: {
      nome,
    },
  });

  revalidatePath("/categorias");

  return {
    success: true,
  };
}

export async function atualizarSubCategoria(
  id: number,
  nome: string
) {
  await prisma.subCategoria.update({
    where: {
      id,
    },

    data: {
      nome,
    },
  });

  revalidatePath("/categorias");

  return {
    success: true,
  };
}



