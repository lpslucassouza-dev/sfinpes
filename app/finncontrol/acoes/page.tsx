import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ValuationTable from "@/components/acoes/ValuationTable";

export default async function AcoesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const valuations = await prisma.valuation.findMany();

  const ativos = await prisma.asset.findMany({
    where: {
      tipo: "ACAO",
    },
  });

  const ativosMap = new Map(
    ativos.map((ativo) => [ativo.ticker, ativo])
  );

  const ranking = valuations.map((valuation) => {
    const ativo = ativosMap.get(valuation.ticker);

    const precoAtual = Number(ativo?.valorAtual ?? 0);

    const precoJusto = Number(
      valuation.precoJusto ?? 0
    );

    const upside =
      precoAtual > 0
        ? ((precoJusto - precoAtual) /
            precoAtual) *
          100
        : 0;

    return {
      ...valuation,
      precoAtual,
      upside,
    };
  });

  const rankingOrdenado = ranking.sort(
    (a, b) => b.upside - a.upside
  );

  return (
    
    <main className="p-8">
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1 className="text-3xl font-bold">
            Ações
          </h1>

          <p className="text-slate-600">
            Ranking de valuations
          </p>
        </div>

        <Link
          href="/finncontrol/acoes/novo"
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
            hover:bg-blue-700
          "
        >
          + Novo Valuation
        </Link>
      </div>

      <ValuationTable
        valuations={rankingOrdenado}
      />
    </main>
  );
}