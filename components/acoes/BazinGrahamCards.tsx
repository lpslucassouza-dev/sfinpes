type Props = {
  dpa: number;
  setDpa: (value: number) => void;

  dividendYieldDesejado: number;
  setDividendYieldDesejado: (
    value: number
  ) => void;

  lpa: number;
  setLpa: (value: number) => void;

  vpa: number;
  setVpa: (value: number) => void;

  precoTetoBazin: number;
  margemSegurancaBazin: number;

  precoTetoGraham: number;
  margemSegurancaGraham: number;
};

export default function BazinGrahamCards({
  dpa,
  setDpa,
  dividendYieldDesejado,
  setDividendYieldDesejado,
  lpa,
  setLpa,
  vpa,
  setVpa,
  precoTetoBazin,
  margemSegurancaBazin,
  precoTetoGraham,
  margemSegurancaGraham,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">

      {/* Bazin */}

      <div
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="border-b p-2">
          <h2 className="font-semibold">
            Valuation Bazin
          </h2>
        </div>

        <div className="p-2 space-y-1">

          <div className="flex justify-between items-center">
            <span>DPA (dividendo por ação)</span>

            <input
              type="number"
              step="0.01"
              value={dpa}
              onChange={(e) =>
                setDpa(
                  Number(
                    e.target.value.replace(
                      ",",
                      "."
                    )
                  )
                )
              }
              className="w-24 border rounded px-2 py-1 text-right"
            />
          </div>

          <div className="flex justify-between items-center">
            <span>DY Desejado (%)</span>

            <input
              type="number"
              step="0.01"
              value={dividendYieldDesejado}
              onChange={(e) =>
                setDividendYieldDesejado(
                  Number(
                    e.target.value.replace(
                      ",",
                      "."
                    )
                  )
                )
              }
              className="
                w-24
                border
                rounded
                px-2
                py-1
                text-right
              "
            />
          </div>

          <div className="border-t pt-4">
            <div className="text-green-600 font-medium">
              Preço Teto Bazin
            </div>

            <div className="text-xl font-bold">
              {precoTetoBazin.toLocaleString(
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
              Margem de Segurança
            </div>

            <div
              className={
                margemSegurancaBazin >= 0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {margemSegurancaBazin.toFixed(2)}%
            </div>
          </div>

        </div>
      </div>

      {/* Graham */}

      <div
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="border-b p-2">
          <h2 className="font-semibold">
            Valuation Graham
          </h2>
        </div>

        <div className="p-2 space-y-1">

          <div className="flex justify-between items-center">
            <span>LPA</span>

            <input
                type="number"
                step="0.01"
                value={lpa}
                onChange={(e) =>
                  setLpa(
                    Number(
                      e.target.value.replace(",", ".")
                    )
                  )
                }
                className="
                  w-24
                  border
                  rounded
                  px-2
                  py-1
                  text-right
                "
              />
          </div>

          <div className="flex justify-between items-center">
            <span>VPA</span>

            <input
              type="number"
              step="0.01"
              value={vpa}
              onChange={(e) =>
                setVpa(
                  Number(
                    e.target.value.replace(
                      ",",
                      "."
                    )
                  )
                )
              }
              className="w-24 border rounded px-1 py-1 text-right"
            />
          </div>

          <div className="border-t pt-1">
            <div className="text-green-600 font-medium">
              Preço Teto Graham
            </div>

            <div className="text-xl font-bold">
              {precoTetoGraham.toLocaleString(
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
              Margem de Segurança
            </div>

            <div
              className={
                margemSegurancaGraham >=
                0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {margemSegurancaGraham.toFixed(2)}%
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}