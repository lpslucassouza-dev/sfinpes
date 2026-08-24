const fields = [
  "Payout Médio",
  "ROE",
  "Taxa Esperada de Crescimento",
  "Taxa de Desconto",
  "Taxa de Desconto Perpétua",
  "Crescimento Perpétuo",
];

type Props = {
  payout: number;
  setPayout: (value: number) => void;

  roe: number;
  setRoe: (value: number) => void;

  taxaCrescimento: number;

  taxaDesconto: number;
  setTaxaDesconto: (value: number) => void;

  crescimentoPerpetuo: number;
  setCrescimentoPerpetuo: (
    value: number
  ) => void;
};

export default function PremissasCard({
  payout,
  setPayout,
  roe,
  setRoe,
  taxaCrescimento,
  taxaDesconto,
  setTaxaDesconto,
  crescimentoPerpetuo,
  setCrescimentoPerpetuo,
}: Props) {
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
          Premissas
        </h2>
      </div>

    <div className="divide-y">

      <div className="flex items-center justify-between px-4 py-2">

        <span className="text-sm text-slate-700">Payout Médio</span>
        
        <div className="flex items-center gap-2">
          <input value={payout}
                  type="number"
                  onChange={(e)=>
                    setPayout(
                      Number(e.target.value.replace(",", "."))
                    )
                  }
              className="
                  h-8
                  w-20
                  rounded-md
                  border-0
                  bg-slate-100
                  text-center
                  text-sm
                  font-medium
              "
          />
          <span className="text-slate-400">%</span>
        </div>
      </div>
     
      <div className="flex items-center justify-between px-4 py-2">

        <span className="text-sm text-slate-700">ROE</span>
        
        <div className="flex items-center gap-2">
          <input value={roe}
                  type="number"
                  onChange={(e)=>
                    setRoe(
                      Number(e.target.value.replace(",", "."))
                    )
                  }
              className="
                  h-8
                  w-20
                  rounded-md
                  border-0
                  bg-slate-100
                  text-center
                  text-sm
                  font-medium
              "
          />
          <span className="text-slate-400">%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-2">

        <span className="text-sm text-slate-700">Taxa Esperada de Crescimento</span>
        
        <div className="flex items-center gap-2">
          <input value={taxaCrescimento.toFixed(2)}
                 readOnly
                 className="
                      h-8
                      w-20
                      rounded-md
                      border-0
                      bg-slate-100
                      text-center
                      text-sm
                      font-medium
                  "
          />
          <span className="text-slate-400">%</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2">

        <span className="text-sm text-slate-700">Taxa de Desconto</span>
        
        <div className="flex items-center gap-2">
          <input value={taxaDesconto}
                  onChange={(e)=>
                    setTaxaDesconto(
                      Number(e.target.value.replace(",", "."))
                    )
                  }
              className="
                  h-8
                  w-20
                  rounded-md
                  border-0
                  bg-slate-100
                  text-center
                  text-sm
                  font-medium
              "
          />
          <span className="text-slate-400">%</span>
        </div>
      </div>
    </div>
  

{/*
        <div className="divide-y">

          {[
              "Payout Médio",
              "ROE",
              "Taxa Esperada de Crescimento",
              "Taxa de Desconto",
              "Taxa de Desconto Perpétua",
          ].map((item) => (
            <div
                key={item}
                className="
                    flex
                    items-center
                    justify-between
                    px-4
                    py-2
                "
                >
                <span className="text-sm text-slate-700">
                    {item}
                </span>

                <div className="flex items-center gap-2">

                    <input
                        className="
                            h-8
                            w-20
                            rounded-md
                            border-0
                            bg-slate-100
                            text-center
                            text-sm
                            font-medium
                        "
                        />

                    <span className="text-slate-400">
                    %
                    </span>

                </div>
              </div>
            ))}

        </div>
*/}



        <div className="bg-slate-50 px-5 py-4 border-t">
            <p className="text-xs text-slate-500 text-center">
                Média histórica da Selic é 11,56%
                (9,83% ex IR15%)
            </p>
        </div>

    </div>
  );
}