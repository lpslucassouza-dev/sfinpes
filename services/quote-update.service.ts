import { prisma } from "@/lib/prisma";
import { buscarCotacao } from "./brapi.service";

export async function atualizarCotacoes() {

  const assets = await prisma.asset.findMany({
    where: {
      ativo: true,
    },
  });

for (const asset of assets) {

  try {

    const agora = new Date();

    const ultimaAtualizacao =
      asset.ultimaAtualizacao;

    if (ultimaAtualizacao) {

      const diferencaHoras =
        (
          agora.getTime() -
          ultimaAtualizacao.getTime()
        ) /
        (1000 * 60 * 60);

      if (diferencaHoras < 12) {

        console.log(
          `${asset.ticker} já atualizado. ${agora.getTime()}`
        );

        continue;
      }
    }

    const data =
      await buscarCotacao(
        asset.ticker
      );

    } catch (error) {

      console.error(
        `Erro atualizando ${asset.ticker}`,
        error
      );

    }
  }
}