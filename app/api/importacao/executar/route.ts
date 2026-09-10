import * as XLSX from "xlsx";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request
) {

  const formData =
    await req.formData();

  const file =
    formData.get("file") as File;

  if (!file) {

    return Response.json(
      {
        error:
          "Arquivo não enviado",
      },
      {
        status: 400,
      }
    );

  }

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  const workbook =
    XLSX.read(buffer, {
      type: "buffer",
    });

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows: any[] =
    XLSX.utils.sheet_to_json(
      sheet
    );

  let importados = 0;

  const assets =
    await prisma.asset.findMany();

  for (const row of rows) {

    const ticker =
      row["ATIVO"];

    if (!ticker) {
      continue;
    }

    const asset =
      assets.find(
        (a) =>
          a.ticker === ticker
      );

    if (!asset) {
      continue;
    }

    const operacao =
      String(
        row["Operação"]
      ).toUpperCase();

    const quantidade =
      Math.abs(
        Number(
          row["qtd compra"]
        )
      );

    const valorUnitario =
      Number(
        row["valor unid"]
      );

    const valorTotal =
      Math.abs(
        Number(
          row["Total Compra"]
        )
      );

    if (
      isNaN(quantidade) ||
      quantidade === 0
    ) {
      continue;
    }

    const tipoOperacao =
      operacao === "VENDA"
        ? "VENDA"
        : "COMPRA";

    const data =
      new Date(
        row["DATA"]
      );

    await prisma.assetTransaction.create({

      data: {

        assetId:
          asset.id,

        tipoOperacao,

        dataOperacao:
          data,

        quantidade,

        valorUnitario,

        valorTotal,

      },

    });

    importados++;

  }

  return Response.json({

    importados,

  });

}
