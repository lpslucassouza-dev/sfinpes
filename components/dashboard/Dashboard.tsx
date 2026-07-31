import { prisma } from "@/lib/prisma";
import CardsResumo from "@/components/compras/CardsResumo";
import { calcularResumo } from "@/lib/dashboard";

export default async function Dashboard() {

  const hoje = new Date();

  const mes = hoje.getMonth() + 1;

  const ano = hoje.getFullYear();

  const parcelas = await prisma.parcela.findMany({
    where: {
      competenciaMes: mes,
      competenciaAno: ano,
    },

    include: {
      compra: {
        include: {
          cartao: true,
          usuario: true,
          categoria: true,
        },
      },
    },
  });

  const resumo =
    calcularResumo(parcelas);

  return (
    <main className="max-w-screen-2xl mx-auto p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Visão geral das despesas
        </p>
      </div>

      <CardsResumo
        totalMes={resumo.totalMes}
        cashbackMes={resumo.cashbackMes}
        iniciando={resumo.iniciando}
        encerrando={resumo.encerrando}
      />

    </main>
  );
}