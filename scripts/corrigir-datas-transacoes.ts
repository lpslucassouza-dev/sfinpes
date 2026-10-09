import { prisma } from "@/lib/prisma";

async function main() {

  const transacoes =
    await prisma.assetTransaction.findMany();

  for (const tx of transacoes) {

    const novaData =
      new Date(tx.dataOperacao);

    novaData.setDate(
      novaData.getDate() + 1
    );

    {/*
    console.log(
        tx.id,
        tx.valorUnitario,
        tx.valorTotal,
        tx.quantidade,
        tx.dataOperacao,
        "=>",
        novaData
    );
    */}

    
        await prisma.assetTransaction.update({
        where: {
            id: tx.id,
        },
        data: {
            dataOperacao: novaData,
        },
        });

  }

  console.log(
    `${transacoes.length} registros atualizados`
  );

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());