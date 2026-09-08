import { prisma } from "@/lib/prisma";

import {
  calcularDadosRendimento,
} from "@/services/income.service";

export async function GET() {

  const rendimentos =
    await prisma.assetIncome.findMany({

      include: {
        asset: true,
      },

      orderBy: {
        dataRecebimento: "desc",
      },

    });

  return Response.json(
    rendimentos
  );
}

export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const valorTotal =
    parseFloat(
      String(body.valorTotal)
        .replace(",", ".")
    );

  const dados =
    await calcularDadosRendimento(
      body.assetId,
      valorTotal
    );

  const rendimento =
    await prisma.assetIncome.create({

      data: {

        asset: {
          connect: {
            id: body.assetId,
          },
        },

        tipoRendimento:
          body.tipoRendimento,

        dataRecebimento:
          new Date(
            body.dataRecebimento
          ),

        quantidadeCotas:
          dados.quantidadeCotas,

        valorUnitario:
          dados.valorUnitario,

        valorTotal,

        dy:
          dados.dy,
      },

      include: {
        asset: true,
      },
    });

  return Response.json(
    rendimento
  );
}