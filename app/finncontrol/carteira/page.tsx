"use client";

import {
  useEffect,
  useState,
} from "react";

export default function CarteiraPage() {

  const [dados, setDados] =
    useState<any>(null);

  const [abertos, setAbertos] =
    useState<Record<string, boolean>>(
      {}
    );

useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const response =
      await fetch("/api/carteira");

    const data =
      await response.json();

    setDados(data);
  }

  function toggle(tipo: string) {

    setAbertos((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));

  }

  if (!dados) {

    return (
      <div className="p-8">
        Carregando...
      </div>
    );
  }

  const nomesTipos: Record<string, string> = {
    ACAO: "Ações",
    FII: "Fundos Imobiliários",
    ETF: "ETFs",
    CRIPTO: "Criptomoedas",
    FUNDO_INVESTIMENTO: "Fundos de Investimento",
    TESOURO_DIRETO: "Tesouro Direto",
    PREV_PRIVADA: "Previdência Privada",
  };

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

  async function atualizarCotacoes() {

    //console.log("BOTAO CLICADO");

    const response =
      await fetch(
        "/api/cotacoes/atualizar",
        {
          method: "POST",
        }
      );

    if (!response.ok) {

      alert(
        "Erro ao atualizar cotações."
      );

      return;
    }

    await carregar();

    alert(
      "Cotações atualizadas com sucesso."
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold">
        Minha Carteira
      </h1>

      <p className="text-gray-500">
        Patrimônio Consolidado
      </p>

    <div className="flex justify-end">
      <button
        onClick={atualizarCotacoes}
        className="
          mb-6
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-lg
        "
      >
        Atualizar Cotações
      </button>
    </div>
      <div className="mt-4 mb-8">

        <div className="bg-white border rounded-xl p-4 w-fit">

          <p className="text-sm text-gray-500">
            Patrimônio Total
          </p>

          <h2 className="text-2xl font-bold">

            {dados.patrimonioTotal.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}

          </h2>

        </div>

      </div>

      {dados.grupos.map(
        (grupo: any) => (

        <div
          key={grupo.tipo}
          className="border rounded-xl mb-4 bg-white"
        >

          <button
            onClick={() =>
              toggle(grupo.tipo)
            }
            className="w-full p-4 flex justify-between"
          >

            <div>

             <div className="flex items-center gap-3">
                <span className="text-lg">
                    {abertos[grupo.tipo] ? "▼" : "▶"}
                </span>

                <h2 className="font-bold text-xl">
                    {nomesTipos[grupo.tipo] || grupo.tipo}
                </h2>

             </div>

            </div>

            <div className="flex gap-8">

              <div>

                <div className="text-xs text-gray-500">
                  Ativos
                </div>

                <div>
                  {grupo.quantidadeAtivos}
                </div>

              </div>

              <div>

                <div className="text-xs text-gray-500">
                  Valor
                </div>

                <div>
                  {moeda(grupo.totalInvestido)}
                </div>

              </div>

              <div>

                <div className="text-xs text-gray-500">
                  Peso
                </div>

                <div>
                  {grupo.peso.toFixed(2)}%
                </div>

              </div>

            </div>

          </button>

          {abertos[grupo.tipo] && (

            <div className="border-t">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50">

                    <th className="p-3 text-left">
                      Ativo
                    </th>

                    <th className="p-3 text-center">
                      Quantidade
                    </th>

                    <th className="p-3 text-center">
                      PM
                    </th>

                    <th className="p-3 text-center">
                      Cotação
                    </th>

                    <th className="p-3 text-center">
                      Investido
                    </th>

                    <th className="p-3 text-center">
                      Atual
                    </th>

                    <th className="p-3 text-center">
                      Resultado
                    </th>

                    <th className="p-3 text-center">
                      Rentab.
                    </th>

                    <th className="p-3 text-center">
                      Peso
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {grupo.ativos.map(
                    (ativo: any) => (

                    <tr
                      key={ativo.id}
                      className="border-t"
                    >

                      <td className="p-3">
                        {ativo.ticker}
                      </td>

                      <td className="p-3 text-center">
                        {ativo.quantidadeAtual}
                      </td>

                      <td className="p-3 text-center">

                        {ativo.precoMedio.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}

                      </td>

                      <td className="p-3 text-center">

                        {ativo.valorAtualCotacao.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}

                      </td>

                      <td className="p-3 text-center">

                        {ativo.valorInvestido.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}

                      </td>

                      <td className="p-3 text-center">

                        {ativo.valorAtual.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}

                      </td>

                      <td
                        className={`p-3 text-center ${
                          ativo.resultado >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >

                        {ativo.resultado.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}

                      </td>

                      <td
                        className={`p-3 text-center ${
                          ativo.rentabilidade >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >

                        {ativo.rentabilidade.toFixed(2)}%

                      </td>

                      

                      <td className="p-3 text-center">

                        {(
                          ativo.valorInvestido *
                          100 /
                          dados.patrimonioTotal
                        ).toFixed(2)}
                        %

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      ))}

    </div>
  );
}