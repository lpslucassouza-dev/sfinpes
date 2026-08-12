"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  dados: {
    nome: string;
    valor: number;
  }[];
};

const cores = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
];

export default function GraficoCategorias({
  dados,
}: Props) {
  return (
    <div className="h-80">
      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={dados}
            dataKey="valor"
            nameKey="nome"
            outerRadius={100}
            label
          >
            {dados.map((_, index) => (
              <Cell
                key={index}
                fill={
                  cores[
                    index % cores.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}