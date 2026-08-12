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
  ``

  const dadosGraficoCategorias =
    categoriasOrdenadas.map(
      ([nome, valor]) => ({
        nome,
        valor,
      })
    );

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
                shadow-lg
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
            className="
              bg-red-600
              text-white
              rounded-xl
              p-4
              shadow-lg
            "
          >
            <div>
              Despesas
            </div>

            <div className="text-3xl font-bold mt-2">
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
              bg-purple-600
              text-white
              rounded-xl
              p-4
              shadow-lg
            "
          >
            <div>
              Investimentos
            </div>

            <div className="text-3xl font-bold mt-2">
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
            shadow-lg
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

        <div
            className={`
              text-white
              rounded-xl
              p-4
              shadow-lg
              ${
                resultadoMes >= 0
                  ? "bg-emerald-700"
                  : "bg-red-700"
              }
            `}
          >
            <div>
              Resultado do Mês
            </div>

            <div className="text-3xl font-bold mt-2">
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
                desvio >= 0
                  ? "bg-blue-700"
                  : "bg-orange-700"
              }
            `}
          >
            <div>
              Desvio
            </div>

            <div className="text-3xl font-bold mt-2">
              {desvio.toLocaleString(
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
          p-6
          mb-6
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            mb-4
          "
        >
          Planejado x Realizado
        </h2>

        <div
          className="
            grid
            grid-cols-3
            gap-4
          "
        >
          <div>
            <div className="text-slate-500">
              Planejado
            </div>

            <div className="text-xl font-bold">
              {totalPlanejado.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </div>
          </div>

          <div>
            <div className="text-slate-500">
              Realizado
            </div>

            <div className="text-xl font-bold">
              {totalRealizado.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </div>
          </div>

          <div>
            <div className="text-slate-500">
              Diferença
            </div>

            <div
              className={`
                text-xl
                font-bold

                ${
                  desvio >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              `}
            >
              {desvio.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </div>
          </div>
        </div>
      </div>
      `

      <div
        className="
          bg-white
          rounded-xl
          border
          p-6
          mb-6
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

                <span
                  className="
                    font-medium
                  "
                >
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
          mb-6
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            mb-4
          "
        >
          Top 5 Categorias
        </h2>

        <div className="space-y-3">

          {top5Categorias.map(
            ([nome, valor], index) => (
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
                  {index + 1}. {nome}
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
          mb-6
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            mb-4
          "
        >
          Distribuição por Categoria
        </h2>

        <GraficoCategorias
          dados={
            dadosGraficoCategorias
          }
        />
      </div>

      <div
        className="
          bg-white
          rounded-xl
          border
          p-6
          mb-6
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
      ``

      <div
        className="
          bg-white
          rounded-xl
          border
          p-6
          mb-6
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            mb-4
          "
        >
          Top 5 Categorias
        </h2>

        <div className="space-y-3">

          {top5Categorias.map(
            ([nome, valor], index) => (
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
                  {index + 1}. {nome}
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
              (
                lancamento
              ) => (
                <tr
                  key={lancamento.id}
                  className={`
                    border-t
                    hover:bg-slate-50
                    transition

                    ${
                      lancamento.modalidade ===
                      "INVESTIMENTO"
                        ? "bg-purple-50"
                        : ""
                    }
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