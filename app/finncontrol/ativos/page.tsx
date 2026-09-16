"use client";

import { useEffect, useState } from "react";

interface Asset {
  id: string;
  ticker: string;
  nome: string;
  tipo: string;
  setor?: string;
  segmento?: string;
  goal?: string;
  valorAtual?: number;
  ultimaAtualizacao?: string;
  ativo: boolean;
}
export default function AtivosPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ticker, setTicker] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("ACAO");
  const [ativo, setAtivo] = useState(true);
  const [setor, setSetor] = useState("");
  const [segmento, setSegmento] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [gruposAbertos, setGruposAbertos] = useState<Record<string, boolean>>({});
  const [goal, setGoal] = useState("");

  async function loadAssets() {
    const response = await fetch("/api/assets");
    const data = await response.json();

    setAssets(data);
  }

  useEffect(() => {
    loadAssets();
  }, []);

  async function buscarTicker() {
    if (!ticker) return;

    try {

      const response = await fetch(
        `/api/assets/search?ticker=${ticker.toUpperCase()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setNome(data.nome || "");

      setSetor(data.setor || "");

      setSegmento(data.segmento || "");

      setValorAtual(
        String(data.valorAtual || "")
      );

    } catch (error) {

      console.error(error);

      alert(
        "Não foi possível consultar o ativo."
      );
    }
  }

  async function salvar() {
    const payload = {
      ticker,
      nome,
      tipo,
      ativo,
      setor,
      segmento,
      valorAtual:
        Number(valorAtual) || null,
    };

    if (editingId) {
      await fetch(`/api/assets/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    fecharModal();
    loadAssets();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir ativo?")) return;

    await fetch(`/api/assets/${id}`, {
      method: "DELETE",
    });

    loadAssets();
  }

  function editar(asset: Asset) {
    setEditingId(asset.id);
    setTicker(asset.ticker);
    setNome(asset.nome);
    setTipo(asset.tipo);
    setSetor(asset.setor || "");
    setSegmento(asset.segmento || "");
    setValorAtual(
      asset.valorAtual
        ? String(asset.valorAtual)
        : ""
    );
    setAtivo(asset.ativo);
    setOpen(true);
  }

  function fecharModal() {
    setEditingId(null);
    setTicker("");
    setNome("");
    setTipo("ACAO");
    setSetor("");
    setSegmento("");
    setValorAtual("");
    setAtivo(true);
    setOpen(false);
  }

  const ativosAgrupados =
    assets.reduce(
      (acc: Record<string, any[]>, asset) => {

        if (!acc[asset.tipo]) {
          acc[asset.tipo] = [];
        }

        acc[asset.tipo].push(asset);

        return acc;

      },
      {}
    );

  const nomesTipos: Record<string, string> = {
      ACAO: "Ações",
      FII: "Fundos Imobiliários",
      ETF: "ETFs",
      CRIPTO: "Criptomoedas",
      FUNDO_INVESTIMENTO: "Fundos Investimento",
      TESOURO_DIRETO: "Tesouro Direto",
      PREV_PRIVADA: "Previdência Privada",
  };

  function toggleGrupo(tipo: string) {
      setGruposAbertos((prev) => ({
        ...prev,
          [tipo]: !prev[tipo],
      }));
    }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Ativos
          </h1>

          <p className="text-gray-500">
            Cadastro dos ativos da sua carteira
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Novo Ativo
        </button>

      </div>

      {Object.entries(ativosAgrupados).map(
          ([tipo, ativos]) => (

            <div
              key={tipo}
              className="border rounded-xl mb-4 bg-white"
            >

              <button
                onClick={() => toggleGrupo(tipo)}
                className="
                  w-full
                  p-4
                  flex
                  justify-between
                  items-center
                "
              >

                <div className="flex gap-3 items-center">

                  <span>
                    {gruposAbertos[tipo]
                      ? "▼"
                      : "▶"}
                  </span>

                  <h2 className="font-bold text-xl">

                    {nomesTipos[tipo] || tipo}

                  </h2>

                </div>

                <div className="text-sm text-gray-500">

                  {ativos.length} ativo(s)

                </div>

              </button>

              {gruposAbertos[tipo] && (

                <div className="border-t overflow-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b bg-gray-50">

                        <th className="p-3 text-left">
                          Ticker
                        </th>

                        <th className="p-3 text-left">
                          Nome
                        </th>

                        <th className="p-3 text-left">
                          Setor/Segmento
                        </th>

                        <th className="p-3 text-right">
                          Valor Atual
                        </th>

                        <th className="p-3 text-left">
                          Atualizado
                        </th>

                        <th className="p-3 text-left">
                          Status
                        </th>

                        <th className="p-3">
                          Ações
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {ativos.map((asset) => (

                        <tr
                          key={asset.id}
                          className="border-b"
                        >

                          <td className="p-3">
                            {asset.ticker}
                          </td>

                          <td className="p-3">
                            {asset.nome}
                          </td>

                          <td className="p-3">
                            {asset.setor ||
                            asset.segmento ||
                            "-"}
                          </td>

                          <td className="p-3 text-right">

                            {asset.valorAtual
                              ? asset.valorAtual.toLocaleString(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                )
                              : "-"}
                          </td>

                          <td className="p-3">
                            {asset.ultimaAtualizacao
                              ? new Date(
                                  asset.ultimaAtualizacao
                                ).toLocaleString(
                                  "pt-BR"
                                )
                              : "-"}
                          </td>

                          <td className="p-3">

                            <span className="bg-black text-white px-2 py-1 rounded text-xs">

                              {asset.ativo
                                ? "Ativo"
                                : "Inativo"}

                            </span>

                          </td>

                          <td className="p-3">

                            <div className="flex gap-2 justify-center">

                              <button
                                onClick={() =>
                                  editar(asset)
                                }
                              >
                                ✏️
                              </button>

                              <button
                                onClick={() =>
                                  excluir(asset.id)
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

              )}

            </div>

          )
        )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white w-[500px] rounded-lg p-6">

            <h2 className="text-xl font-bold mb-4">
              {editingId
                ? "Editar Ativo"
                : "Novo Ativo"}
            </h2>

            <div className="space-y-4">

              <div>

                <label>
                  Ticker
                </label>

                <div className="flex gap-2">

                  <input
                    value={ticker}
                    onChange={(e) =>
                      setTicker(e.target.value)
                    }
                    className="flex-1 border rounded p-2"
                  />

                  <button
                    type="button"
                    onClick={buscarTicker}
                    className="bg-blue-600 text-white px-4 rounded"
                  >
                    Consultar
                  </button>

                </div>

              </div>

              <div>

                <label>
                  Nome
                </label>

                <input
                  value={nome}
                  onChange={(e) =>
                    setNome(e.target.value)
                  }
                  className="w-full border rounded p-2"
                />

              </div>

              <div>

                <label>
                  Valor Atual
                </label>

                <input
                  value={valorAtual}
                  onChange={(e) =>
                    setValorAtual(e.target.value)
                  }
                  className="w-full border rounded p-2"
                />

              </div>

              <div className="grid grid-cols-2 gap-2">

                <div>

                  <label>
                    Tipo
                  </label>

                  <select
                    value={tipo}
                    onChange={(e) =>
                      setTipo(e.target.value)
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="ACAO">Ação</option>
                    <option value="FII">FII</option>
                    <option value="CRIPTO">Cripto</option>
                    <option value="ETF">ETF</option>
                    <option value="FUNDO_INVESTIMENTO">Fundo Investimento</option>
                    <option value="TESOURO_DIRETO">Tesouro Direto</option>
                    <option value="PREV_PRIVADA">Previdência Privada</option>
                  </select>

                </div>

                {tipo === "ACAO" && (
                  <div>

                    <label>
                      Setor
                    </label>

                    <input
                      value={setor}
                      onChange={(e) =>
                        setSetor(e.target.value)
                      }
                      className="w-full border rounded p-2"
                    />

                  </div>

                  )}

                  {tipo === "ACAO" && (
                    <div>
                      <label>
                        Objetivo
                      </label>

                      <select
                        value={goal}
                        onChange={(e) =>
                          setGoal(
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          border
                          rounded-lg
                          p-2
                        "
                      >

                        <option value="PREVIDENCIARIA">
                          Previdenciária
                        </option>

                        <option value="VALORIZACAO">
                          Valorização
                        </option>

                      </select>

                    </div>
                    )}

                  {tipo === "FII" && (

                    <div>

                      <label>
                        Segmento
                      </label>

                      <input
                        value={segmento}
                        onChange={(e) =>
                          setSegmento(e.target.value)
                        }
                        className="w-full border rounded p-2"
                      />

                    </div>

                    )}

              </div>

              <div>

                <label>
                  Status
                </label>

                <select
                  value={
                    ativo ? "true" : "false"
                  }
                  onChange={(e) =>
                    setAtivo(
                      e.target.value === "true"
                    )
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="true">
                    A — Ativo
                  </option>

                  <option value="false">
                    I — Inativo
                  </option>
                </select>

              </div>

            </div>

            <div className="flex justify-end gap-2 mt-6">

              <button
                onClick={fecharModal}
                className="border px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="bg-black text-white px-4 py-2 rounded"
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