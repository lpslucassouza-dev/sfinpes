"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={dados}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="valor"
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}