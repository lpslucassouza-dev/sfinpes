import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-4
      "
    >
      <div
        className="
          text-sm
          text-slate-500
        "
      >
        {title}
      </div>

      <div
        className="
          mt-2
          text-xl
          font-semibold
        "
      >
        {value}
      </div>
    </div>
  );
}

export default async function
ValuationDetailsPage({
  params,
}: Props) {

  const { id } = await params;

  const valuation =
    await prisma.valuation.findUnique({
      where: {
        id,
      },
    });

  if (!valuation) {
    return (
      <div className="p-8">
        Valuation não encontrado.
      </div>
    );
  }

  return (
    <main className="p-8">

      <div className="mb-6">
        <Link href="/acoes"
              className="
                rounded-md
                border
                px-4
                py-2
                text-sm
                hover:bg-slate-100
                "
              >
                ← Voltar
            </Link>
      </div>

      <div
        className="
          mb-3
          rounded-xl
          bg-white
          p-3
          shadow-sm
        "
      >
        <h1 className="text-2xl font-bold">
          {valuation.ticker}
        </h1>

        <div
          className={
            valuation.upsideDownside >= 0
              ? "mt-4 text-4xl font-bold text-green-600"
              : "mt-4 text-4xl font-bold text-red-600"
          }
        >
          {valuation.upsideDownside > 0
            ? "+"
            : ""}
          {valuation.upsideDownside.toFixed(2)}%
        </div>

        <div className="text-sm text-slate-500">
          Potencial de valorização
        </div>
      </div>

      <div
          className="
            mb-3
            grid
            grid-cols-4
            gap-2
          "
        >
          <Card
            title="Preço Atual"
            value={Number(
              valuation.precoAtual
            ).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}
          />

          <Card
            title="Preço Justo"
            value={Number(
              valuation.precoJusto
            ).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}
          />

          <Card
            title="Upside"
            value={`${valuation.upsideDownside.toFixed(
              2
            )}%`}
          />

          <Card
            title="Market Cap Projetado"
            value={Number(
              valuation.marketCapProjetado
            ).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              }
            )}
          />
        </div>

        <div
          className="
            rounded-xl
            bg-white
            p-3
            shadow-sm
          "
        >
          <h2
            className="
              mb-2
              text-lg
              font-semibold
            "
          >
            Premissas Utilizadas
          </h2>

          <div
            className="
              grid
              grid-cols-3
              gap-2
            "
          >
            <Card
              title="Payout"
              value={`${valuation.payout}%`}
            />

            <Card
              title="ROE"
              value={`${valuation.roe}%`}
            />

            <Card
              title="Taxa de Desconto"
              value={`${valuation.taxaDesconto}%`}
            />

            <Card
              title="Taxa Desconto Perpétua"
              value={`${valuation.taxaDescontoPerpetua}%`}
            />

            <Card
              title="Crescimento Perpétuo"
              value={`${valuation.crescimentoPerpetuo}%`}
            />

            <Card
              title="Data do Cálculo"
              value={new Date(
                valuation.createdAt
              ).toLocaleDateString(
                "pt-BR"
              )}
            />
          </div>
        </div>
    </main>
  );
}