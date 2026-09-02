import { prisma } from "@/lib/prisma";
import { calcularPosicao } from "@/services/service";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  const asset = await prisma.asset.findUnique({
    where: {
      id,
    },
    include: {
      transactions: {
        orderBy: {
          dataOperacao: "asc",
        },
      },
    },
  });

  if (!asset) {
    return Response.json(
      { error: "Ativo não encontrado" },
      { status: 404 }
    );
  }

  const historico = asset.transactions.map(
    (tx) => ({
      ...tx,
      posicao: calcularPosicao(
        asset.transactions,
        tx.id
      ),
    })
  );

  const ultimaPosicao =
    historico.length > 0
      ? historico[historico.length - 1]
      : null;

  return Response.json({
    asset,

    resumo: {
      totalCotas:
        ultimaPosicao?.posicao.totalCotas ?? 0,

      precoMedio:
        ultimaPosicao?.posicao.precoMedio ?? 0,

      totalInvestido:
        (
          (ultimaPosicao?.posicao.totalCotas ??
            0) *
          (ultimaPosicao?.posicao.precoMedio ??
            0)
        ).toFixed(2),
    },

    ultimasTransacoes:
      [...historico]
        .reverse()
        .slice(0, 3),

    historico: historico.reverse(),
  });
}