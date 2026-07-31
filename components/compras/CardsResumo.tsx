type Props = {
  totalMes: number;
  cashbackMes: number;
  iniciando: number;
  encerrando: number;
};

function formatarMoeda(valor: number) {
  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}

export default function CardsResumo({
  totalMes,
  cashbackMes,
  iniciando,
  encerrando,
}: Props) {
  const cards = [
  {
    titulo: "Total do Mês",
    valor: totalMes,
    className: "border-l-blue-600",
  },
  {
    titulo: "Cashback",
    valor: cashbackMes,
    className: "border-l-emerald-600",
  },
  {
    titulo: "Iniciando",
    valor: iniciando,
    className: "border-l-amber-500",
  },
  {
    titulo: "Encerrando",
    valor: encerrando,
    className: "border-l-red-500",
  },
];
``

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.titulo}
          className={`
          bg-white
          rounded-2xl
          border-l-4
          ${card.className}
          border-t
          border-r
          border-b
          border-slate-200
          p-5
          shadow-md
        `}
        >
          <div className="text-sm text-slate-500">
            {card.titulo}
          </div>

          <div className="text-2xl font-bold mt-1">
            {formatarMoeda(
              card.valor
            )}
          </div>
        </div>
      ))}
    </div>
  );
}