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

  const totalGeral =
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
          rounded-xl
          border
          p-2
        "
      >

        <h2 className="text-xl font-semibold">
          Gastos por Categoria - Top 5
        </h2>

        <div className="space-y-2">

          {categorias.map((categoria) => {

            const percentual =
              totalGeral > 0
                ? (
                    categoria.valor * 100
                  ) / totalGeral
                : 0;

            return (

              <div
                key={categoria.nome}
                className="mb-1"
              >

                <div
                  className="
                    flex
                    justify-between
                    text-sm
                    mb-1
                  "
                >

                  <span className="font-medium">
                    {categoria.nome}
                  </span>

                  <span>
                    {formatCurrency(categoria.valor)} ... [ {percentual.toFixed(1)}% ]
                  </span>

                </div>

                <div
                  className="
                    text-xs
                    text-slate-500
                    text-right
                    mt-1
                  "
                >
                  
                </div>

                <div
                  className="
                    w-full
                    h-3
                    bg-slate-200
                    rounded-full
                  "
                >

                  <div
                    className="
                      h-3
                      bg-blue-500
                      rounded-full
                      transition-all
                    "
                    style={{
                      width:
                        `${percentual}%`,
                    }}
                  />

                </div>

                

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}
