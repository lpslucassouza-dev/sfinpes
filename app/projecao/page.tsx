import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default async function ProjecaoPage() {

  const parcelas = await prisma.parcela.findMany({
    orderBy: [
      {
        competenciaAno: "asc",
      },
      {
        competenciaMes: "asc",
      },
    ],
  });

  const mapa = new Map<string, number>();

  parcelas.forEach((parcela) => {

    const chave =
      `${parcela.competenciaAno}-${parcela.competenciaMes}`;

    mapa.set(
      chave,
      (mapa.get(chave) ?? 0) +
        Number(parcela.valorParcela)
    );
  });

  const projecao =
    Array.from(mapa.entries())
      .map(([chave, valor]) => {

        const [ano, mes] =
          chave.split("-");

        return {
          ano: Number(ano),
          mes: Number(mes),
          valor,
        };
      });

  return (
    <main className="max-w-6xl mx-auto p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Projeção Futura
        </h1>

        <p className="text-slate-600 mt-1">
          Comprometimento financeiro dos próximos meses
        </p>
      </div>

      <div className="space-y-4">

        {projecao.map((item) => (

          <div
            key={`${item.ano}-${item.mes}`}
            className="
              bg-white
              rounded-xl
              border
              border-slate-200
              shadow-sm
              p-5
              flex
              justify-between
              items-center
            "
          >

            <div>

              <div className="font-semibold text-lg">
                {meses[item.mes - 1]}
              </div>

              <div className="text-sm text-slate-500">
                {item.ano}
              </div>

            </div>

            <div className="text-2xl font-bold">
              {formatCurrency(item.valor)}
            </div>

          </div>

        ))}

      </div>

    </main>
  );
}