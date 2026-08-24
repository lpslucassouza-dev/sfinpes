
type Props = {
  precoAtual: number;
  setPrecoAtual: (value: number) => void;

  totalAcoes: number;
  setTotalAcoes: (value: number) => void;

  marketCap: number;

  payout: number;
  roe: number;
};

export default function MetricCards({
  precoAtual,
  setPrecoAtual,
  totalAcoes,
  setTotalAcoes,
  marketCap,
  payout,
  roe,
}: Props) {
  const cards = [
    {
      title: "Preço Atual",
      editable: true,
      value: precoAtual,
      onChange: setPrecoAtual,
    },

    {
      title: "Nº Total de Ações",
      editable: true,
      value: totalAcoes.toLocaleString("pt-BR"),
      onChange: setTotalAcoes,
    },

    {
      title: "Market Cap",
      editable: false,
      value: marketCap.toLocaleString("pt-BR"),
    },

    {
      title: "Payout",
      editable: false,
      value: `${payout}%`,
    },

    {
      title: "ROE",
      editable: false,
      value: `${roe}%`,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">

      {cards.map((card) => (
        <div
          key={card.title}
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
          "
        >
          <p
            className="
              text-xs
              uppercase
              text-blue-500
            "
          >
            {card.title}
          </p>

          {card.editable ? (
              <input
                type={
                  card.title === "Nº Total de Ações"
                    ? "text"
                    : "number"
                }
                value={card.value ?? ""}
                onChange={(e) => {

                  if (
                    card.title ===
                    "Nº Total de Ações"
                  ) {

                    card.onChange?.(
                      Number(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    );

                    return;
                  }

                  card.onChange?.(
                    Number(
                      e.target.value.replace(
                        ",",
                        "."
                      )
                    )
                  );

                }}
                className="
                  mt-2
                  w-full
                  bg-transparent
                  text-xl
                  font-semibold
                  outline-none
                "
              />

            ) : (

              <p className="mt-2 text-xl font-semibold">
                {card.value}
              </p>

            )}
          
          
        </div>
      ))}

    </div>
  );
}