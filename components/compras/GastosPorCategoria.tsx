import {
  formatCurrency,
} from "@/lib/format";

type Props = {
  categorias: {
    nome: string;
    valor: number;
  }[];
};

export default function GastosPorCategoria({
  categorias,
}: Props) {

  const maiorValor = categorias[0]?.valor ?? 1;

  const totalCategorias =
    categorias.reduce(
      (acc, categoria) =>
        acc + categoria.valor,
      0
  );

  return (
    <div>

      <div
        className="
          bg-white
          border
          border-slate-200
          shadow-md
          rounded-2xl
          p-5
        "
      >

        <h2 className="text-xl font-semibold mb-1">
          Gastos por Categoria
        </h2>

        <p className="text-slate-500 text-sm mb-6">
          Distribuição no período filtrado
        </p>

        <div className="space-y-4">

          {categorias.map(
            (categoria) => {

                const percentual =
                  totalCategorias > 0
                    ? (
                        (categoria.valor * 100) /
                        totalCategorias
                      ).toFixed(1)
                    : "0";

              return (
                <div
                  key={categoria.nome}
                >

                  <div className="flex justify-between mb-1 text-sm">

                    <span>
                      {categoria.nome}
                    </span>

                    <div className="text-right">
                      <div>
                        {formatCurrency(
                          categoria.valor
                        )}
                      </div>

                      <div className="text-xs text-slate-500">
                        {percentual}%
                      </div>
                    </div>

                  </div>

                  <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="
                        h-full
                        bg-gradient-to-r
                        from-blue-600
                        to-blue-400
                        rounded-full
                      "
                      style={{
                        width: `${percentual}%`,
                      }}
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}
