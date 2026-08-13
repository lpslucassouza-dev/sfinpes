"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

type Props = {
  receitas: number;
  despesas: number;
  investimentos: number;
};

export default function GraficoResumoFinanceiro({
  receitas,
  despesas,
  investimentos,
}: Props) {

  const dados = [
    {
      nome: "Receitas",
      valor: receitas,
    },
    {
      nome: "Despesas",
      valor: despesas,
    },
    {
      nome: "Investimentos",
      valor: investimentos,
    },
  ];

  return (
    <div className="h-96">
      <ResponsiveContainer>
        <BarChart data={dados}>
          <XAxis dataKey="nome" />
          <YAxis
            tickFormatter={(value) =>
              `R$ ${value}`
            }
          />
          <Tooltip
            formatter={(value) =>
              Number(value).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )
            }
          />

          <Bar
            dataKey="valor"
            radius={[8, 8, 0, 0]}
          >
            <Cell fill="#16a34a" />
            <Cell fill="#dc2626" />
            <Cell fill="#9333ea" />
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}