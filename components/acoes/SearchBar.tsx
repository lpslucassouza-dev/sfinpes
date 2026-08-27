type SearchBarProps = {
  ticker: string;

  nomeEmpresa: string;

  setTicker: (
    value: string
  ) => void;

  onSearch: () => void;
};


export default function SearchBar({
  ticker,
  setTicker,
  nomeEmpresa,
  onSearch,
}: SearchBarProps)
 {
  return (
    <div
  className="
    rounded-xl
    border
    border-slate-200
    bg-white
    px-4
    py-3
    shadow-md
    overflow-hidden
  "
>
  <div className="flex items-center gap-3">

    <span className="text-xl text-blue-500">
      🔍
        </span>

        <input
          value={ticker}
          onChange={(e) =>
            setTicker(
              e.target.value.toUpperCase()
            )
          }
          className="
            flex-1
            bg-transparent
            outline-none
          "
        />

        <button
          onClick={onSearch}
          className="
            rounded-md
            bg-blue-600
            px-4
            py-2
            text-white
            hover:bg-blue-700
          "
        >
          Buscar
        </button>

        <div
          className="
            rounded-md
            bg-yellow-400
            px-4
            py-1
            text-sm
            font-bold
          "
        >
          {ticker}
        </div>

      </div>

      {nomeEmpresa && (
        <div
          className="
            mt-3
            text-sm
            text-slate-600
          "
        >
          {nomeEmpresa}
        </div>
      )}

    </div>
  );
}