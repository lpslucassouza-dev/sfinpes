import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModalLancamento from "@/components/conta-corrente/ModalLancamento";
import ModalEditarLancamento from "@/components/conta-corrente/ModalEditarLancamento";
import BotaoExcluirLancamento from "@/components/conta-corrente/BotaoExcluirLancamento";
import FiltrosContaCorrente from "@/components/conta-corrente/FiltrosContaCorrente";
import GraficoCategorias from "@/components/conta-corrente/GraficoCategorias";
import GraficoResumoFinanceiro from "@/components/conta-corrente/GraficoResumoFinanceiro";

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

          orderBy: {
            nome: "asc",
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

      orderBy: [
        {
          data: "asc",
        },
        {
          modalidade: "asc",
        },
        {
          categoria: {
            nome: "asc",
          },
        },
      ],
    }); 

const todosLancamentos =
  await prisma.lancamentoContaCorrente.findMany({
    where: {
      valorRealizado: {
        not: 0,
      },
    },
  });
    
const saldoAtualConta =
  todosLancamentos.reduce(
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

  const receitasPlanejadas =
    receitas.reduce(
      (acc, item) =>
        acc +
        Number(
          item.valorPlanejado
        ),
      0
    );

  const despesasPlanejadas =
    despesas.reduce(
      (acc, item) =>
        acc +
        Number(
          item.valorPlanejado
        ),
      0
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
  
  const totalDespesas =
    despesas.reduce(
      (acc, item) =>
        acc +
        Number(item.valorRealizado),
      0
    ); 

  const totalInvestimentos =
    investimentos.reduce(
      (acc, item) =>
        acc +
        Number(item.valorRealizado),
      0
    );  
  
  const investimentosPlanejados =
    investimentos.reduce(
      (acc, item) =>
        acc +
        Number(
          item.valorPlanejado
        ),
      0
    );

    const totalPlanejado =
    receitasPlanejadas -
    despesasPlanejadas -
    investimentosPlanejados;
  
    const saldoPlanejado =
    receitasPlanejadas -
    despesasPlanejadas -
    investimentosPlanejados;

  const saldoAtual =
    totalReceitas -
    totalDespesas -
    totalInvestimentos;

  const desvio =
    saldoAtual -
    saldoPlanejado;  

  const resultadoMes =
    totalReceitas -
    totalDespesas -
    totalInvestimentos; 

  const totalRealizado =
    totalReceitas -
    totalDespesas -
    totalInvestimentos;

  const resumoCategorias =
    lancamentos.reduce(
      (acc, lancamento) => {

        const categoria =
          lancamento.categoria.nome;

        const valor =
          Number(
            lancamento.valorRealizado
          );

        if (!acc[categoria]) {
          acc[categoria] = 0;
        }

        acc[categoria] += valor;

        return acc;

      },
      {} as Record<string, number>
    );

  const categoriasOrdenadas =
    Object.entries(
      resumoCategorias
    ).sort(
      (a, b) =>
        b[1] - a[1]
    );

  const top5Categorias =
    categoriasOrdenadas.slice(0, 5);

  const resumoReceitas =
    receitas.reduce(
      (acc, item) => {

        const categoria =
          item.categoria.nome;

        if (!acc[categoria]) {
          acc[categoria] = 0;
        }

        acc[categoria] +=
          Number(item.valorRealizado);

        return acc;

      },
      {} as Record<string, number>
    );

  const resumoSaidas =
    [...despesas, ...investimentos]
      .reduce(
        (acc, item) => {

          const categoria =
            item.categoria.nome;

          if (!acc[categoria]) {
            acc[categoria] = 0;
          }

          acc[categoria] +=
            Number(item.valorRealizado);

          return acc;

        },
        {} as Record<string, number>
      );

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
      <div
        className="
          flex
          justify-center
          mb-4
        "
      >
        <div
          className="
            flex
            gap-3
          "
        >
          <FiltrosContaCorrente
            mes={mes}
            ano={ano}
          />
        </div>
      </div>
      
      /* inicio dos cards */
      
        <div
          className="
            grid
            grid-cols-6
            gap-4
            mb-8
          "
        >
          <div
              className="
                bg-emerald-600
                text-white
                rounded-xl
                p-4
                shadow-lg
              "
            >
              <div text-left>
                Receitas Realizadas
              </div>

            <div
              className="
                text-3xl
                font-bold
                mt-2
                text-right
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
            className="
              bg-red-500
              text-white
              rounded-xl
              p-4
              shadow-lg
            "
          >
            <div text-left>
              Despesas Realizadas
            </div>

            <div className="text-3xl font-bold mt-2 text-right">
              {totalDespesas.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </div>
          </div>

          <div
            className="
              bg-violet-600
              text-white
              rounded-xl
              p-4
              shadow-lg
            "
          >
            <div text-left>
              Investimentos Realizados
            </div>

            <div className="text-3xl font-bold mt-2 text-right">
              {totalInvestimentos.toLocaleString(
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
            shadow-lg
            ${
              saldoPlanejado >= 0
                ? "bg-sky-600"
                : "bg-amber-600"
            }
          `}
        >
          <div text-left>
            Saldo Planejado
          </div>

          <div className="text-3xl font-bold mt-2 text-right">
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
              shadow-lg
              ${
                resultadoMes >= 0
                  ? "bg-green-700"
                  : "bg-red-700"
              }
            `}
          >
            <div text-left>
              Resultado do Mês
            </div>

            <div className="text-3xl font-bold mt-2 text-right">
              {resultadoMes.toLocaleString(
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
            shadow-lg
            ${
              saldoAtual >= 0
                ? "bg-blue-700"
                : "bg-red-600"
            }
          `}
        >
          <div text-left>
            Saldo Atual da Conta
          </div>

          <div className="text-3xl font-bold mt-2 text-right">
            {saldoAtualConta.toLocaleString(
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
          grid
          lg:grid-cols-2
          gap-6
          mb-6
        "
      >

        <div
          className="
            bg-white
            rounded-xl
            border
            p-6
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              mb-4
            "
          >
            Resumo por Categoria
          </h2>

          <div className="space-y-3">

            {categoriasOrdenadas.map(
              ([nome, valor]) => (
                <div
                  key={nome}
                  className="
                    flex
                    justify-between
                    border-b
                    pb-2
                  "
                >
                  <span>
                    {nome}
                  </span>

                  <span className="font-medium">
                    {valor.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </span>
                </div>
              )
            )}

          </div>

        </div>

        <div
          className="
            bg-white
            rounded-xl
            border
            p-6
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              mb-4
              "
          >
            Receitas x Despesas x Investimentos
          </h2>

          <GraficoResumoFinanceiro
            receitas={totalReceitas}
            despesas={totalDespesas}
            investimentos={totalInvestimentos}
          />
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

        <table
          className="
            w-full
            text-sm
          "
        >

          <thead
            className="
              bg-slate-100
              text-slate-700
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
              (lancamento, index) => (
                <tr
                  key={lancamento.id}
                  className={`
                    border-t

                    ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50"
                    }

                    hover:bg-blue-50
                    transition
                  `}
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

                  <td className="px-4 py-3 text-center">
                    <div
                      className="
                        flex
                        justify-center
                        gap-3
                      "
                    >

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