"use client";

import { useState } from "react";

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
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}