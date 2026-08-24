type Props = {
  marketCap: number;
  totalAcoes: number;
  precoPorAcao: number;
  upsideDownside: number;
  onReset: () => void;
  onSave: () => void;
};

export default function RealidadeProjetadaCard({
  marketCap,
  totalAcoes,
  precoPorAcao,
  upsideDownside,
  onReset,
  onSave,
}: Props) {

    const upsideColor =
        upsideDownside >= 0
            ? "text-green-600"
            : "text-red-600";
    
    const precoColor =
        precoPorAcao >= 0
            ? "text-blue-600"
            : "text-red-600";

function Row({
            label,
            value,
            color = "",
            }: {
            label: string;
            value: string;
            color?: string;
            }) {
            return (
                <div className="flex justify-between px-5 py-4">

                <span className="text-slate-700">
                    {label}
                </span>

                <span className={`font-medium ${color}`}>
                    {value}
                </span>

                </div>
            );
            }


  return (
    <div className="
      rounded-xl
      border
      border-slate-200
      bg-white
      shadow-sm
    ">
      <div className="border-b p-5">
        <h2 className="text-[15px] font-semibold text-slate-800">
          Realidade Projetada
        </h2>
      </div>
                  

        <div className="divide-y">

            <div className="flex justify-between px-5 py-2">
                <span>Market Cap Projetado</span>
                <span>
                {marketCap.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL",
                    }
                    )}
                </span>
            </div>

            <Row
                label="Nº Total de Ações"
                value={totalAcoes.toLocaleString("pt-BR")}
                />

            <div className="flex justify-between px-5 py-2">
                <span className={precoColor}>
                    Preço Justo
                </span>

                <span className={precoColor}>
                    {precoPorAcao.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL",
                        }
                    )}
                </span>
            </div>

            <div className="flex justify-between px-5 py-2">
                <span className={`font-medium ${upsideColor}`}>
                    Upside / Downside
                </span>

                <span className={`font-medium ${upsideColor}`}>
                    {upsideDownside.toFixed(2)}%
                </span>
            </div>

        </div>

        <div className="flex gap-3">

        <button
            onClick={onSave}
            className="
            flex-1
            rounded-lg
            bg-sky-600
            py-2
            text-white
            font-medium
            hover:bg-sky-700
            "
        >
            Salvar Preço Teto
        </button>

        <button 
            onClick={() => {
                if (
                    confirm("Deseja realmente limpar o valuation?")
                ) { onReset();
                    }
                }}
            className="
            rounded-lg
            border
            px-5
            py-1
            font-medium
            "
        >
            Reset
        </button>

        </div>


    </div>
  );
}