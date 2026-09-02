"use client";

import { useEffect, useState } from "react";

export default function ConsultaAtivosPage() {

  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] =
    useState("");

  const [dados, setDados] =
    useState<any>(null);

  useEffect(() => {
    carregarAtivos();
  }, []);

  async function carregarAtivos() {

    const response =
      await fetch("/api/assets");

    const data =
      await response.json();

    setAssets(data);
  }

  async function consultar(id: string) {

    if (!id) return;

    const response =
      await fetch(
        `/api/assets/${id}/history`
      );

    const data =
      await response.json();

    setDados(data);
  }

  return (
  <div className="p-8 max-w-7xl mx-auto">

    {/* Cabeçalho */}

    <div className="mb-6">
        <h1 className="text-3xl font-bold">
            Consulta por Ativo
        </h1>

        <p className="text-gray-500">
            Busque pelo ticker e veja o histórico completo +
            as 3 últimas transações
        </p>
        </div>
        

    {/* Seleção */}

    <div className="flex gap-3 mb-6">

        <input
            placeholder="Buscar ticker"
            className="flex-1 border rounded-lg p-3"
        />

        <select
            value={assetId}
            onChange={(e) => {
            setAssetId(e.target.value);
            consultar(e.target.value);
            }}
            className="w-72 border rounded-lg p-3"
        >
            <option value="">
            Ou selecione um ativo
            </option>

            {assets.map((asset: any) => (
            <option
                key={asset.id}
                value={asset.id}
            >
                {asset.ticker}
            </option>
            ))}
        </select>

        </div>

    {/* Resumo do Ativo */}

    {dados && (

        <div className="border rounded-xl p-4 mb-6 bg-white">

        <div className="flex gap-8 flex-wrap">

            <div>
            <p className="text-gray-500 text-sm">
                Ativo
            </p>

            <p className="font-bold">
                {dados.asset.ticker}
            </p>
            </div>

            <div>
            <p className="text-gray-500 text-sm">
                Tipo
            </p>

            <p className="font-bold">
                {dados.asset.tipo}
            </p>
            </div>

            <div>
            <p className="text-gray-500 text-sm">
                Status
            </p>

            <p className="font-bold">
                {dados.asset.ativo
                ? "Ativo"
                : "Inativo"}
            </p>
            </div>

            <div>
            <p className="text-gray-500 text-sm">
                Total Cotas
            </p>

            <p className="font-bold">
                {dados.resumo.totalCotas}
            </p>
            </div>

            <div>
            <p className="text-gray-500 text-sm">
                PM Atual
            </p>

            <p className="font-bold">
                R$ {dados.resumo.precoMedio}
            </p>
            </div>
            
            <div>
                <p className="text-gray-500 text-sm">
                    Total Investido
                </p>
                <p className="font-bold">
                    R$ {dados.resumo.totalInvestido}
                </p>
            </div>

            

        </div>

        </div>

        )}


    {/* Últimas 3 Transações */}

    {dados && (

        <div className="mb-8">

        <h2 className="font-bold text-lg mb-4">
            Últimas 3 Transações
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

            {dados.ultimasTransacoes.map(
            (tx: any, index: number) => (

            <div
                key={tx.id}
                className="border rounded-lg p-4 bg-white"
            >

                <div className="flex justify-between mb-4">

                <span
                    className={
                    tx.tipoOperacao === "COMPRA"
                        ? "bg-black text-white text-xs px-2 py-1 rounded"
                        : "bg-gray-200 text-xs px-2 py-1 rounded"
                    }
                >
                    {tx.tipoOperacao}
                </span>

                <span className="text-xs text-gray-400">

                    {index === 0
                    ? "Mais recente"
                    : index === 1
                    ? "2ª"
                    : "3ª"}

                </span>

                </div>

                <p className="text-sm mb-3">
                {new Date(
                    tx.dataOperacao
                ).toLocaleDateString()}
                </p>

                <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                    <span>Qtd</span>
                    <span>{tx.quantidade}</span>
                </div>

                <div className="flex justify-between">
                    <span>Valor Unid.</span>

                    <span>
                    {Number(
                        tx.valorUnitario
                    ).toLocaleString(
                        "pt-BR",
                        {
                        style: "currency",
                        currency: "BRL",
                        }
                    )}
                    </span>
                </div>

                <div className="flex justify-between">

                    <span>Total</span>

                    <span className="font-semibold">
                    {Number(
                        tx.valorTotal
                    ).toLocaleString(
                        "pt-BR",
                        {
                        style: "currency",
                        currency: "BRL",
                        }
                    )}
                    </span>

                </div>

                <div className="flex justify-between">

                    <span>PM Pós</span>

                    <span>
                    {Number(
                        tx.posicao.precoMedio
                    ).toLocaleString(
                        "pt-BR",
                        {
                        style: "currency",
                        currency: "BRL",
                        }
                    )}
                    </span>

                </div>

                <div className="flex justify-between">

                    <span>Dif. PM</span>

                    <span>

                    {tx.posicao.diferencaPm > 0 ? (
                        <span className="text-green-600">
                        +R$ {tx.posicao.diferencaPm}
                        </span>
                    ) : tx.posicao.diferencaPm < 0 ? (
                        <span className="text-red-600">
                        R$ {tx.posicao.diferencaPm}
                        </span>
                    ) : (
                        <span>
                        R$ 0,00
                        </span>
                    )}
                    </span>

                </div>

                </div>

            </div>

            ))}

        </div>

        </div>

        )}

    {/* Histórico Completo */}

    {dados && (

        <div>

        <h2 className="font-bold text-lg mb-4">
            Histórico
        </h2>

        <div className="border rounded-lg overflow-hidden">

            <table className="w-full">

            <thead>

                <tr className="bg-gray-50 border-b">

                <th className="p-1 text-center">
                    Data
                </th>

                <th className="p-1 text-center">
                    Operação
                </th>

                <th className="p-1 text-center">
                    Quantidade
                </th>

                <th className="p-1 text-center">
                    Valor Unit.
                </th>

                <th className="p-1 text-center">
                    Total
                </th>

                <th className="p-1 text-center">
                    Total Cotas
                </th>

                <th className="p-1 text-center">
                    PM Pós
                </th>

                <th className="p-1 text-center">
                    Dif PM
                </th>

                </tr>

            </thead>

            <tbody>

                {dados.historico.map((tx: any, index: number) => (

                <tr
                    key={tx.id}
                    className="border-b"
                >

                    <td className="p-2 text-center">

                    {new Date(
                        tx.dataOperacao
                    ).toLocaleDateString()}

                    </td>

                    <td className="p-2 text-center">
                    {tx.tipoOperacao}
                    </td>

                    <td className="p-2 text-center">
                    {tx.quantidade}
                    </td>

                    <td className="p-2 text-center">
                    R$ {Number(
                        tx.valorUnitario
                    ).toFixed(2)}
                    </td>

                    <td className="p-2 text-center">
                    R$ {Number(
                        tx.valorTotal
                    ).toFixed(2)}
                    </td>

                    <td className="p-2 text-center">
                    {tx.posicao.totalCotas}
                    </td>

                    <td className="p-2 text-center">
                    R$ {tx.posicao.precoMedio}
                    </td>

                    <td className="p-2 text-center">

                    {tx.posicao.diferencaPm > 0 ? (
                        <span className="text-green-600">
                        +R$ {tx.posicao.diferencaPm}
                        </span>
                    ) : tx.posicao.diferencaPm < 0 ? (
                        <span className="text-red-600">
                        R$ {tx.posicao.diferencaPm}
                        </span>
                    ) : (
                        <span>
                        R$ 0,00
                        </span>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
        )}
  </div>
);
}