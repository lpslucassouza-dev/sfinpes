"use client";

import {useEffect,useState,} from "react";

export default function AtualizacaoManualPage() {

  const [ativos, setAtivos] =
    useState<any[]>([]);

  const [valores, setValores] =
    useState<Record<string, any>>({});

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const response =
      await fetch(
        "/api/assets/manual-values"
      );

    const data =
      await response.json();

    setAtivos(data);

    const novosValores:
      Record<string, number> = {};

    data.forEach((ativo: any) => {

      const novosValores:
        Record<string, any> = {};

      data.forEach((ativo: any) => {

        novosValores[ativo.id] = "";

      });

    });

    setValores(novosValores);

  }

  async function salvar(
    id: string,
    valor: number
  ) {

    await fetch(
      "/api/assets/manual-values/update",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            id,
            valorAtualManual:
              valor,
          }),

      }
    );

  }

  const grupos =
    ativos.reduce(
      (acc: any, ativo: any) => {

        if (!acc[ativo.tipo]) {

          acc[ativo.tipo] = [];

        }

        acc[ativo.tipo].push(ativo);

        return acc;

      },

      {}
    );

  const nomesTipos: Record<string, string> = {
    CRIPTO: "Criptomoedas",
    FUNDO_INVESTIMENTO: "Fundos de Investimento",
    PREV_PRIVADA: "Previdência Privada",
    TESOURO_DIRETO: "Tesouro Direto",
  };

  async function salvarTudo() {

    try {

      for (const ativo of ativos) {

        const novoValor = valores[ativo.id];

        if (
          novoValor === "" ||
          novoValor === undefined ||
          novoValor === null
        ) {
          continue;
        }

        await fetch(
          "/api/assets/manual-values/update",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              id: ativo.id,

              valorAtualManual:
                Number(novoValor),

            }),

          }
        );

      }

      alert(
        "Atualizações salvas com sucesso."
      );

      await carregar();

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao salvar atualizações."
      );

    }

  } 

  return (

    <div className="p-8 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Atualização Manual
      </h1>

      <div className="space-y-6">

          {Object.entries(grupos).map(
            ([tipo, lista]: any) => (

              <div
                key={tipo}
                className="
                  bg-white
                  border
                  rounded-xl
                  p-3
                  mb-6
                "
              >

                <h2 className="text-xl font-bold mb-3">
                  {nomesTipos[tipo] || tipo} ({lista.length})
                </h2>
                  
                <div
                  className="
                    grid
                    grid-cols-[1fr_180px_180px_180px]
                    gap-4
                    pb-1
                    border-b
                    mb-1
                    text-sm
                    font-semibold
                    text-slate-500
                  "
                >

                  <div>Nome</div>
                  <div className="text-center">Última Atualização</div>
                  <div className="text-center">Valor Salvo</div>
                  <div className="text-center">Novo Valor</div>

                </div>

                <div className="space-y-1">

                  {lista.map(
                    (ativo: any) => (

                      <div
                        key={ativo.id}
                        className="
                        grid
                        grid-cols-[1fr_180px_180px_180px]
                        gap-1
                        items-center
                        py-1
                        border-b
                        "
                        >
                        <div>
                          {ativo.nome}
                        </div>

                        <div className="text-center">
                          {ativo.dataAtualizacaoManual
                            ? new Date(
                                ativo.dataAtualizacaoManual
                              ).toLocaleDateString(
                                "pt-BR"
                              )
                            : (
                              <span
                                className="
                                  bg-red-100
                                  text-red-700
                                  px-2
                                  py-1
                                  rounded-full
                                  text-xs
                                "
                              >
                                Não informado
                              </span>
                            )}

                        </div>

                        <div className="text-center">

                          {Number(
                            ativo.valorAtualManual || 0
                          ).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}

                        </div>

                        <div className="flex justify-end">

                          <input
                            type="number"
                            step="0.01"
                            placeholder="Informe o valor"
                            value={
                              valores[ativo.id] ?? ""
                            }
                            onChange={(e) =>

                              setValores(
                                (prev) => ({

                                  ...prev,

                                  [ativo.id]:
                                    Number(
                                      e.target.value
                                    ),

                                })
                              )

                            }
                            className="
                              w-52
                              border
                              border-slate-300
                              rounded-lg
                              px-3
                              py-2
                              text-right
                              font-medium
                            "
                          />
                      </div>
                    </div>

                    )
                  )}

                </div>

              </div>

            )
          )}

          <div className="flex justify-end mt-6">
                  <button
                    onClick={salvarTudo}
                    className="
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      font-medium
                    "
                  >
                    Salvar Atualizações
                  </button>
                </div>

      </div>

    </div>

  );

}