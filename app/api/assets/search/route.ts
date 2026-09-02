import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        {
          error: "Ticker obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `https://brapi.dev/api/quote/${ticker}?token=${process.env.BRAPI_TOKEN}`
    );

    const data = await response.json();

    if (!data.results?.length) {
      return NextResponse.json(
        {
          error: "Ativo não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const asset = data.results[0];

    return NextResponse.json({
      ticker: asset.symbol,

      nome:
        asset.longName ||
        asset.shortName ||
        "",

      valorAtual:
        asset.regularMarketPrice || 0,

      setor:
        asset.sector || null,

      segmento:
        asset.segment || null,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao consultar BRAPI",
      },
      {
        status: 500,
      }
    );
  }
}