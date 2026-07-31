"use client";

import { useRouter } from "next/navigation";

type Props = {
  mes: number;
  ano: number;
  cartao: number;
  usuario: number;

  cartoes: {
    id: number;
    nome: string;
  }[];

  usuarios: {
    id: number;
    nome: string;
  }[];
};

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

export default function FiltrosCompras({
  mes,
  ano,
  cartao,
  usuario,
  cartoes,
  usuarios,
}: Props) {

  const router = useRouter();

  function alterarFiltro(
    novoMes: number,
    novoAno: number,
    novoCartao: number,
    novoUsuario: number
  ) {
    router.push(
      `/compras?mes=${novoMes}&ano=${novoAno}&cartao=${novoCartao}&usuario=${novoUsuario}`
    );
  }

  return (
    <div
      className="
        flex
        flex-wrap
        gap-4
        mb-8
        bg-white
        border
        border-slate-200
        rounded-2xl
        shadow-sm
        p-4
      "
    >

      {/* Mês */}

      <select
        value={mes}
        onChange={(e) =>
          alterarFiltro(
            Number(e.target.value),
            ano,
            cartao,
            usuario
          )
        }
        className="
          border
          border-slate-300
          rounded-lg
          px-3
          py-2
          bg-white
          min-w-[180px]
        "
      >
        {meses.map((nome, index) => (
          <option
            key={nome}
            value={index + 1}
          >
            {nome}
          </option>
        ))}
      </select>

      {/* Ano */}

      <select
        value={ano}
        onChange={(e) =>
          alterarFiltro(
            mes,
            Number(e.target.value),
            cartao,
            usuario
          )
        }
        className="border rounded-lg px-3 py-2"
      >
        {[2025, 2026, 2027, 2028].map(
          (anoItem) => (
            <option
              key={anoItem}
              value={anoItem}
            >
              {anoItem}
            </option>
          )
        )}
      </select>

      {/* Cartão */}

      <select
        value={cartao}
        onChange={(e) =>
          alterarFiltro(
            mes,
            ano,
            Number(e.target.value),
            usuario
          )
        }
        className="border rounded-lg px-3 py-2"
      >
        <option value={0}>
          Todos os Cartões
        </option>

        {cartoes.map((item) => (
          <option
            key={item.id}
            value={item.id}
          >
            {item.nome}
          </option>
        ))}
      </select>

      {/* Usuário */}

      <select
        value={usuario}
        onChange={(e) =>
          alterarFiltro(
            mes,
            ano,
            cartao,
            Number(e.target.value)
          )
        }
        className="border rounded-lg px-3 py-2"
      >
        <option value={0}>
          Todos os Usuários
        </option>

        {usuarios.map((item) => (
          <option
            key={item.id}
            value={item.id}
          >
            {item.nome}
          </option>
        ))}
      </select>

    </div>
  );
}