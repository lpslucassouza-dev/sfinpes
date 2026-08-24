export default function AnnotationsCard() {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-md
      "
    >
      <div className="border-b p-5">
        <h2 className="text-[15px] font-semibold">
          Anotações
        </h2>
      </div>

      <div className="p-5">

        <textarea
          className="
            min-h-[120px]
            w-full
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            p-4
          "
          placeholder="Escreva suas anotações..."
        />

      </div>
    </div>
  );
}