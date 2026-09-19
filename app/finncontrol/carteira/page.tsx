"use client";
import {
  TrendingUp,
  Building2,
  Bitcoin,
  Landmark,
  Shield,
  Folder
} from "lucide-react";

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

  function getIconeGrupo(tipo: string) {

  switch (tipo) {

    case "ACAO":
      return (
        <TrendingUp
          size={24}
          className="text-blue-600"
        />
      );

    case "FII":
      return (
        <Building2
          size={24}
          className="text-emerald-600"
        />
      );

    case "ETF":
      return (
        <TrendingUp
          size={24}
          className="text-violet-600"
        />
      );

    case "CRIPTO":
      return (
        <Bitcoin
          size={24}
          className="text-amber-500"
        />
      );

    case "TESOURO_DIRETO":
      return (
        <Landmark
          size={24}
          className="text-green-700"
        />
      );

    case "PREV_PRIVADA":
      return (
        <Shield
          size={24}
          className="text-sky-600"
        />
      );

    default:
      return (
        <Folder
          size={24}
          className="text-slate-500"
        />
      );

  }

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

        <div className="bg-white border rounded-2xl p-6 shadow-sm w-72">

          <p className="text-sm text-gray-500">
            Patrimônio Total
          </p>

          <h2 className="text-4xl font-bold">

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

      {[...dados.grupos]
        .sort((a, b) =>
          (nomesTipos[a.tipo] || a.tipo)
            .localeCompare(
              nomesTipos[b.tipo] || b.tipo,
              "pt-BR"
            )
        )
        .map(
        (grupo: any) => {

          const valorAtualGrupo =
            grupo.ativos.reduce(
              (acc: number, ativo: any) =>
                acc + ativo.valorAtual,
              0
            );

          const lucroGrupo =
            valorAtualGrupo -
            grupo.totalInvestido;

          const variacaoGrupo =
            grupo.totalInvestido > 0
              ? (
                  (
                    valorAtualGrupo -
                    grupo.totalInvestido
                  ) /
                  grupo.totalInvestido
                ) * 100
              : 0;
      
      return (
          
        <div
          key={grupo.tipo}
          className="
            border
            border-slate-200
            rounded-2xl
            mb-4
            bg-white
            shadow-sm
          "
        >

          <button
            onClick={() =>
              toggle(grupo.tipo)
            }
            className="
              w-full
              px-6
              py-5
              flex
              items-center
              justify-between
              hover:bg-slate-50
              transition
            "
          >

            {/* Lado Esquerdo */}

            <div className="flex items-center gap-4 w-[320px]">

              <div
                className="
                  h-12
                  w-12
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >
                {getIconeGrupo(grupo.tipo)}
              </div>


              <div>

                <h2 className="font-bold text-xl text-left">
                  {nomesTipos[grupo.tipo] || grupo.tipo}
                </h2>

              </div>

            </div>

            {/* Indicadores */}

            <div
              className="
                grid
                grid-cols-[120px_130px_130px_130px_130px_30px]
                items-right
                text-right
                gap-4
              "
            >

              <div className="w-[120px]">

                <div className="text-xs text-slate-500">
                  Ativos
                </div>

                <div className="font-semibold text-lg">
                  {grupo.quantidadeAtivos}
                </div>

              </div>

              <div className="w-[150px]">

                  <div className="text-xs text-slate-500">
                  Valor Atual
                  </div>

                  <div className="font-semibold text-lg">
                    {moeda(valorAtualGrupo)}
                  </div>

              </div>

              <div className="w-[150px]">

                <div className="text-xs text-slate-500">
                  Variação
                </div>

                <div
                  className={
                    variacaoGrupo >= 0
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-red-600"
                  }
                >
                 {
                    variacaoGrupo >= 0
                      ? `▲ ${variacaoGrupo.toFixed(2)}%`
                      : `▼ ${variacaoGrupo.toFixed(2)}%`
                  }
                </div>

              </div>

              <div className="w-[150px]">

                <div className="text-xs text-slate-500">
                  Lucro/Prejuízo
                </div>

                <div
                  className={
                    lucroGrupo >= 0
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {
                    lucroGrupo >= 0
                      ? `▲ ${moeda(lucroGrupo)}`
                      : `▼ ${moeda(lucroGrupo)}`
                  }

                </div>

              </div>

              <div className="w-[100px]">

                <div className="text-xs text-slate-500">
                  % Carteira
                </div>

                <div className="font-semibold text-lg">
                  {grupo.peso.toFixed(2)}%
                </div>

              </div>

              <div
                className="
                  h-10
                  w-10
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >
                {abertos[grupo.tipo]
                  ? "▼"
                  : "▶"
                }
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

      );
    
    })}

    </div>
  );
}