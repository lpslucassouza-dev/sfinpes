import CompraModal from "@/components/compras/CompraModal";
import { prisma } from "@/lib/prisma";
import FiltrosCompras from "@/components/compras/FiltrosCompras";
import CardsResumo from "@/components/compras/CardsResumo";
import { formatCurrency } from "@/lib/format";
import CardsCartao from "@/components/compras/CardsCartao";
import GastosPorCategoria from "@/components/compras/GastosPorCategoria";
import ModalParcelas from "@/components/compras/ModalParcelas";
import ModalExcluirCompra from "@/components/compras/ModalExcluirCompra";
import ModalEditarCompra from "@/components/compras/ModalEditarCompra";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    mes?: string;
    ano?: string;
    cartao?: string;
    usuario?: string;
  }>;
};

export default async function ComprasPage({
  searchParams,
}: Props) {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;

  const hoje = new Date();

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

  const mes =
    Number(params.mes) ||
    hoje.getMonth() + 1;

  const ano =
    Number(params.ano) ||
    hoje.getFullYear();

  const cartao =
  Number(params.cartao) || 0;

  const usuario =
    Number(params.usuario) || 0;

  const usuarios = await prisma.usuario.findMany({
    where: {
      ativo: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  const cartoesRaw =
    await prisma.cartao.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

  const cartoes =
    cartoesRaw.map((cartao) => ({
      ...cartao,

      cashbackPercent:
        Number(
          cartao.cashbackPercent
        ),
    }));

  const categorias = await prisma.categoria.findMany({
    where: {
            OR: [
            {
            tipo: "CARTAO",
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

  const compras = await prisma.parcela.findMany({
    where: {
    competenciaMes: mes,
    competenciaAno: ano,

    compra: {
      ...(cartao
        ? { cartaoId: cartao }
        : {}),

      ...(usuario
        ? { usuarioId: usuario }
        : {}),
    },
  },
  include: {
    compra: {
      include: {
        cartao: true,
        usuario: true,
        categoria: true,
        subCategoria: true,
        parcelas: true,
      },
    },
  },

  orderBy: {
    compra: {
      dataCompra: "desc",
    },
  },
});

const comprasSeguras =
    compras.map((parcela) => ({

      ...parcela,

      valorParcela:
        Number(parcela.valorParcela),

      cashback:
        Number(parcela.cashback),

      compra: {

        ...parcela.compra,

        valorTotal:
          Number(
            parcela.compra.valorTotal
          ),

        parcelas:
          parcela.compra.parcelas.map(
            (p) => ({

              ...p,

              valorParcela:
                Number(
                  p.valorParcela
                ),

              cashback:
                Number(
                  p.cashback
                ),

            })
          ),

      },

    }));

const comprasFormatadas =
  comprasSeguras.map((parcela) => ({

    ...parcela,

    valorParcela:
      Number(
        parcela.valorParcela
      ),

    cashback:
      Number(
        parcela.cashback
      ),

    compra: {

      ...parcela.compra,

      valorTotal:
        Number(
          parcela.compra.valorTotal
        ),

      parcelas:
        parcela.compra.parcelas.map(
          (p) => ({

            ...p,

            valorParcela:
              Number(
                p.valorParcela
              ),

            cashback:
              Number(
                p.cashback
              ),

          })
        ),

    },

  }));

const totalMes = comprasFormatadas.reduce(
  (acc, item) =>
    acc + Number(item.valorParcela),
  0
);

const cashbackMes = comprasFormatadas.reduce(
  
  (acc, item) =>
    acc + Number(item.cashback),
  0
);

const iniciando = comprasFormatadas
  .filter(
    (item) =>
      item.statusParcela === "INICIO"
  )
  .reduce(
    (acc, item) =>
      acc + Number(item.valorParcela),
    0
  );

const encerrando = comprasFormatadas
  .filter(
    (item) =>
      item.statusParcela === "FIM"
  )
  .reduce(
    (acc, item) =>
      acc + Number(item.valorParcela),
    0
  );

  const totalPorCartao = cartoes.map((cartaoItem) => {

    const parcelasCartao = comprasFormatadas.filter(
      (parcela) =>
        parcela.compra.cartaoId ===
        cartaoItem.id
      );

      const total = parcelasCartao.reduce(
        (acc, item) =>
          acc + Number(item.valorParcela),
        0
      );

      const cashback = parcelasCartao.reduce(
        (acc, item) =>
          acc + Number(item.cashback),
        0
      );

      return {
        id: cartaoItem.id,
        nome: cartaoItem.nome,
        total,
        cashback,
      };
  }); 

  const categoriasMap = new Map<
    string,
    number
  >();

  compras.forEach((parcela) => {
    const categoria =
      parcela.compra.categoria.nome;

    const valor = Number(
      parcela.valorParcela
    );

    categoriasMap.set(
      categoria,
      (categoriasMap.get(categoria) ?? 0)
        + valor
    );
  });

  const gastosPorCategoria =
    Array.from(
      categoriasMap.entries()
    )
      .map(([nome, valor]) => ({
        nome,
        valor,
      }))
      .sort(
        (a, b) =>
          b.valor - a.valor
      );

  function getStatusBadge(status: string) {
    switch (status) {
      case "INICIO":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
            Início
          </span>
        );

      case "CORRENTE":
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
            Corrente
          </span>
        );

      case "FIM":
        return (
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
            Fim
          </span>
        );

      case "UNICA":
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">
            Única
          </span>
        );

      default:
        return status;
    }
  }

  return (
    <main className="max-w-[1600px] mx-auto p-8">
      {/* Header */}

        <div className="flex items-center justify-between mb-2">

          <div>
            <h1 className="text-3xl font-bold">
              Dashboard Financeiro
            </h1>

            <p className="text-slate-600">
              Visão geral dos lançamentos e compromissos futuros
            </p>
          </div>

          <CompraModal
            usuarios={usuarios}
            cartoes={cartoes}
            categorias={categorias}
          />

        </div>

        {/* Filtros */}

        <div
          className="
            flex
            justify-center
          "
        >
          <div className="flex gap-3">

            <FiltrosCompras
              mes={mes}
              ano={ano}
              cartao={cartao}
              usuario={usuario}
              cartoes={cartoes}
              usuarios={usuarios}
            />

          </div>
        </div>

        {/* Cards Resumo */}

        <CardsResumo
          totalMes={totalMes}
          cashbackMes={cashbackMes}
          iniciando={iniciando}
          encerrando={encerrando}
        />

        {/* Cards Cartão */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <CardsCartao
            cartoes={totalPorCartao}
          />

          <GastosPorCategoria
            categorias={gastosPorCategoria}
          />

        </div>

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-md
          overflow-hidden
        "
      >

        <table className="w-full text-xs">

          <thead className="bg-slate-300">
            <tr>
              <th className="text-left p-2">
                Data Compra
              </th>

              <th className="text-left p-2">
                Competência
              </th>

              <th className="text-left p-2">
                Cartão
              </th>

              <th className="text-left p-2">
                Usuário
              </th>

              <th className="text-left p-2">
                Categoria
              </th>

              <th className="text-left p-2">
                SubCategoria
              </th>

              <th className="text-left p-2">
                Descrição
              </th>

              <th className="text-left p-2">
                Parcela
              </th>

              <th className="text-left p-2">
                Status
              </th>

              <th className="text-right p-2">
                Valor
              </th>

              <th className="text-right p-2">
                Cashback
              </th>

              <th className="text-center p-2">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>

            {compras.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-10 text-slate-500"
                >
                  Nenhuma compra cadastrada
                </td>
              </tr>
            )}

            {comprasFormatadas.map((parcela) => (
              <tr
                key={parcela.id}
                className="
                  border-t
                  hover:bg-blue-50
                  transition
                "
              >
                <td className="px-2 py-1">
                  {new Date(
                    parcela.compra.dataCompra
                  ).toLocaleDateString("pt-BR")}
                </td>

                <td className="px-2 py-1">
                  {meses[
                    parcela.competenciaMes - 1
                  ]}
                  /
                  {parcela.competenciaAno}

                </td>

                <td className="px-2 py-1">
                  {parcela.compra.cartao.nome}
                </td>

                <td className="px-2 py-1">
                  {parcela.compra.usuario.nome}
                </td>

                <td className="px-2 py-1">
                  {parcela.compra.categoria.nome}
                </td>

                <td className="px-2 py-1">
                  {parcela.compra.subCategoria?.nome ?? "-"}
                </td>


                <td className="px-2 py-1">
                  {parcela.compra.descricao}
                </td>

                <td className="px-2 py-1">
                  <span className="font-medium text-slate-800">
                    (
                    {String(parcela.numeroParcela).padStart(2, "0")}
                    /
                    {String(parcela.totalParcelas).padStart(2, "0")}
                    )
                  </span>
                </td>

                <td className="px-2 py-1">
                  {getStatusBadge(parcela.statusParcela)}
                </td>

                <td className="px-2 py-1 text-right">
                  {formatCurrency(
                    Number(parcela.valorParcela)
                  )}
                </td>

                <td className="px-2 py-1 text-right font-medium text-emerald-600">
                  {formatCurrency(
                    Number(parcela.cashback)
                  )}
                </td>

                <td className="px-2 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-2">

                    <ModalEditarCompra
                      compraId={parcela.compra.id}
                      descricao={parcela.compra.descricao}
                      usuarioId={parcela.compra.usuarioId}
                      categoriaId={parcela.compra.categoriaId}
                      subCategoriaId={
                        parcela.compra.subCategoriaId
                      }
                      usuarios={usuarios}
                      categorias={categorias}
                    />

                    <ModalParcelas
                      descricao={parcela.compra.descricao}
                      parcelas={parcela.compra.parcelas}
                    />

                    <ModalExcluirCompra
                      compraId={
                        parcela.compra.id
                      }
                      descricao={
                        parcela.compra.descricao
                      }
                    />

                  </div>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </main>
  );
}