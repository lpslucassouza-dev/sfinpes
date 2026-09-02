import { prisma } from "@/lib/prisma";

export async function GET() {

  const transactions =
    await prisma.assetTransaction.findMany({
      include: {
        asset: true,
      },
      orderBy: {
        dataOperacao: "asc",
      },
    });

  let totalComprado = 0;
  let totalVendido = 0;

  const tipos: Record<
    string,
    {
      compras: number;
      vendas: number;
    }
  > = {};

  const meses: Record<
    string,
    {
      compras: number;
      vendas: number;
    }
  > = {};

  for (const tx of transactions) {

    const valor = tx.valorTotal;

    if (tx.tipoOperacao === "COMPRA") {
      totalComprado += valor;
    }

    if (tx.tipoOperacao === "VENDA") {
      totalVendido += valor;
    }

    const tipo = tx.asset.tipo;

    if (!tipos[tipo]) {
      tipos[tipo] = {
        compras: 0,
        vendas: 0,
      };
    }

    if (tx.tipoOperacao === "COMPRA") {
      tipos[tipo].compras += valor;
    }

    if (tx.tipoOperacao === "VENDA") {
      tipos[tipo].vendas += valor;
    }

    const data = new Date(tx.dataOperacao);

    const chaveMes = `${String(
      data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`;

    if (!meses[chaveMes]) {
      meses[chaveMes] = {
        compras: 0,
        vendas: 0,
      };
    }

    if (tx.tipoOperacao === "COMPRA") {
      meses[chaveMes].compras += valor;
    }

    if (tx.tipoOperacao === "VENDA") {
      meses[chaveMes].vendas += valor;
    }
  }

  return Response.json({
    cards: {
      totalComprado,
      totalVendido,
      patrimonioAtual:
        totalComprado - totalVendido,
    },

    tipos: Object.entries(tipos).map(
      ([tipo, valores]) => ({
        tipo,
        ...valores,
      })
    ),

    meses: Object.entries(meses).map(
      ([mes, valores]) => ({
        mes,
        ...valores,
      })
    ),
  });
}