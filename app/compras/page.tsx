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

  const cartoes = await prisma.cartao.findMany({
    where: {
      ativo: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  const categorias = await prisma.categoria.findMany({
    where: {
      ativo: true,
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

const totalMes = compras.reduce(
  (acc, item) =>
    acc + Number(item.valorParcela),
  0
);

const cashbackMes = compras.reduce(
  (acc, item) =>
    acc + Number(item.cashback),
  0
);

const iniciando = compras
  .filter(
    (item) =>
      item.statusParcela === "INICIO"
  )
  .reduce(
    (acc, item) =>
      acc + Number(item.valorParcela),
    0
  );

const encerrando = compras
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

    const parcelasCartao = compras.filter(
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
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            Início
          </span>
        );

      case "CORRENTE":
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            Corrente
          </span>
        );

      case "FIM":
        return (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
            Fim
          </span>
        );

      case "UNICA":
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
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

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Compras
            </h1>

            <p className="text-slate-600 mt-1">
              Gerencie seus lançamentos
            </p>
          </div>

          <CompraModal
            usuarios={usuarios}
            cartoes={cartoes}
            categorias={categorias}
          />

        </div>

        {/* Filtros */}

        <FiltrosCompras
          mes={mes}
          ano={ano}
          cartao={cartao}
          usuario={usuario}
          cartoes={cartoes}
          usuarios={usuarios}
        />

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

        <table className="w-full">

          <thead className="bg-slate-300">
            <tr>
              <th className="text-left p-3">
                Data Compra
              </th>

              <th className="text-left p-3">
                Competência
              </th>

              <th className="text-left p-3">
                Cartão
              </th>

              <th className="text-left p-3">
                Usuário
              </th>

              <th className="text-left p-3">
                Categoria
              </th>

              <th className="text-left p-3">
                SubCategoria
              </th>

              <th className="text-left p-3">
                Descrição
              </th>

              <th className="text-left p-3">
                Parcela
              </th>

              <th className="text-left p-3">
                Status
              </th>

              <th className="text-right p-3">
                Valor
              </th>

              <th className="text-right p-3">
                Cashback
              </th>

              <th className="text-center p-3">
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

            {compras.map((parcela) => (
              <tr
                key={parcela.id}
                className="
                  border-t
                  hover:bg-blue-50
                  transition
                "
              >
                <td className="px-3 py-4">
                  {new Date(
                    parcela.compra.dataCompra
                  ).toLocaleDateString("pt-BR")}
                </td>

                <td className="px-3 py-4">
                  {meses[
                    parcela.competenciaMes - 1
                  ]}
                  /
                  {parcela.competenciaAno}

                </td>

                <td className="px-3 py-4">
                  {parcela.compra.cartao.nome}
                </td>

                <td className="px-3 py-4">
                  {parcela.compra.usuario.nome}
                </td>

                <td className="px-3 py-4">
                  {parcela.compra.categoria.nome}
                </td>

                <td className="px-3 py-4">
                  {parcela.compra.subCategoria?.nome ?? "-"}
                </td>


                <td className="px-3 py-4">
                  {parcela.compra.descricao}
                </td>

                <td className="px-3 py-4">
                  <span className="font-medium text-slate-800">
                    (
                    {String(parcela.numeroParcela).padStart(2, "0")}
                    /
                    {String(parcela.totalParcelas).padStart(2, "0")}
                    )
                  </span>
                </td>

                <td className="px-3 py-4">
                  {getStatusBadge(parcela.statusParcela)}
                </td>

                <td className="px-3 py-4 text-right">
                  {formatCurrency(
                    Number(parcela.valorParcela)
                  )}
                </td>

                <td className="px-3 py-4 text-right font-medium text-emerald-600">
                  {formatCurrency(
                    Number(parcela.cashback)
                  )}
                </td>

                <td className="px-3 py-4 text-center">
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
                      descricao={
                        parcela.compra.descricao
                      }
                      parcelas={
                        parcela.compra.parcelas
                      }
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