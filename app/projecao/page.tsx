import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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

  const session = await auth();
  
    if (!session) {
      redirect("/login");
    }
  
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

  const compras = await prisma.compra.findMany();

  const mapa = new Map<string, number>();
  const valoresEncerrando = new Map<string, number>();

  compras.forEach((compra) => {

    const dataFinal =
      new Date(
        compra.competenciaAno,
        compra.competenciaMes - 1 +
          (compra.totalParcelas - 1),
        1
      );

    const chave =
      `${dataFinal.getFullYear()}-${
        dataFinal.getMonth() + 1
      }`;

    const valorParcela =
      Number(compra.valorTotal) /
      compra.totalParcelas;

    valoresEncerrando.set(
      chave,
      (valoresEncerrando.get(chave) ?? 0) +
        valorParcela
    );

  });

  parcelas.forEach((parcela) => {

    const chave =
      `${parcela.competenciaAno}-${parcela.competenciaMes}`;

    mapa.set(
      chave,
      (mapa.get(chave) ?? 0) +
        Number(parcela.valorParcela)
    );
  });

  const hoje = new Date();

  const anoAtual =
    hoje.getFullYear();

  const mesAtual =
    hoje.getMonth() + 1;

  const projecao =
    Array.from(mapa.entries())
      .map(([chave, valor]) => {

        const [ano, mes] =
          chave.split("-");

        return {
          ano: Number(ano),
          mes: Number(mes),
          valor,
          valorEncerrando: valoresEncerrando.get(chave) ?? 0,
        };


      })
      .filter((item) => {

        if (item.ano > anoAtual) {
          return true;
        }

        if (
          item.ano === anoAtual &&
          item.mes >= mesAtual
        ) {
          return true;
        }

        return false;

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

              {item.valorEncerrando > 0 && (

                <div className="text-sm text-emerald-600 font-medium">

                  Redução prevista no mês seguinte:
                  {" "}
                  {formatCurrency(
                    item.valorEncerrando
                  )}

                </div>

              )}

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