import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

function excelDateToJSDate(
  excelDate: number
) {

  return new Date(
    (excelDate - 25569) *
      86400 *
      1000
  );

}

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
        error: "Arquivo não enviado",
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

  const assets =
    await prisma.asset.findMany();

  let importados = 0;

  for (const row of rows) {

    const asset =
      assets.find(
        (a) =>
          a.ticker ===
          row["ticker"]
      );

    if (!asset) {
      continue;
    }

    await prisma.assetIncome.create({

      data: {

        assetId:
          asset.id,

        tipoRendimento:
          row["tp_dy"],

        dataRecebimento:
          excelDateToJSDate(
            Number(row["data"])
          ),

        quantidadeCotas:
          Number(
            row["qtd_cota"]
          ),

        valorUnitario:
          Number(
            row["vl_unit"]
          ),

        valorTotal:
          Number(
            row["vl_total"]
          ),

        dy:
          Number(
            row["DY"]
          )*100,

      },

    });

    importados++;

  }

  return Response.json({
    importados,
  });

}