import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModalLancamento from "@/components/conta-corrente/ModalLancamento";
import ModalEditarLancamento from "@/components/conta-corrente/ModalEditarLancamento";
import BotaoExcluirLancamento from "@/components/conta-corrente/BotaoExcluirLancamento";
import FiltrosContaCorrente
  from "@/components/conta-corrente/FiltrosContaCorrente";

export default async function ContaCorrentePage({
  searchParams,
}: {
  searchParams: Promise<{
    mes?: string;
    ano?: string;
  }>;
}) {

  const session = await auth();

  const params = await searchParams;

  const hoje = new Date();

  const mes =
    Number(params.mes) ||
    hoje.getMonth() + 1;

  const ano =
    Number(params.ano) ||
    hoje.getFullYear();

  if (!session) {
    redirect("/login");
  }

  const categorias =
    await prisma.categoria.findMany({
      where: {
        OR: [
          {
            tipo:
              "CONTA_CORRENTE",
          },
          {
            tipo: "AMBOS",
          },
        ],
      },

      include: {
        subCategorias: {
          where: {
            ativo: true,
          },
        },
      },

      orderBy: {
        nome: "asc",
      },
    });

  const lancamentos =
    await prisma.lancamentoContaCorrente.findMany({
      where: {
        data: {
          gte: new Date(
            ano,
            mes - 1,
            1
          ),

          lt: new Date(
            ano,
            mes,
            1
          ),
        },
      },

      include: {
        categoria: true,
        subCategoria: true,
      },

      orderBy: {
        data: "asc",
      },
    });

    const saldoPlanejado =
      lancamentos.reduce(
        (acc, item) => {

          const valor =
            Number(
              item.valorPlanejado
            );

          if (
            item.modalidade ===
            "RECEITA"
          ) {
            return acc + valor;
          }

          return acc - valor;

        },
        0
      );

    const saldoAtual =
      lancamentos.reduce(
        (acc, item) => {

          const valor =
            Number(
              item.valorRealizado
            );

          if (
            item.modalidade ===
            "RECEITA"
          ) {
            return acc + valor;
          }

          return acc - valor;

        },
        0
      );

  const receitas = lancamentos.filter(
    (lancamento) =>
      lancamento.modalidade === "RECEITA"
  );

  const despesas = lancamentos.filter(
    (lancamento) =>
      lancamento.modalidade === "DESPESA"
  );

  const investimentos = lancamentos.filter(
    (lancamento) =>
      lancamento.modalidade === "INVESTIMENTO"
  );

  const totalReceitas =
      receitas.reduce(
        (acc, item) =>
          acc +
          Number(
            item.valorRealizado
          ),
        0
      );
  
  const totalSaidas =
    [...despesas, ...investimentos]
      .reduce(
        (acc, item) =>
          acc +
          Number(item.valorRealizado),
        0
      );  
  
  const percentualEconomia =
    totalReceitas > 0
      ? (
          ((totalReceitas - totalSaidas) /
            totalReceitas) *
          100
        )
      : 0;


  return (
    <main className="p-8">

      <div
        className="
          flex
          justify-between
          items-start
          mb-6
        "
      >
        <div>
          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Conta Corrente
          </h1>

          <p
            className="
              text-slate-600
              mt-1
            "
          >
            Controle financeiro da conta corrente
          </p>
        </div>

        <ModalLancamento
          categorias={categorias}
        />
      </div>
      <div className="mb-6">
        <FiltrosContaCorrente
          mes={mes}
          ano={ano}
        />
      </div>

        <div
          className="
            grid
            grid-cols-4
            gap-4
            mb-8
          "
        >
        
        <div
            className="
              bg-green-600
              text-white
              rounded-xl
              p-4
            "
          >
            <div>
              Receitas
            </div>

          <div
            className="
              text-3xl
              font-bold
              mt-2
            "
          >
            {totalReceitas.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )} 
          </div>
        </div>

          <div
            className={`
              text-white
              rounded-xl
              p-4

              ${
                totalSaidas === 0
                  ? "bg-red-400"
                  : "bg-red-600"
              }
            `}
          >
            <div>
              Despesas + Investimentos
            </div>

            <div className="text-3xl font-bold mt-2">
              {totalSaidas.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </div>
          </div>

         <div
          className={`
            text-white
            rounded-xl
            p-4

            ${
              saldoPlanejado >= 0
                ? "bg-blue-600"
                : "bg-red-700"
            }
          `}
        >
          <div>
            Saldo Planejado
          </div>

          <div className="text-3xl font-bold mt-2">
            {saldoPlanejado.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}
          </div>
        </div> 

        <div
          className={`
            text-white
            rounded-xl
            p-4

            ${
              saldoAtual >= 0
                ? "bg-blue-600"
                : "bg-red-700"
            }
          `}
        >
          <div>
            Saldo Atual
          </div>

          <div className="text-3xl font-bold mt-2">
            {saldoAtual.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}
          </div>
        </div>

      </div>

      <div
        className="
          bg-white
          rounded-xl
          border
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-slate-100
            "
          >
            <tr>

              <th className="px-4 py-3 text-left">Data</th>

              <th className="px-4 py-3 text-left">Modalidade</th>

              <th className="px-4 py-3 text-left">Categoria</th>

              <th className="px-4 py-3 text-left">SubCategoria</th>

              <th className="px-4 py-3 text-left">Descrição</th>

              <th className="px-4 py-3 text-right">Planejado</th>

              <th className="px-4 py-3 text-right">Realizado</th>

              <th className="px-4 py-3 text-center">Ações</th>
            </tr>

          </thead>

          <tbody>

            {lancamentos.map(
              (
                lancamento
              ) => (
                <tr
                  key={lancamento.id}
                  className="
                    border-t
                    hover:bg-slate-50
                    transition
                  "
                >
                  <td className="px-4 py-3">
                    {new Date(
                      lancamento.data
                    ).toLocaleDateString(
                      "pt-BR"
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {lancamento.modalidade === "RECEITA" && (
                      <span className="font-medium text-green-600">
                        Receita
                      </span>
                    )}

                    {lancamento.modalidade === "DESPESA" && (
                      <span className="font-medium text-red-600">
                        Despesa
                      </span>
                    )}

                    {lancamento.modalidade === "INVESTIMENTO" && (
                      <span className="font-medium text-purple-600">
                        Investimento
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {
                      lancamento
                        .categoria
                        .nome
                    }
                  </td>

                  <td className="px-4 py-3">
                    {
                      lancamento.subCategoria?.nome ??
                      "-"
                    }
                  </td>

                  <td className="px-4 py-3">
                    {
                      lancamento.descricao
                    }
                  </td>

                  <td className="text-right px-4 py-3">
                     {
                      Number(
                              lancamento.valorPlanejado
                            ).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )
                    }
                  </td>

                  <td className="text-right px-4 py-3">
                     {
                      Number(
                              lancamento.valorRealizado
                            ).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )
                    }
                  </td>

                  <td className="flex gap-4 justify-center">
                    <div className="flex gap-2">

                      <ModalEditarLancamento
                        lancamento={lancamento}
                        categorias={categorias}
                      />

                      <BotaoExcluirLancamento
                        id={lancamento.id}
                      />

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </main>
  );
}