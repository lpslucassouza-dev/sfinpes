"use client";

import { useRouter } from "next/navigation";

type Props = {
  mes: number;
  ano: number;
};

export default function FiltrosContaCorrente({
  mes,
  ano,
}: Props) {

  const router = useRouter();

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

  function atualizar(
    novoMes: number,
    novoAno: number
  ) {
    router.push(
      `/conta-corrente?mes=${novoMes}&ano=${novoAno}`
    );
  }

  return (
    <div className="flex gap-4">

      <select
        value={mes}
        onChange={(e) =>
          atualizar(
            Number(e.target.value),
            ano
          )
        }
        className="
          border
          rounded-lg
          px-3
          py-2
        "
      >
        {Array.from(
          { length: 12 },
          (_, i) => (
            <option
              key={i + 1}
              value={i + 1}
            >
              {meses[i]}
            </option>
          )
        )}
      </select>

      <select
        value={ano}
        onChange={(e) =>
          atualizar(
            mes,
            Number(e.target.value)
          )
        }
        className="
          border
          rounded-lg
          px-3
          py-2
        "
      >
        {Array.from(
          { length: 5 },
          (_, i) => {

            const anoSelect =
              new Date().getFullYear() - 2 + i;

            return (
              <option
                key={anoSelect}
                value={anoSelect}
              >
                {anoSelect}
              </option>
            );
          }
        )}
      </select>

    </div>
  );
}