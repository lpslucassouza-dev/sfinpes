"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  valuations: any[];
};

export default function ValuationTable({
  valuations,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [sortField, setSortField] =
    useState("upsideDownside");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">(
      "desc"
    );

  function handleSort(
    field: string
  ) {
    if (field === sortField) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );

      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  const sortedValuations =
    [...valuations].sort(
      (a, b) => {
        const direction =
          sortDirection === "asc"
            ? 1
            : -1;

        const valueA =
          (a as any)[sortField];

        const valueB =
          (b as any)[sortField];

        if (valueA > valueB)
          return direction;

        if (valueA < valueB)
          return -direction;

        return 0;
      }
    );

  const filteredValuations =
    sortedValuations.filter(
      (item) =>
        item.ticker
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  async function handleDelete(
    id: string,
    ticker: string
  ) {

    const confirmed =
      window.confirm(
        `Deseja excluir o valuation de ${ticker}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      const response =
        await fetch(
          `/api/valuation/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      alert(
        "Valuation excluído com sucesso."
      );

      window.location.reload();

    } catch {

      alert(
        "Erro ao excluir valuation."
      );

    }
  }  

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        overflow-hidden
      "
    >
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Buscar ticker..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            rounded-lg
            border
            px-4
            py-2
          "
        />
      </div>

      <table
        className="
          w-full
          text-sm
        "
      >
        <thead>
          <tr className="bg-slate-50">
            <th
              onClick={() =>
                handleSort("ticker")
              }
              className="
                cursor-pointer
                px-4
                py-3
                text-left
              "
            >
              Ticker
              {sortField ===
                "ticker" &&
                (
                  sortDirection ===
                  "asc"
                    ? " ↑"
                    : " ↓"
                )}
            </th>

            <th
              className="
                px-4
                py-3
                text-center
              "
            >
              ROE
            </th>

            <th
              onClick={() =>
                handleSort("precoAtual")
              }
              className="
                cursor-pointer
                px-4
                py-3
                text-right
              "
            >
              Preço Atual
              {sortField ===
                "precoAtual" &&
                (
                  sortDirection ===
                  "asc"
                    ? " ↑"
                    : " ↓"
                )}
            </th>

            <th
              onClick={() =>
                handleSort("precoJusto")
              }
              className="
                cursor-pointer
                px-4
                py-3
                text-right
              "
            >
              Preço Justo
              {sortField ===
                "precoJusto" &&
                (
                  sortDirection ===
                  "asc"
                    ? " ↑"
                    : " ↓"
                )}
            </th>

            <th
              onClick={() =>
                handleSort(
                  "upsideDownside"
                )
              }
              className="
                cursor-pointer
                px-4
                py-3
                text-right
              "
            >
              Upside
              {sortField ===
                "upsideDownside" &&
                (
                  sortDirection ===
                  "asc"
                    ? " ↑"
                    : " ↓"
                )}
            </th>

            <th
              onClick={() =>
                handleSort(
                  "createdAt"
                )
              }
              className="
                cursor-pointer
                px-4
                py-3
                text-center
              "
            >
              Data
              {sortField ===
                "createdAt" &&
                (
                  sortDirection ===
                  "asc"
                    ? " ↑"
                    : " ↓"
                )}
            </th>

            <th
              className="
                px-4
                py-3
                text-center
              "
            >
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredValuations.map(
            (valuation) => (
              <tr
                key={valuation.id}
                className="
                  border-t
                  hover:bg-slate-50
                "
              >
                <td className="px-4 py-3 font-medium">
                  {valuation.ticker}
                </td>

                <td className="px-4 py-3 text-center">
                  {valuation.roe.toFixed(2)}%
                </td>

                <td className="px-4 py-3 text-right">
                  {Number(
                    valuation.precoAtual
                  ).toLocaleString(
                    "pt-BR",
                    {
                      style:
                        "currency",
                      currency:
                        "BRL",
                    }
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  {Number(
                    valuation.precoJusto
                  ).toLocaleString(
                    "pt-BR",
                    {
                      style:
                        "currency",
                      currency:
                        "BRL",
                    }
                  )}
                </td>

                <td
                  className={
                    valuation.upsideDownside >=
                    0
                      ? "px-4 py-3 text-right font-medium text-green-600"
                      : "px-4 py-3 text-right font-medium text-red-600"
                  }
                >
                  {valuation.upsideDownside >
                  0
                    ? "+"
                    : ""}
                  {valuation.upsideDownside.toFixed(
                    2
                  )}
                  %
                </td>

                <td className="px-4 py-3 text-center">
                  {new Date(
                    valuation.createdAt
                  ).toLocaleDateString(
                    "pt-BR"
                  )}
                </td>

                  <td className="px-4 py-3 text-center">
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-3
                      "
                    >
                      <Link
                      href={`/acoes/${valuation.id}`}
                        className="
                          rounded-md
                          bg-blue-600
                          px-3
                          py-1
                          text-sm
                          text-white
                          hover:bg-blue-700
                        "
                      >
                        Visualizar
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            valuation.id,
                            valuation.ticker
                          )
                        }
                        className="
                          rounded-md
                          bg-red-600
                          px-3
                          py-1
                          text-sm
                          text-white
                          hover:bg-red-700
                        "
                      >
                        Excluir
                      </button>
                    </div>
                  </td>

              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}