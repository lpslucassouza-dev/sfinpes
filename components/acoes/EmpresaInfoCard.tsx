type Props = {
  nomeEmpresa: string;
  marketCap: number;
  pl: number;
  lpa: number;
  max52: number;
  min52: number;
  precoAtual: number;
  precoJusto: number;
  upside: number;
};

export default function EmpresaInfoCard({
  nomeEmpresa,
  marketCap,
  pl,
  lpa,
  max52,
  min52,
  precoAtual,
  precoJusto,
  upside,
}: Props) {

  if (!nomeEmpresa) {
    return null;
  }

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-md
      "
    >

      <div
        className="
          mb-5
          grid
          grid-cols-3
          gap-4
        "
      >
        <InfoItem
          label="Preço Atual"
          value={precoAtual.toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        />

        <InfoItem
          label="Preço Justo"
          value={precoJusto.toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        />

        <div>
          <p
            className="
              text-xs
              uppercase
              text-slate-500
            "
          >
            Upside
          </p>

          <p
            className={
              upside >= 0
                ? "mt-1 text-lg font-semibold text-green-600"
                : "mt-1 text-lg font-semibold text-red-600"
            }
          >
            {upside.toFixed(2)}%
          </p>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-5
          gap-4
        "
      >
        <InfoItem
          label="Market Cap"
          value={marketCap.toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }
          )}
        />

        <InfoItem
          label="P/L"
          value={pl.toFixed(2)}
        />

        <InfoItem
          label="LPA"
          value={lpa.toFixed(2)}
        />

        <InfoItem
          label="Máx. 52 Sem."
          value={max52.toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        />

        <InfoItem
          label="Mín. 52 Sem."
          value={min52.toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        />
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        className="
          text-xs
          uppercase
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-semibold
        "
      >
        {value}
      </p>
    </div>
  );
}