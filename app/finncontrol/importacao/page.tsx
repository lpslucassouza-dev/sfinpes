"use client";

import { useState } from "react";

export default function ImportacaoPage() {

  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<any>(null);

  const [importando, setImportando] =
    useState(false);

  const [tipoImportacao, setTipoImportacao] =
    useState("movimentacoes");

  async function analisar() {

    if (!arquivo) {
      alert("Selecione um arquivo.");
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      arquivo
    );

    const response =
      await fetch(
       `/api/importacao/${tipoImportacao}/preview`,
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    setPreview(data);
  }

  async function importar() {

      if (!arquivo) {
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        arquivo
      );

      setImportando(true);

      const response =
        await fetch(
          `/api/importacao/${tipoImportacao}/executar`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      setImportando(false);

      alert(
        `${data.importados} registros importados`
      );
    }

  return (

    <div className="p-8 max-w-7xl mx-auto">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Importação de Lançamentos
        </h1>

        <p className="text-gray-500">
          Importação histórica de movimentações
        </p>

      </div>

      <div className="mb-4">

        <label className="block mb-2 font-medium">
          Tipo de Importação
        </label>

        <select
          value={tipoImportacao}
          onChange={(e) =>
            setTipoImportacao(e.target.value)
          }
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >

          <option value="movimentacoes">
            Movimentações
          </option>

          <option value="rendimentos">
            Rendimentos
          </option>

        </select>

      </div>

      <div className="border rounded-xl bg-white p-6">

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) =>
            setArquivo(
              e.target.files?.[0] || null
            )
          }
        />

        <button
          onClick={analisar}
          className="
            ml-4
            bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Analisar Arquivo
        </button>

      </div>

      {preview &&
      tipoImportacao === "movimentacoes" && (

        <div className="mt-8">

          <div className="mb-4">

            <strong>

              Total encontrado:

            </strong>

            {" "}

            {preview.totalRegistros}

            {" "}registro(s)

          </div>

          <div className="border rounded-xl overflow-hidden">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-800 text-white">

                  <th className="p-3 text-left">
                    Ativo
                  </th>

                  <th className="p-3 text-left">
                    Operação
                  </th>

                  <th className="p-3 text-left">
                    Data
                  </th>

                  <th className="p-3 text-right">
                    Quantidade
                  </th>

                  <th className="p-3 text-right">
                    Valor Unit.
                  </th>

                  <th className="p-3 text-right">
                    Total
                  </th>

                  <th className="p-3 text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {preview.preview.map(
                  (row: any, index: number) => (

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="p-3">
                      {row.ticker}
                    </td>

                    <td className="p-3">
                      {row.operacao}
                    </td>

                    <td className="p-3">
                      {new Date(
                        (Number(row.data) - 25569) *
                        86400 *
                        1000
                      ).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="p-3 text-right">
                      {row.quantidade}
                    </td>

                    <td className="p-3 text-right">
                      {Number(
                          row.valorUnitario ?? 0
                        ).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </td>
                    
                    <td className="p-3 text-right">
                      {Number(
                          row.valorTotal ?? 0
                        ).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </td>

                    <td className="p-3 text-center">

                      {row.ativoExiste
                        ? "✅"
                        : "❌"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <button
            onClick={importar}
            className="
              mt-6
              bg-green-700
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Importar Definitivamente
          </button>

        </div>
      )
      }

      

      {preview &&
      tipoImportacao === "rendimentos" && (

        <div className="mt-8">

          <div className="mb-4">

            <strong>

              Total encontrado:

            </strong>

            {" "}

            {preview.totalRegistros}

            {" "}registro(s)

          </div>

          <div className="border rounded-xl overflow-hidden">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-800 text-white">

                  <th className="p-3 text-left">
                    Ticker
                  </th>

                  <th className="p-3 text-left">
                    Tipo DY
                  </th>

                  <th className="p-3 text-left">
                    Data
                  </th>

                  <th className="p-3 text-right">
                    Qtd Cotas
                  </th>

                  <th className="p-3 text-right">
                    DY
                  </th>

                  <th className="p-3 text-right">
                    Vl Unit
                  </th>

                  <th className="p-3 text-right">
                    Vl Total
                  </th>

                  <th className="p-3 text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {preview.preview.map(
                  (row: any, index: number) => (

                    <tr
                      key={index}
                      className="border-b"
                    >

                      <td className="p-3">
                        {row.ticker}
                      </td>

                      <td className="p-3">
                        {row.tipoRendimento}
                      </td>

                      <td className="p-3">
                        {row.data}
                      </td>

                      <td className="p-3 text-right">
                        {row.quantidadeCotas}
                      </td>

                      <td className="p-3 text-right">
                        {(Number(row.dy) * 100).toFixed(2)}%
                      </td>

                      <td className="p-3 text-right">
                        {Number(
                          row.valorUnitario
                        ).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {Number(
                          row.valorTotal
                        ).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </td>

                      <td className="p-3 text-center">
                        {row.ativoExiste
                          ? "✅"
                          : "❌"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>
          </div>
          
                <button
                  onClick={importar}
                  className="
                  mt-6
                  bg-green-700
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  "
                  >
                  Importar Definitivamente
                  </button>

        </div>

      )
      }

    </div>
  );
}