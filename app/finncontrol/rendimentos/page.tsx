"use client";

import GraficoEvolucao from "@/components/rendimentos/GraficoEvolucao";
import { useEffect, useState } from "react";
import { XAxis } from "recharts";

export default function RendimentosPage() {

    const [rendimentos, setRendimentos] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [filtroTipoAtivo, setFiltroTipoAtivo] =useState("TODOS");
    const [filtroAtivo, setFiltroAtivo] = useState("TODOS");
    const [filtroTipoRendimento, setFiltroTipoRendimento] = useState("TODOS");
    const [tipoAtivo, setTipoAtivo] = useState("FII");
    const [assetId, setAssetId] = useState("");
    const [tipoRendimento, setTipoRendimento] = useState("RENDIMENTO");
    const dataAtual = new Date().toISOString().split("T")[0];
    const [dataRecebimento, setDataRecebimento] = useState(dataAtual);
    const [valorTotal, setValorTotal] = useState("");
    const [carteira, setCarteira] = useState<any>(null);
    
    const [filtroMes, setFiltroMes] =
        useState(
            `${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
            ).padStart(2, "0")}`
    );

    const totalRecebido =
        rendimentos.reduce(
            (acc, r) =>
            acc + r.valorTotal,
            0
        );

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

    const [r, a, c] = await Promise.all([
      fetch("/api/rendimentos"),
      fetch("/api/assets"),
      fetch("/api/carteira")
    ]);

    const rendimentosData =
      await r.json();

    const assetsData =
      await a.json();

    const carteiraData =
        await c.json();
        
    setRendimentos(
      rendimentosData
    );

    setAssets(
      assetsData
    );

    setCarteira(
        carteiraData
    );

    //console.log(assets);
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

    const totalRecebidoFiltro =
        rendimentosFiltrados.reduce(
            (acc, item) =>
            acc + item.valorTotal,
            0
        );

  const recebidoAcoes =
    rendimentosFiltrados
        .filter(
        (item) =>
            item.asset.tipo === "ACAO"
        )
        .reduce(
        (acc, item) =>
            acc + item.valorTotal,
        0
        );

  const recebidoFiis =
    rendimentosFiltrados
        .filter(
        (item) =>
            item.asset.tipo === "FII"
        )
        .reduce(
        (acc, item) =>
            acc + item.valorTotal,
        0
        );


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

const hoje = new Date();

const mesAtual = hoje.getMonth() + 1;
const anoAtual = hoje.getFullYear();

const rendimentosMedia =
  rendimentos.filter((r) => {

    const data =
      new Date(r.dataRecebimento);

    return !(
      data.getMonth() + 1 === mesAtual &&
      data.getFullYear() === anoAtual
    );

});

const totalRecebidoMedia =
  rendimentosMedia.reduce(
    (acc, item) =>
      acc + Number(item.valorTotal),
    0
  );

const mesesUnicos =
  new Set(
    rendimentosMedia.map((item) => {

      const data =
        new Date(item.dataRecebimento);

      return `${data.getFullYear()}-${data.getMonth() + 1}`;

    })
);
  
const totalMeses = mesesDisponiveis.length;

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

  const historicoAnual =
    rendimentos.reduce(
        (acc: any, r: any) => {

        const data =
            new Date(
            r.dataRecebimento
            );

        const ano =
            data.getFullYear();

        const mes =
            data.getMonth();

        if (!acc[ano]) {

            acc[ano] = {
            ano,

            meses: Array(12).fill(0),

            total: 0,
            };

        }

        acc[ano].meses[mes] +=
            r.valorTotal;

        acc[ano].total +=
            r.valorTotal;

        return acc;

        },

        {}
    );

    const historicoTabela =
        Object.values(
            historicoAnual
        )
        .sort(
            (a: any, b: any) =>
            b.ano - a.ano
        );

  const evolucaoMensal =
    resumoMensal
        .sort(
        (a: any, b: any) =>
            a.mes.localeCompare(
            b.mes
            )
        )
        .slice(-12);

    const totalRecebido12Meses =
        evolucaoMensal.reduce(
        (acc: number, mes: any) =>
            acc + mes.total,
        0
        );

    const mediaMensal =
        evolucaoMensal.length > 0
            ? totalRecebido12Meses /
            evolucaoMensal.length
            : 0;

  function formatarMes(
    referencia: string
    ) {

    const [ano, mes] =
        referencia.split("-");

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    return `${meses[Number(mes) - 1]}/${ano}`;

    }

    const dadosGrafico =
        evolucaoMensal.map(
            (item: any) => {

            const [
                ano,
                mes,
            ] = item.mes.split("-");

            const meses = [
                "Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez",
            ];

            return {
                mes:
                    `${meses[
                    Number(mes) - 1
                    ]}/${ano.slice(-2)}`,
                valor:
                    item.total,
                media: 
                    mediaMensal,
                };

            }
        );
    const rendimentosFiisMes =
        rendimentos.filter(
            (r) => {

            const data =
                new Date(
                r.dataRecebimento
                );

            return (
                r.asset?.tipo === "FII" &&
                data.getMonth() + 1 === mesAtual &&
                data.getFullYear() === anoAtual
            );

            }
        );

    const totalRendimentosFiisMes =
        rendimentosFiisMes.reduce(
            (acc, item) =>
            acc + item.valorTotal,
            0
        );

    const tickersFiisMes =
        [
            ...new Set(
            rendimentosFiisMes.map(
                (r) =>
                r.asset?.ticker
            )
            ),
        ];

    const fiisCarteira =
    (
        carteira?.grupos?.find(
        (g: any) =>
            g.tipo === "FII"
        )?.ativos ?? []
    ).filter(
        (ativo: any) =>
        tickersFiisMes.includes(
            ativo.ticker
        )
    );
        
    const baseInvestidaFiis =
        fiisCarteira.reduce(
            (
            acc: number,
            ativo: any
            ) =>
            acc +
            (
                Number(
                ativo.quantidadeAtual
                ) *
                Number(
                ativo.precoMedio
                )
            ),
            0
        );

    const dyMesFiis =
        baseInvestidaFiis > 0
            ? (
                totalRendimentosFiisMes *
                100
            ) /
            baseInvestidaFiis
            : 0;

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

        <div
            className="
                grid
                lg:grid-cols-4
                gap-6
                mb-8
            "
        >

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    p-6
                    h-full
                "
            >
                <h2
                    className="
                        text-xl
                        font-semibold
                        mb-6
                    "
                    >
                    Resumo
                </h2>


            <div className="mb-6">

                <div className="text-sm text-slate-500">
                    Média Mensal (12 Meses)
                </div>

                <div className="text-3xl text-right font-bold">

                    {moeda(mediaMensal)}

                </div>

            </div>

            <div className="mb-6">

                <div className="text-sm text-slate-500">
                    Total Recebido (12 Meses)
                </div>

                <div className="text-2xl text-right font-semibold">
                    {moeda(totalRecebido12Meses)}
                </div>

            </div>

            <div className="mb-6">

                <div className="text-sm text-slate-500">
                    Recebido Ações (Mês)
                </div>

                <div className="text-xl text-right font-medium">

                    {moeda(recebidoAcoes)}

                </div>

            </div>

            <div className="mb-6">

                <div className="text-sm text-slate-500">
                    Recebido FIIs (Mês)
                </div>

                <div className="text-xl text-right font-medium">

                    {moeda(recebidoFiis)}

                </div>
            </div>

            <div className="mb-6">

                <div className="text-sm text-slate-500">
                    DY FIIs (Mês)
                </div>

                <div className="text-xl text-xl
                    font-bold
                    text-green-600
                    text-right font-medium">

                   {dyMesFiis.toFixed(2)}%

                </div>
            </div>
        </div>                
    

        <div
            className="
                lg:col-span-3
                bg-white
                rounded-xl
                border
                p-6
            "
            >
                
            <GraficoEvolucao
                dados={dadosGrafico}
                media={mediaMensal}
            />

        </div>

        </div>

        <div
            className="
                bg-white
                border
                rounded-xl
                overflow-hidden
                mb-8
            "
            >

            <div className="p-4">

                <h2
                className="
                    text-xl
                    font-semibold
                "
                >
                Histórico Mensal
                </h2>

            </div>

            <table
                className="
                w-full
                text-sm
                text-center
                "
            >

                <thead>

                <tr
                    className="
                    bg-slate-100
                    border-t
                    "
                >

                    <th
                        className="
                            p-3
                            text-center
                            whitespace-nowrap
                        "
                        >
                    Ano
                    </th>

                    <th>Jan</th>
                    <th>Fev</th>
                    <th>Mar</th>
                    <th>Abr</th>
                    <th>Mai</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Ago</th>
                    <th>Set</th>
                    <th>Out</th>
                    <th>Nov</th>
                    <th>Dez</th>

                    <th
                        className="
                            bg-blue-50
                            text-blue-700
                            font-semibold
                        "
                        >
                        Média
                        </th>

                    <th
                        className="
                            bg-green-50
                            text-green-700
                            font-semibold
                        "
                        >
                        Total
                        </th>

                </tr>

                </thead>

                <tbody>

                {historicoTabela.map(
                    (linha: any) => {

                    const mesesComValor =
                        linha.meses.filter(
                        (valor: number) =>
                            valor > 0
                        ).length;

                    const media =
                        mesesComValor > 0
                        ? linha.total /
                            mesesComValor
                        : 0;

                    return (

                        <tr
                        key={linha.ano}
                        className="border-t"
                        >

                        <td
                            className="
                            p-3
                            font-bold
                            "
                        >
                            {linha.ano}
                        </td>

                        {linha.meses.map(
                            (
                            valor: number,
                            index: number
                            ) => (

                            <td
                                key={index}
                                className={`
                                    p-3
                                    text-center
                                    whitespace-nowrap
                                    ${
                                    valor === 0
                                        ? "text-slate-300"
                                        : ""
                                    }
                                `}
                                >

                                {valor.toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                                )}

                            </td>

                            )
                        )}

                        <td
                            className="
                                text-center
                                font-semibold
                                bg-blue-50
                                text-blue-700
                            "
                            >

                            {media.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                            )}

                        </td>

                        <td
                            className="
                                text-center
                                font-bold
                                bg-green-50
                                text-green-700
                            "
                            >


                            {linha.total.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                            )}

                        </td>

                        </tr>

                    );

                    }
                )}

                </tbody>

            </table>

            </div>

        <div className="flex gap-3 justify-center mb-6 flex-wrap">

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