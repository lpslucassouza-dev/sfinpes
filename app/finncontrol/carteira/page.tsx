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

  const [campoOrdenacao, setCampoOrdenacao] =
    useState("ticker");

  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<"asc" | "desc">("asc");

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

  function valor(valor: number) {

    return valor.toLocaleString(
      "pt-BR",
      {
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

function ordenar(
    campo: string
  ) {

    if (
      campo === campoOrdenacao
    ) {

      setDirecaoOrdenacao(
        direcaoOrdenacao === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setCampoOrdenacao(campo);

      setDirecaoOrdenacao("asc");

    }

  }

  const totalInvestido =
    dados.grupos.reduce(
      (acc: number, grupo: any) =>
        acc + grupo.totalInvestido,
      0
    );

  const lucroTotal =
    dados.patrimonioTotal -
    totalInvestido;

  const rentabilidadeTotal =
    totalInvestido > 0
      ? (
          lucroTotal * 100
        ) / totalInvestido
      : 0;
  
  const lucroPositivo =
    lucroTotal > 0
      ? lucroTotal
      : 0;

    const prejuizoTotal =
    lucroTotal < 0
      ? Math.abs(lucroTotal)
      : 0;

  const proventos12m =
    dados.indicadores?.proventos12m ?? 0;

  const mediaMensal =
    dados.indicadores?.mediaMensal ?? 0;

  const ultimoMes =
    dados.indicadores?.ultimoMes ?? 0;


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
      <div
        className="
          mt-4
          mb-8
          flex
          gap-4
          flex-wrap
        "
      >


        <div
          className="
            bg-white
            border
            rounded-2xl
            p-6
            shadow-sm
            w-[380px]
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >
            <span>💰</span>

            <p className="text-sm text-gray-500">
              Patrimônio Total
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <h2 className="text-4xl font-bold">

              {dados.patrimonioTotal.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}

            </h2>

            <span
              className={
                rentabilidadeTotal >= 0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >

              {rentabilidadeTotal >= 0
                ? "▲ "
                : "▼ "}

              {Math.abs(
                rentabilidadeTotal
              ).toFixed(2)}%

            </span>

          </div>

          <div className="mt-4">

            <div className="text-sm text-slate-500">
              Valor Investido
            </div>

            <div className="text-xl font-semibold">
              {totalInvestido.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </div>

          </div>

        </div>

        

        <div
          className="
            bg-white
            border
            rounded-2xl
            p-6
            shadow-sm
            w-[380px]
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >

            <span className="text-xl">
              💵
            </span>

            <p className="text-sm text-gray-500">
              Lucro Total
            </p>

          </div>

          <div
            className={
              lucroTotal >= 0
                ? "text-4xl font-bold text-green-600"
                : "text-4xl font-bold text-red-600"
            }
          >

            {valor(lucroTotal)}

          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div>

              <div className="text-sm text-gray-500">
                Ganho de Capital
              </div>

              <div className="text-xl">
                {valor(lucroPositivo)}
              </div>

            </div>

            <div>

              <div className="text-sm text-gray-500">
                Prejuízo
              </div>

              <div className="text-xl">
                {valor(prejuizoTotal)}
              </div>

            </div>

          </div>

        </div>



        <div
          className="
            bg-white
            border
            rounded-2xl
            p-6
            shadow-sm
            w-[400px]
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >

            <span className="text-xl">
              💸
            </span>

            <p className="text-sm text-gray-500">
              Proventos Recebidos (12M)
            </p>

          </div>

          <div className="text-4xl font-bold">

            {valor(proventos12m)}

          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div>

              <div className="text-sm text-gray-500">
                Média Mensal
              </div>

              <div className="text-xl">
                {valor(mediaMensal)}
              </div>

            </div>

            <div>

              <div className="text-sm text-gray-500">
                Último Mês
              </div>

              <div className="text-xl">
                {valor(ultimoMes)}
              </div>

            </div>

          </div>

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

          const usaValorManual = [
            "CRIPTO",
            "FUNDO_INVESTIMENTO",
            "PREV_PRIVADA",
            "TESOURO_DIRETO",
          ].includes(grupo.tipo);

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
                    {valor(valorAtualGrupo)}
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
                      ? `▲ ${valor(lucroGrupo)}`
                      : `▼ ${valor(lucroGrupo)}`
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

                    <th
                      className="p-3 text-left cursor-pointer"
                      onClick={() =>
                        ordenar("ticker")
                      }
                    >
                      Ticker
                        {
                          campoOrdenacao === "ticker" &&
                          (
                            direcaoOrdenacao === "asc"
                              ? " ▲"
                              : " ▼"
                          )
                        }
                    </th>

                    {!usaValorManual && (
                      <th className="p-3 text-left">
                        Segmento
                      </th>
                    )}

                    <th className="p-3 text-center cursor-pointer"
                      onClick={() =>
                        ordenar("quantidadeAtual")
                      }
                    >
                      Qtd
                        {
                          campoOrdenacao === "quantidadeAtual" &&
                          (
                            direcaoOrdenacao === "asc"
                              ? " ▲"
                              : " ▼"
                          )
                        }
                    </th>

                    <th className="p-3 text-center">
                      PM
                    </th>

                    {!usaValorManual && (

                      <th className="p-3 text-center cursor-pointer"
                          onClick={() =>
                            ordenar("valorAtualCotacao")
                          }
                      >
                        P. Atual
                          {
                            campoOrdenacao === "valorAtualCotacao" &&
                            (
                              direcaoOrdenacao === "asc"
                                ? " ▲"
                                : " ▼"
                            )
                          }
                      </th>
                    )}  

                    <th className="p-3 text-center">
                      Investido
                    </th>

                    <th className="p-3 text-center cursor-pointer"
                        onClick={() =>
                          ordenar("valorAtual")
                        }
                    >
                      Saldo Atual
                        {
                          campoOrdenacao === "valorAtual" &&
                          (
                            direcaoOrdenacao === "asc"
                              ? " ▲"
                              : " ▼"
                          )
                        }
                    </th>

                    <th className="p-3 text-center cursor-pointer"
                        onClick={() =>
                              ordenar("resultado")
                            }
                    >
                      Ganho/Perda
                      {
                          campoOrdenacao === "resultado" &&
                          (
                            direcaoOrdenacao === "asc"
                              ? " ▲"
                              : " ▼"
                          )
                        }
                    </th>

                    <th className="p-3 text-center cursor-pointer"
                        onClick={() =>
                          ordenar("rentabilidade")
                        }
                    >
                      Variação
                        {
                          campoOrdenacao === "rentabilidade" &&
                          (
                            direcaoOrdenacao === "asc"
                              ? " ▲"
                              : " ▼"
                          )
                        }
                    </th>

                    <th className="p-3 text-center cursor-pointer"
                        onClick={() =>
                          ordenar("percentualNoTipo")
                        }
                    >
                      % Tipo
                        {
                          campoOrdenacao === "percentualNoTipo" &&
                          (
                            direcaoOrdenacao === "asc"
                              ? " ▲"
                              : " ▼"
                          )
                        }
                    </th>

                    <th className="p-3 text-center">
                      % Carteira
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {[...grupo.ativos]
                    .sort((a, b) => {

                      const aValor =
                        a[campoOrdenacao];

                      const bValor =
                        b[campoOrdenacao];

                      if (aValor < bValor)
                        return direcaoOrdenacao === "asc"
                          ? -1
                          : 1;

                      if (aValor > bValor)
                        return direcaoOrdenacao === "asc"
                          ? 1
                          : -1;

                      return 0;

                    })
                    .map(
                    (ativo: any) => (

                    <tr
                      key={ativo.id}
                      className="border-t"
                    >

                      <td className="p-3">
                        {ativo.ticker}
                      </td>

                      {!usaValorManual && (
                        <td className="p-3">
                          {ativo.segmento}
                        </td>
                      )}
                      
                      <td className="p-3 text-center">
                        {ativo.quantidadeAtual}
                      </td>

                      <td className="p-3 text-center">
                        {valor(ativo.precoMedio)}
                      </td>

                      {!usaValorManual && (

                        <td className="p-3 text-center">
                          {valor(ativo.valorAtualCotacao)}
                        </td>

                      )}

                      <td className="p-3 text-center">
                        {valor(ativo.valorInvestido)}
                      </td>

                      <td className="p-3 text-center">
                        {valor(ativo.valorAtual)}
                      </td>

                      <td
                        className={`p-3 text-center ${
                          ativo.resultado >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {valor(ativo.resultado)}
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
                        {ativo.percentualNoTipo.toFixed(2)}%
                      </td>

                      <td className="p-3 text-center">
                          {ativo.percentualCarteira.toFixed(2)}%
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