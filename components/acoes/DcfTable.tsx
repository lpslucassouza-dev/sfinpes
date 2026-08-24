
import { useState } from "react";
import { ValuationService } from "@/lib/valuation/services";
import { DcfRow } from "@/lib/valuation/types";

type Props = {
  
  rows: DcfRow[];

  setRows: React.Dispatch<
    React.SetStateAction<DcfRow[]>
  >;

  calculatedRows?: any[];

  valorTerminal: number;

  vplPerpetuo: number;

  crescimentoPerpetuo: number;

  taxaCrescimento: number;

  setCrescimentoPerpetuo: (
    value: number
    ) => void;
};


export default function DcfTable({
    rows,
    setRows,
    calculatedRows,
    valorTerminal,
    vplPerpetuo,
    crescimentoPerpetuo,
    taxaCrescimento,
    setCrescimentoPerpetuo,
  }: Props) {

  const currentYear = new Date().getFullYear();

  const safeCalculatedRows = calculatedRows ?? [];

function handleLucroChange(
  index: number,
  value: number
) {
  const updated = [...rows];

  updated[index].lucroLiquido = value;

  if (index > 0) {
    updated[index].crescimento =
      ValuationService.calculateGrowth(
        value,
        updated[index - 1].lucroLiquido
      );
  }

  const currentYear = new Date().getFullYear();

  const currentIndex =
    updated.findIndex(
      row => row.ano === currentYear
    );

  if (
      index === currentIndex &&
      updated[currentIndex + 1] &&
      updated[currentIndex + 2]
    ) {

    updated[currentIndex + 1].lucroLiquido =
        value *
        (
          1 +
          taxaCrescimento / 100
        );

      updated[currentIndex + 1].crescimento =
        taxaCrescimento;

      updated[currentIndex + 2].lucroLiquido =
        updated[currentIndex + 1].lucroLiquido *
        (
          1 +
          taxaCrescimento / 100
        );

      updated[currentIndex + 2].crescimento =
        taxaCrescimento;
    }

  setRows(updated);
}

function handleGrowthChange(
  index: number,
  value: number
) {
  const updated = [...rows];

  updated[index].crescimento = value;

  if (
    updated[index - 1] &&
    updated[index]
  ) {
    updated[index].lucroLiquido =
      updated[index - 1].lucroLiquido *
      (
        1 +
        value / 100
      );
  }

  if (
    updated[index + 1]
  ) {
    updated[index + 1].lucroLiquido =
      updated[index].lucroLiquido *
      (
        1 +
        updated[index + 1].crescimento /
        100
      );
  }

  setRows(updated);
}

function formatNumber(value: number) {
  return value.toLocaleString(
    "pt-BR"
  );
}

function formatInteger(
  value: number
) {
  return new Intl.NumberFormat(
    "pt-BR"
  ).format(value);
}

//console.log("calculatedRows",calculatedRows);

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
        min-h-[650px]
      "
    >
      <div className="border-b p-5">

        <h2 className="text-[15px] font-semibold text-slate-800">
          Fluxo de Caixa Descontado
        </h2>

      </div>

      <div className="p-5">

       <table className="w-full">

            <thead>

                <tr className="border-b bg-white">

                <th className="px-6 py-3 text-left text-xs uppercase text-blue-500">
                    Ano
                </th>

                <th className="px-6 py-3 text-center text-xs uppercase text-blue-500">
                    Lucro Líquido
                </th>

                <th className="px-6 py-3 text-center text-xs uppercase text-blue-500">
                    Crescimento
                </th>

                <th className="px-6 py-3 text-center text-xs uppercase text-blue-500">
                    VPL
                </th>

                </tr>

            </thead>

            <tbody>

                {rows.map((row, index) => {

                  const isProjected =
                    row.ano >= currentYear;

                  const calculatedRow =
                    safeCalculatedRows.find(
                      (calc: any) => calc.ano === row.ano
                    );

                    //console.log(row.ano,calculatedRow);

                  return (

                    <tr
                      key={row.ano}
                      className={
                        isProjected
                          ? "bg-blue-50 border-b"
                          : "border-b"
                      }
                    >

                      <td className="px-6 py-4">
                        {row.ano}
                      </td>

                      <td className="px-6 py-4 text-right">

                            <input
                              type="number"
                              value={row.lucroLiquido}
                              onChange={(e) =>
                              handleLucroChange(
                                index,
                                Number(e.target.value.replace(",", "."))
                                )
                            }
                            className="
                              w-52
                              rounded-md
                              bg-white
                              px-2
                              py-1
                              text-right
                            "
                          />

                      </td>

                      <td className="px-6 py-4 text-right">

                          <input
                            type="number"
                            step="0.01"
                            value={row.crescimento}
                            onChange={(e) =>
                            handleGrowthChange(
                              index,
                              Number(e.target.value.replace(",", "."))
                              )
                            }
                            className="
                            w-24
                            rounded-md
                            bg-white
                            px-2
                            py-1
                            text-right
                            "
                          />

                      </td>

                      <td className="px-6 py-4 text-center">
                        {calculatedRow
                            ? calculatedRow.vpl.toLocaleString(
                            "pt-BR",
                            {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            }
                            )
                            : "-"}
                      </td>

                    </tr>

                  );
                })}

                <tr className="border-b bg-blue-50 font-medium">

                    <td className="px-6 py-4">
                      Perpétuo
                    </td>

                    <td className="px-6 py-4 text-right">
                      {valorTerminal.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">

                      <input
                        type="number"
                        value={crescimentoPerpetuo}
                        onChange={(e) =>
                          setCrescimentoPerpetuo(
                            Number(e.target.value)
                          )
                        }
                        className="
                          w-24
                          rounded-md
                          bg-white
                          px-2
                          py-1
                          text-right
                        "
                      />

                    </td>

                    <td className="px-6 py-4 text-right">

                      {vplPerpetuo.toLocaleString(
                        "pt-BR",
                        {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}

  </td>

</tr>


              </tbody>

            </table>

      </div>

    </div>
  );
}