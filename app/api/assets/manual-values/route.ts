import { prisma } from "@/lib/prisma";

export async function GET() {

  const assets =
    await prisma.asset.findMany({

      where: {

        tipo: {

          in: [

            "CRIPTO",

            "TESOURO_DIRETO",

            "PREV_PRIVADA",

            "FUNDO_INVESTIMENTO",

          ],

        },

      },

      orderBy: {
        ticker: "asc",
      },

    });

  return Response.json(assets);

}