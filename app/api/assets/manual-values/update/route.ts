import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request
) {

  const body =
    await req.json();

    if (
      body.valorAtualManual === "" ||
      body.valorAtualManual === undefined ||
      body.valorAtualManual === null
    ) {

      return Response.json({
        success: false,
      });

    }

  await prisma.asset.update({

    where: {
      id: body.id,
    },

    data: {

      valorAtualManual:
        Number(
          body.valorAtualManual
        ),

      dataAtualizacaoManual:
        new Date(),

    },

  });

  return Response.json({
    success: true,
  });

}