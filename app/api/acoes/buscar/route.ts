import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {

    const body =
      await request.json();

    const response = await fetch(
        `https://brapi.dev/api/quote/${body.ticker}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.BRAPI_TOKEN}`,
                },
        }
    );

    const result =
      await response.json();

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao buscar ticker",
      },
      {
        status: 500,
      }
    );

  }
}