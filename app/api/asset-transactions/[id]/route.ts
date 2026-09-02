import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await req.json();

  const quantidade = parseFloat(
        String(body.quantidade).replace(",", ".")
        );

  const valorUnitario = parseFloat(
        String(body.valorUnitario).replace(",", ".")
        );

  const valorTotal =
        quantidade * valorUnitario;

  const transaction = await prisma.assetTransaction.update({
    where: {
      id,
    },
    data: {
        assetId: body.assetId,
        tipoOperacao: body.tipoOperacao,
        dataOperacao: new Date(body.dataOperacao),

        quantidade,
        valorUnitario,
        valorTotal,
    },
    include: {
      asset: true,
    },
  });

  return NextResponse.json(transaction);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.assetTransaction.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}