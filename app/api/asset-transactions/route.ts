import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const transactions = await prisma.assetTransaction.findMany({
    include: {
      asset: true,
    },
    orderBy: {
      dataOperacao: "desc",
    },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const body = await req.json();
  
  const quantidade = parseFloat(
      String(body.quantidade).replace(",", ".")
      );

  const valorUnitario = parseFloat(
      String(body.valorUnitario).replace(",", ".")
      );

  const valorTotal =
      quantidade * valorUnitario;

  if (
  body.tipoOperacao === "VENDA"
) {

  const compras =
    await prisma.assetTransaction.findMany({
      where: {
        assetId: body.assetId,
      },
    });

  let saldo = 0;

  compras.forEach((tx) => {

    if (tx.tipoOperacao === "COMPRA") {
      saldo += tx.quantidade;
    }

    if (tx.tipoOperacao === "VENDA") {
      saldo -= tx.quantidade;
    }
  });

  if (
    Number(body.quantidade) > saldo
  ) {
    return Response.json(
      {
        error:
          "Quantidade maior que posição atual",
      },
      {
        status: 400,
      }
    );
  }
}

  const transaction = await prisma.assetTransaction.create({
          
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