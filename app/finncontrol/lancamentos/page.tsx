"use client";

import { useEffect, useState } from "react";

interface Asset {
  id: string;
  ticker: string;
  nome: string;
  tipo: string;
}

interface Transaction {
  id: string;
  assetId: string;
  tipoOperacao: "COMPRA" | "VENDA";
  dataOperacao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;

  asset: Asset;

  posicao: {
    totalCotas: number;
    precoMedio: number;
    diferencaPm: number;
  };
}

export default function LancamentosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [assetId, setAssetId] = useState("");
  const [tipoOperacao, setTipoOperacao] =
    useState<"COMPRA" | "VENDA">("COMPRA");

  const dataAtual =
    new Date()
      .toISOString()
      .split("T")[0];  

  const [dataOperacao, setDataOperacao] = useState(dataAtual);
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const [tipoAtivo, setTipoAtivo] = useState("ACAO");

  const total =
    (Number(quantidade) || 0) *
    (Number(valorUnitario) || 0);

  async function loadTransactions() {
    const response = await fetch(
      "/api/asset-transactions/position"
    );

    const data = await response.json();

    //console.log(data);

    setTransactions(data);
  }

  async function loadAssets() {
    const response = await fetch("/api/assets");

    const data = await response.json();

    setAssets(data);
  }

  useEffect(() => {
    loadTransactions();
    loadAssets();
  }, []);

  function resetForm() {
    setEditingId(null);
    setAssetId("");
    setTipoOperacao("COMPRA");
    setDataOperacao("");
    setQuantidade("");
    setValorUnitario("");
    setOpen(false);
  }

  async function salvar() {
    const payload = {
      assetId,
      tipoOperacao,
      dataOperacao,
      quantidade,
      valorUnitario,
    };

    if (editingId) {
      await fetch(
        `/api/asset-transactions/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } else {
      await fetch("/api/asset-transactions", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadTransactions();
  }

  function editar(tx: Transaction) {
    setEditingId(tx.id);

    setAssetId(tx.assetId);
    setTipoOperacao(tx.tipoOperacao);
    setDataOperacao(
      tx.dataOperacao.substring(0, 10)
    );
    setQuantidade(
      tx.quantidade.toString()
    );
    setValorUnitario(
      tx.valorUnitario.toString()
    );

    setOpen(true);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir lançamento?"))
      return;

    await fetch(
      `/api/asset-transactions/${id}`,
      {
        method: "DELETE",
      }
    );

    loadTransactions();
  }

  //console.log(transactions);

  const valorTotalCalculado =
    (Number(quantidade) || 0) *
    (Number(
      String(valorUnitario)
        .replace(",", ".")
    ) || 0);

  function moeda(valor: number) {
    return valor.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Lançamentos
          </h1>

          <p className="text-gray-500">
            Compras e vendas
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Novo Lançamento
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-50 border-b">
              
              <th className="p-3 text-left">
                Ativo
              </th>

              <th className="p-3 text-center">
                Operação
              </th>

              <th className="p-3 text-center">
                Data
              </th>

              <th className="p-3 text-center">
                Quantidade
              </th>

              <th className="p-3 text-center">
                Valor Unit.
              </th>

              <th className="p-3 text-center">
                Total
              </th>

              <th className="p-3 text-center">
                Total Cotas
              </th>
              
              <th className="p-3 text-center">
                PM Pós
              </th>
              
              <th className="p-3 text-center">
                Dif PM
              </th>

              <th className="p-3">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b"
              >
                <td className="p-3">
                  {tx.asset.ticker}
                </td>

                <td className="p-3 text-center">
                  {tx.tipoOperacao}
                </td>

                <td className="p-3 text-center">
                  {new Date(
                    tx.dataOperacao
                  ).toLocaleDateString()}
                </td>

                <td className="p-3 text-center">
                  {tx.quantidade}
                </td>

                <td className="p-3 text-center">
                  {moeda(tx.valorUnitario)}

                </td>

                <td className="p-3 text-center">
                  {moeda(tx.valorTotal)}
                </td>

                <td className="p-3 text-center">
                  {tx.posicao.totalCotas}
                </td>

                <td className="p-3 text-center">
                  {moeda(tx.posicao.precoMedio)}
                </td>

                <td className="p-3 text-center">
                  {tx.posicao.diferencaPm >0 ? "+" : "-"}
                  {moeda(Math.abs(tx.posicao.diferencaPm))}
                </td>

                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        editar(tx)
                      }
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        excluir(tx.id)
                      }
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

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg w-[500px] p-6">

            <h2 className="text-xl font-bold mb-4">
              {editingId
                ? "Editar Lançamento"
                : "Novo Lançamento"}
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-6">

              <button
                type="button"
                onClick={() =>
                  setTipoOperacao("COMPRA")
                }
                className={`
                  py-3
                  rounded-xl
                  border
                  font-medium
                  transition

                  ${
                    tipoOperacao === "COMPRA"
                      ? "bg-white border-emerald-500 shadow"
                      : "bg-slate-100"
                  }
                `}
              >
                Compra
              </button>

              <button
                type="button"
                onClick={() =>
                  setTipoOperacao("VENDA")
                }
                className={`
                  py-3
                  rounded-xl
                  border
                  font-medium
                  transition

                  ${
                    tipoOperacao === "VENDA"
                      ? "bg-white border-red-500 shadow"
                      : "bg-slate-100"
                  }
                `}
              >
                Venda
              </button>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {/* Tipo Ativo */}

              <div>

                <label
                  className="
                    block
                    mb-1
                    text-sm
                    font-medium
                  "
                >
                  Tipo de Ativo
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
                  <option value="ACAO">Ação</option>
                  <option value="FII">FII</option>
                  <option value="ETF">ETF</option>
                  <option value="CRIPTO">Cripto</option>
                  <option value="FUNDO_INVESTIMENTO">Fundo Investimento</option>
                  <option value="TESOURO_DIRETO">Tesouro Direto</option>
                  <option value="PREV_PRIVADA">Previdência Privada</option>
                </select>
              </div>

              {/* Ativo */}

              <div>

                <label
                  className="
                    block
                    mb-1
                    text-sm
                    font-medium
                  "
                >
                  Ativo
                </label>

                <select
                  value={assetId}
                  onChange={(e) =>
                    setAssetId(e.target.value)
                  }
                  className="w-full border rounded p-2"
                  >
                  <option value="">
                    Selecione o ativo
                  </option>

                  {assets
                    .filter(
                    (asset) =>
                      asset.tipo === tipoAtivo
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

            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">

                {/* Data */}

                <div>

                  <label
                    className="
                      block
                      mb-1
                      text-sm
                      font-medium
                    "
                  >
                    Data
                  </label>

                  <input
                    type="date"
                    value={dataOperacao}
                    onChange={(e) =>
                      setDataOperacao(
                      e.target.value
                      )
                    }
                    className="
                        w-full
                        border
                        border-slate-300
                        rounded-xl
                        p-3
                        text-lg
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />
                </div>

            </div>

           <div className="grid md:grid-cols-2 gap-4 mt-4">
          
              {/* Quantidade */}

               {/* Quantidade */}

                <div>

                  <label
                    className="
                      block
                      mb-1
                      text-sm
                      font-medium
                    "
                  >
                    Quantidade
                  </label>

                  <input
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={(e) =>
                      setQuantidade(
                      e.target.value
                      )
                    }
                    className="
                        w-full
                        border
                        border-slate-300
                        rounded-xl
                        p-3
                        text-lg
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />
                </div>
                
              <div>

              <label
                className="
                  block
                  mb-1
                  text-sm
                  font-medium
                "
              >
                Valor Unitário
              </label>

              <input
                placeholder="Valor Unitário"
                value={valorUnitario}
                onChange={(e) =>
                  setValorUnitario(
                  e.target.value
                  )
                }
                className="
                    w-full
                    border
                    border-slate-300
                    rounded-xl
                    p-3
                    text-lg
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />
                </div>
          </div> 

          <div
            className="
              mt-6
              rounded-xl
              bg-slate-100
              p-4
              flex
              justify-between
              items-center
            "
          >

            <span
              className="
                font-semibold
                text-lg
              "
            >
              Valor Total
            </span>

            <span
              className="
                text-2xl
                font-bold
              "
            >
              {moeda(valorTotalCalculado)}
            </span>

          </div>

          <div
            className="
              mt-6
              flex
              justify-end
              gap-3
            "
          >

            <button
              type="button"
              onClick={resetForm}
              className="
                px-4
                py-2
                border
                rounded-xl
              "
            >
              Cancelar
            </button>

            <button
              onClick={salvar}
              className="
                px-5
                py-2
                rounded-xl
                bg-slate-900
                text-white
              "
            >
              Salvar
            </button>

          </div>

          </div>

        </div>
      )}

    </div>
  );
}