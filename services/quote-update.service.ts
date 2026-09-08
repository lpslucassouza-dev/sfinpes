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

    const data =
      await buscarCotacao(
        asset.ticker
      );

      await prisma.asset.update({
        where: {
          id: asset.id,
        },
        data: {
          valorAtual:
            data.regularMarketPrice,

          ultimaAtualizacao:
            new Date(),
        },
      });

      //console.log(`${asset.ticker} atualizado para ${data.regularMarketPrice}`);

    } catch (error) {

      console.error(`Erro atualizando ${asset.ticker}`,error);

    }
  }
}