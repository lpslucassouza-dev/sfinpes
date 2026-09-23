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

    console.log(rows[0]);

    const assets =
        await prisma.asset.findMany();

    const preview = [];

    for (
        let i = 0;
        i < Math.min(rows.length, 20);
        i++
    ) {

        const row = rows[i];

        const ativo =
        assets.find(
            (a) =>
            a.ticker === row["ticker"]
        );

        preview.push({

        ticker:
            row["ticker"],

        tipoRendimento:
            row["tp_dy"],

        data:
            row["data"],

        quantidadeCotas:
            row["qtd_cota"],

        dy:
            row["DY"],

        valorTotal:
            row["vl_total"],

        valorUnitario:
            row["vl_unit"],

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