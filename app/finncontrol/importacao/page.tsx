"use client";

import { useState } from "react";

export default function ImportacaoPage() {

  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<any>(null);

  const [importando, setImportando] =
    useState(false);

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
        "/api/importacao/preview",
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
          "/api/importacao/executar",
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

      {preview && (

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
                      {row.data}
                    </td>

                    <td className="p-3 text-right">
                      {row.quantidade}
                    </td>

                    <td className="p-3 text-right">
                      {row.valorUnitario.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </td>
                    
                    <td className="p-3 text-right">
                      {row.valorTotal.toLocaleString(
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

      )}

    </div>

  );
}