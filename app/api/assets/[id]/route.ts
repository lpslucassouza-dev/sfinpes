import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await req.json();

  const asset = await prisma.asset.update({
    where: {
      id,
    },
    data: {
      ticker: body.ticker,
      nome: body.nome,
      tipo: body.tipo,
      ativo: body.ativo,
      setor: body.setor,
      segmento: body.segmento,
      valorAtual: body.valorAtual,
      ultimaAtualizacao: body.ultimaAtualizacao
        ? new Date(body.ultimaAtualizacao)
        : null,
    },
  });

  return Response.json(asset);
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  await prisma.asset.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}