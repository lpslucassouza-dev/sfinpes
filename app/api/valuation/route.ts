import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    //console.log(body);
    //console.log("ROUTE EXECUTADA");

    const valuation =
      await prisma.valuation.create({
        data: {
          ticker: body.ticker,

          precoAtual:
            body.precoAtual,

          precoJusto:
            body.precoJusto,

          upsideDownside:
            body.upsideDownside,

          totalAcoes:
            BigInt(body.totalAcoes),

          payout:
            body.payout,

          roe:
            body.roe,

          taxaDesconto:
            body.taxaDesconto,

          taxaDescontoPerpetua:
            body.taxaDescontoPerpetua,

          crescimentoPerpetuo:
            body.crescimentoPerpetuo,

          marketCapProjetado:
            body.marketCapProjetado,
        },
      });

    return NextResponse.json({
      ...valuation,
      totalAcoes:
        valuation.totalAcoes.toString(),
    });    

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao salvar valuation",
      },
      {
        status: 500,
      }
    );

  }

}