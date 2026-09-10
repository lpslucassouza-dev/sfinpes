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

  const rows =
    XLSX.utils.sheet_to_json(
      sheet
    );

  const preview = [];

  const ativosBanco =
    await prisma.asset.findMany();

  for (
    let i = 0;
    i < Math.min(rows.length, 20);
    i++
  ) {

    const row: any = rows[i];

    const ativo =
      ativosBanco.find(
        (a) =>
          a.ticker ===
          row["ATIVO"]
      );

    preview.push({

      ticker:
        row["ATIVO"],

      operacao:
        row["Operação"],

      data:
        row["DATA"],

      quantidade:
        row["qtd compra"],

      valorUnitario:
        row["valor unid"],

      valorTotal:
        row["Total Compra"],

      ativoExiste:
        !!ativo,

    });
  }

  return Response.json({

    totalRegistros:
      rows.length,

    preview,

  });
}