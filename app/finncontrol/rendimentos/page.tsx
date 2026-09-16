"use client";

import { useEffect, useState } from "react";

export default function RendimentosPage() {

    const [rendimentos, setRendimentos] =
    useState<any[]>([]);

    const [assets, setAssets] =
    useState<any[]>([]);

    const [open, setOpen] =
    useState(false);

    const [filtroTipoAtivo, setFiltroTipoAtivo] =
    useState("TODOS");

    const [filtroAtivo, setFiltroAtivo] =
    useState("TODOS");

    const [filtroTipoRendimento, setFiltroTipoRendimento] =
    useState("TODOS");

    const [tipoAtivo, setTipoAtivo] =
    useState("FII");

    const [assetId, setAssetId] =
    useState("");

    const [tipoRendimento, setTipoRendimento] =
    useState("RENDIMENTO");

    const dataAtual =
        new Date()
        .toISOString()
        .split("T")[0];

    const [dataRecebimento, setDataRecebimento] =
    useState(dataAtual);

    const [valorTotal, setValorTotal] =
    useState("");

    const [filtroMes, setFiltroMes] =
    useState("TODOS");

    const totalRecebido =
        rendimentos.reduce(
            (acc, r) =>
            acc + r.valorTotal,
            0
        );

    const recebidoAcoes =
    rendimentos
        .filter(
        (r) =>
            r.asset?.tipo === "ACAO"
        )
        .reduce(
        (acc, r) =>
            acc + r.valorTotal,
        0
        );

    const recebidoFiis =
    rendimentos
        .filter(
        (r) =>
            r.asset?.tipo === "FII"
        )
        .reduce(
        (acc, r) =>
            acc + r.valorTotal,
        0
        );

    const dyMedio =
    rendimentos.length > 0
        ? rendimentos.reduce(
            (acc, r) =>
            acc + (r.dy || 0),
            0
        ) / rendimentos.length
        : 0;

    function moeda(valor: number) {
    return valor.toLocaleString(
        "pt-BR",
        {
        style: "currency",
        currency: "BRL",
        }
    );
    }

  async function carregar() {

    const [r, a] = await Promise.all([
      fetch("/api/rendimentos"),
      fetch("/api/assets"),
    ]);

    const rendimentosData =
      await r.json();

    const assetsData =
      await a.json();

    setRendimentos(
      rendimentosData
    );

    setAssets(
      assetsData
    );
  }

  async function salvar() {

    console.log("SALVAR", {
        assetId,
        tipoRendimento,
        dataRecebimento,
        valorTotal,
        });


    await fetch(
        "/api/rendimentos",
        {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

            assetId,

            tipoRendimento,

            dataRecebimento,

            valorTotal:
                parseFloat(
                    String(valorTotal)
                    .replace(",", ".")
                ),

        }),
        }
    );

    setOpen(false);

    setAssetId("");

    setValorTotal("");

    setDataRecebimento("");

    carregar();
    }

    async function excluir(
        id: string
        ) {

        if (
            !confirm(
            "Excluir rendimento?"
            )
        ) {
            return;
        }

        await fetch(
            `/api/rendimentos/${id}`,
            {
            method: "DELETE",
            }
        );

        carregar();
        }

  useEffect(() => {
    carregar();
  }, []);

  const rendimentosFiltrados =
    rendimentos.filter((r) => {

        if (
            filtroMes !== "TODOS"
            ) {

            const mesRegistro =
                new Date(
                r.dataRecebimento
                )
                .toISOString()
                .slice(0, 7);

            if (
                mesRegistro !==
                filtroMes
            ) {
                return false;
            }
        }

        if (
        filtroTipoAtivo !== "TODOS" &&
        r.asset?.tipo !==
            filtroTipoAtivo
        ) {
        return false;
        }

        if (
        filtroAtivo !== "TODOS" &&
        r.assetId !==
            filtroAtivo
        ) {
        return false;
        }

        if (
        filtroTipoRendimento !==
            "TODOS" &&
        r.tipoRendimento !==
            filtroTipoRendimento
        ) {
        return false;
        }

        return true;
    });

const nomesRendimento: Record<string, string> = {
  DIVIDENDO: "Dividendo",
  JSCP: "JSCP",
  RENDIMENTO: "Rendimento",
  OUTROS: "Outros",
};

const mesesDisponiveis = [
  ...new Set(
    rendimentos.map((r) =>
      new Date(
        r.dataRecebimento
      ).toISOString().slice(0, 7)
    )
  ),
].sort().reverse();
  
const totalMeses =
  mesesDisponiveis.length;

const mediaMensal =
  totalMeses > 0
    ? totalRecebido /
      totalMeses
    : 0;

const patrimonioInvestido =
  assets.reduce(
    (acc, asset) => {

      const valor =
        Number(
          asset.valorAtual || 0
        );

      return acc + valor;

    },
    0
  );

  const yieldOnCost =
    patrimonioInvestido > 0
        ? (
            totalRecebido *
            100
        ) /
        patrimonioInvestido
        : 0;

const resumoMensal =
  Object.values(

    rendimentos.reduce(
      (acc: any, r: any) => {

        const chave =
          new Date(
            r.dataRecebimento
          )
            .toISOString()
            .slice(0, 7);

        if (!acc[chave]) {

          acc[chave] = {

            mes: chave,

            total: 0,

            quantidade: 0,
          };
        }

        acc[chave].total +=
          r.valorTotal;

        acc[chave]
          .quantidade++;

        return acc;

      },
      {}
    )
  );

  return (

    <div className="p-8 max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Rendimentos
                </h1>

                <p className="text-gray-500">
                    Controle de dividendos, JSCP e rendimentos recebidos
                </p>

            </div>

            <button
            onClick={() => setOpen(true)}
            className="
                bg-blue-700
                text-white
                px-4
                py-2
                rounded-lg
            "
            >
            + Novo Rendimento
            </button>

        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">

            <div className="
                border
                rounded-xl
                p-4
                bg-green-50
                "
            >
                <p className="text-sm text-blue-800">
                    Total Recebido
                </p>

                <h2 className="text-2xl font-bold text-right">
                    {moeda(totalRecebido)}
                </h2>
            </div>

            <div className="border rounded-xl p-4 bg-white">

                <p className="text-sm text-blue-800">
                Recebido Ações
                </p>

                <h2 className="text-2xl font-bold text-right">
                    {moeda(recebidoAcoes)}
                </h2>

            </div>

            <div className="border rounded-xl p-4 bg-white">

                <p className="text-sm text-blue-800">
                Recebido FIIs
                </p>

                <h2 className="text-2xl font-bold text-right">
                    {moeda(recebidoFiis)}
                </h2>

            </div>

            <div className="border rounded-xl p-4 bg-white">

                <p className="text-sm text-blue-800">
                DY Médio
                </p>

                <h2 className="text-2xl font-bold text-right">
                    {dyMedio.toFixed(2)}%
                </h2>

            </div>

            <div className="border rounded-xl p-4 bg-white">

                <p className="text-sm text-blue-800">
                    Média Mensal
                </p>

                <h2 className="text-2xl font-bold text-right">
                    {moeda(mediaMensal)}
                </h2>

            </div>

            {/* -- mostrar card de DYOC

            <div className="border rounded-xl p-4 bg-white">

                <p className="text-sm text-gray-500">
                    Yield on Cost
                </p>

                <h2 className="text-2xl font-bold">
                    {yieldOnCost.toFixed(2)}%
                </h2>

            </div>
            */}
        </div>

        <div className="border rounded-xl bg-white p-4 mb-6">

            <h2 className="font-bold mb-4">
                Resumo Mensal
            </h2>

            <div className="grid md:grid-cols-4 gap-4">

                {resumoMensal.map(
                (mes: any) => (

                <div
                    key={mes.mes}
                    className="
                    border
                    rounded-lg
                    p-3
                    "
                >

                    <div className="text-sm text-gray-500">
                    {mes.mes}
                    </div>

                    <div className="font-bold">
                    {moeda(
                        mes.total
                    )}
                    </div>

                    <div className="text-xs text-gray-400">

                    {mes.quantidade}
                    {" "}
                    lançamento(s)

                    </div>

                </div>

                ))}

            </div>

        </div>

        <div className="flex gap-3 mb-6 flex-wrap">

            <select
                value={filtroMes}
                onChange={(e) =>
                    setFiltroMes(
                    e.target.value
                    )
                }
                className="border rounded-lg p-2 bg-white"
                >
                <option value="TODOS">
                    Todos os meses
                </option>

                {mesesDisponiveis.map((mes) => (

                    <option
                    key={mes}
                    value={mes}
                    >
                    {mes}
                    </option>

                ))}

            </select>

            <select
                value={filtroTipoAtivo}
                onChange={(e) =>
                setFiltroTipoAtivo(
                    e.target.value
                )
                }
                className="border rounded-lg p-2 bg-white"
            >
                <option value="TODOS">
                Todos os tipos
                </option>

                <option value="ACAO">
                Ações
                </option>

                <option value="FII">
                FIIs
                </option>

            </select>

            <select
                value={filtroAtivo}
                onChange={(e) =>
                setFiltroAtivo(
                    e.target.value
                )
                }
                className="border rounded-lg p-2 bg-white"
            >
                <option value="TODOS">
                Todos os ativos
                </option>

                {assets
                .filter(
                    (asset) =>
                    filtroTipoAtivo ===
                        "TODOS" ||
                    asset.tipo ===
                        filtroTipoAtivo
                )
                .map((asset) => (

                    <option
                    key={asset.id}
                    value={asset.id}
                    >
                    {asset.ticker}
                    </option>

                ))}

            </select>

            <select
                value={filtroTipoRendimento}
                onChange={(e) =>
                setFiltroTipoRendimento(
                    e.target.value
                )
                }
                className="border rounded-lg p-2 bg-white"
            >
                <option value="TODOS">
                Todos os rendimentos
                </option>

                <option value="DIVIDENDO">
                Dividendo
                </option>

                <option value="JSCP">
                JSCP
                </option>

                <option value="RENDIMENTO">
                Rendimento
                </option>

                <option value="OUTROS">
                Outros
                </option>

            </select>

            </div>

        {open && (

            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

                <div className="bg-white w-[600px] rounded-xl p-6">

                <h2 className="text-xl font-bold mb-6">
                    Novo Rendimento
                </h2>

                <div className="space-y-4">

                    <div>

                    <label>
                        Tipo do Ativo
                    </label>

                    <select
                        value={tipoAtivo}
                        onChange={(e) =>
                        setTipoAtivo(
                            e.target.value
                        )
                        }
                        className="w-full border rounded p-2"
                    >

                        <option value="ACAO">
                        Ação
                        </option>

                        <option value="FII">
                        FII
                        </option>

                    </select>

                    </div>

                    <div>

                    <label>
                        Ativo
                    </label>

                    <select
                        value={assetId}
                        onChange={(e) =>
                        setAssetId(
                            e.target.value
                        )
                        }
                        className="w-full border rounded p-2"
                    >

                        <option value="">
                        Selecione
                        </option>

                        {assets
                        .filter(
                            (asset) =>
                            asset.tipo ===
                            tipoAtivo
                        )
                        .map((asset) => (

                            <option
                            key={asset.id}
                            value={asset.id}
                            >
                            {asset.ticker}
                            </option>

                        ))}

                    </select>

                    </div>

                    <div>

                    <label>
                        Tipo de Rendimento
                    </label>

                    <select
                        value={tipoRendimento}
                        onChange={(e) =>
                        setTipoRendimento(
                            e.target.value
                        )
                        }
                        className="w-full border rounded p-2"
                    >

                        <option value="DIVIDENDO">
                        Dividendo
                        </option>

                        <option value="JSCP">
                        JSCP
                        </option>

                        <option value="RENDIMENTO">
                        Rendimento
                        </option>

                        <option value="OUTROS">
                        Outros
                        </option>

                    </select>

                    </div>

                    <div>

                    <label>
                        Data Recebimento
                    </label>

                    <input
                        type="date"
                        value={dataRecebimento}
                        onChange={(e) =>
                        setDataRecebimento(
                            e.target.value
                        )
                        }
                        className="w-full border rounded p-2"
                    />

                    </div>

                    <div>

                    <label>
                        Valor Total
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        value={valorTotal}
                        onChange={(e) => 
                            setValorTotal(
                            e.target.value
                            )
                        }
                        className="w-full border rounded p-2"
                        />

                    </div>

                </div>

                <div className="flex justify-end gap-2 mt-6">

                    <button
                    onClick={() =>
                        setOpen(false)
                    }
                    className="border px-4 py-2 rounded">
                    Cancelar
                    </button>

                    <button
                    onClick={salvar}
                    className="
                        bg-blue-700
                        text-white
                        px-4
                        py-2
                        rounded
                    "
                    >
                    Salvar
                    </button>

                </div>

                </div>

            </div>

            )}
        
        <div className="border rounded-xl bg-white overflow-hidden">

            <div className="mb-1 text-sm text-blue-800 p-1 text-center">

                {rendimentosFiltrados.length}
                {" "}
                lançamento(s)

            </div>
            
            <table className="w-full">

                <thead>

                <tr className="bg-slate-800 text-white">

                    <th className="p-2 text-left">
                    Ativo
                    </th>

                    <th className="p-2 text-center">
                    Tipo Rend.
                    </th>

                    <th className="p-2 text-center">
                    Tipo Ativo
                    </th>

                    <th className="p-2 text-center">
                    Data
                    </th>

                    <th className="p-2 text-center">
                    Qtd Cotas
                    </th>

                    <th className="p-2 text-center">
                    DY
                    </th>

                    <th className="p-2 text-center">
                    Valor Total
                    </th>

                    <th className="p-2 text-center">
                    Valor Unit.
                    </th>

                    <th className="p-2 text-center">
                    Ações
                    </th>

                </tr>

                </thead>

                <tbody>

                {rendimentosFiltrados.map(
                    (rendimento) => (

                    <tr
                    key={rendimento.id}
                    className="border-b"
                    >

                    <td className="p-2 font-medium">
                        {rendimento.asset?.ticker}
                    </td>

                    <td className="p-2 text-center">
                        {nomesRendimento[
                            rendimento.tipoRendimento
                            ] || rendimento.tipoRendimento}
                    </td>

                    <td className="p-2 text-center">
                        {rendimento.asset?.tipo}
                    </td>

                    <td className="p-2 text-center">

                        {new Date(
                            rendimento.dataRecebimento
                            ).toLocaleDateString(
                            "pt-BR"
                        )}

                    </td>

                    <td className="p-2 text-center">
                        {rendimento.quantidadeCotas}
                    </td>

                    <td className="p-2 text-center">
                        {Number(
                            rendimento.dy || 0
                            ).toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                            )}%
                    </td>

                    <td className="p-2 text-center">
                        {moeda(rendimento.valorTotal)}
                    </td>

                    <td className="p-2 text-center">
                        {moeda(rendimento.valorUnitario)}
                    </td>

                    <td className="p-2">

                        <div className="flex justify-center">

                        <button
                            onClick={() =>
                            excluir(
                                rendimento.id
                            )
                            }
                            className="
                            text-red-600
                            "
                        >
                            🗑️
                        </button>

                        </div>

                    </td>

                    </tr>

                ))}

                </tbody>

            </table>

            </div>
    
    
    
    
    
    
    </div>

  );
}