"use client";

import { useEffect, useState } from "react";

export default function ResumoMensalPage() {

  const [dados, setDados] =
    useState<any>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const response =
      await fetch(
        "/api/resumo-mensal"
      );

    const data =
      await response.json();

    setDados(data);
  }

  function moeda(valor: number) {
    return valor.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  if (!dados) {
    return (
      <div className="p-8">
        Carregando...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Resumo Mensal
        </h1>

        <p className="text-gray-500">
          Consolidado dos investimentos
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="border rounded-xl p-4 bg-white">

          <p className="text-gray-500">
            Total Comprado
          </p>

          <h2 className="text-2xl font-bold">
            {moeda(
              dados.cards.totalComprado
            )}
          </h2>

        </div>

        <div className="border rounded-xl p-4 bg-white">

          <p className="text-gray-500">
            Total Vendido
          </p>

          <h2 className="text-2xl font-bold">
            {moeda(
              dados.cards.totalVendido
            )}
          </h2>

        </div>

        <div className="border rounded-xl p-4 bg-white">

          <p className="text-gray-500">
            Patrimônio Atual
          </p>

          <h2 className="text-2xl font-bold">
            {moeda(
              dados.cards.patrimonioAtual
            )}
          </h2>

        </div>

      </div>

      <div className="border rounded-xl p-6 bg-white mb-8">

        <h2 className="font-bold mb-4">
          Resumo por Tipo
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">
                Tipo
              </th>

              <th className="text-right p-3">
                Compras
              </th>

              <th className="text-right p-3">
                Vendas
              </th>

            </tr>

          </thead>

          <tbody>

            {dados.tipos.map(
              (tipo: any) => (

              <tr key={tipo.tipo}>
                <td className="p-3">
                  {tipo.tipo}
                </td>

                <td className="p-3 text-right">
                  {moeda(tipo.compras)}
                </td>

                <td className="p-3 text-right">
                  {moeda(tipo.vendas)}
                </td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="border rounded-xl p-6 bg-white">

        <h2 className="font-bold mb-4">
          Resumo por Mês
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">
                Mês
              </th>

              <th className="text-right p-3">
                Compras
              </th>

              <th className="text-right p-3">
                Vendas
              </th>

            </tr>

          </thead>

          <tbody>

            {dados.meses.map(
              (mes: any) => (

              <tr key={mes.mes}>

                <td className="p-3">
                  {mes.mes}
                </td>

                <td className="p-3 text-right">
                  {moeda(mes.compras)}
                </td>

                <td className="p-3 text-right">
                  {moeda(mes.vendas)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}