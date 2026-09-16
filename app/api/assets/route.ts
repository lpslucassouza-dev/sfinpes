import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const assets = await prisma.asset.findMany({
    orderBy: {
      ticker: "asc",
    },
  });

  return NextResponse.json(assets);
}

export async function POST(req: Request) {
  const body = await req.json();

  //console.log(body);

  const asset = await prisma.asset.create({
    data: {
      ticker: body.ticker.toUpperCase(),
      nome: body.nome,
      tipo: body.tipo,
      ativo: body.ativo,
      setor: body.setor,
      goal: body.goal,
      segmento: body.segmento,
      valorAtual: body.valorAtual,
      ultimaAtualizacao: body.ultimaAtualizacao
        ? new Date(body.ultimaAtualizacao)
        : null,
    },
  });

  return NextResponse.json(asset);
}