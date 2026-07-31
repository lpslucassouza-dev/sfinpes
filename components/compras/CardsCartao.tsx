import { formatCurrency }
  from "@/lib/format";

type CartaoResumo = {
  id: number;
  nome: string;
  total: number;
  cashback: number;
};

type Props = {
  cartoes: CartaoResumo[];
};

export default function CardsCartao({
  cartoes,
}: Props) {
  return (
    <div>

      <h2 className="text-xl font-semibold mb-4">
        Gasto por Cartão
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {cartoes.map((cartao) => (

          <div
            //key={cartao.id}
            className="
              bg-white
              border
              border-slate-200
              rounded-xl
              p-4
              shadow-sm
            "
          >

            <div className="font-semibold text-base mb-4">
              {cartao.nome}
            </div>

            <div className="text-sm text-slate-500">
              Total no mês
            </div>

            <div className="text-lg font-bold mt-1">
              {formatCurrency(
                cartao.total
              )}
            </div>

            <div className="mt-2 text-emerald-600 text-sm font-medium">
              🎁 Cashback{" "}
              {formatCurrency(
                cartao.cashback
              )}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}