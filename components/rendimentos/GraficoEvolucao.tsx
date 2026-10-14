"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Props = {
  dados: {
    mes: string;
    valor: number;  
    media: number;
  }[];

  media: number;
};

export default function GraficoEvolucao({
  dados,
  media,
}: Props) {

  return (

    <div
      className="
        bg-white
        rounded-xl
        border
        p-6
      "
    >

      <h2
        className="
          text-xl
          font-semibold
          mb-4
        "
      >
        Evolução dos Rendimentos
      </h2>

      <ResponsiveContainer
        width="100%"
        height={450}
      >

        <ComposedChart data={dados}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="mes" />

            <YAxis />

            <Tooltip
              formatter={(value: any) =>

                Number(value ?? 0).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )

              }
            />

            <Legend />

           <Bar
              dataKey="valor"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              name="Rendimentos"
            />

            <Line
                type="monotone"
                dataKey="media"
                stroke="#ea580c"
                strokeWidth={4}
                strokeDasharray="8 4"
                dot={false}
                name="Média Mensal"
            />

            </ComposedChart>

      </ResponsiveContainer>

    </div>

  );

}