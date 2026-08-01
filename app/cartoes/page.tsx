import { prisma } from "@/lib/prisma";
import ModalCartao from "@/components/cartoes/ModalCartao";
import ModalEditarCartao from "@/components/cartoes/ModalEditarCartao";
import BotaoStatusCartao from "@/components/cartoes/BotaoStatusCartao";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CartoesPage() {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const cartoes =
    await prisma.cartao.findMany({
      orderBy: {
        nome: "asc",
      },
    });

  return (
    <main className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between items-start mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Cartões
          </h1>

          <p className="text-slate-600 mt-1">
            Gerencie seus cartões
          </p>

        </div>

        <ModalCartao />

      </div>

      <div className="grid md:grid-cols-3 gap-4">

        {cartoes.map((cartao) => (

          <div
            key={cartao.id}
            className="
              bg-white
              border
              rounded-xl
              p-5
            "
          >

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="font-semibold text-lg">
                    {cartao.nome}
                    </h2>

                    <span
                    className={
                        cartao.ativo
                        ? "text-green-600 text-sm"
                        : "text-red-600 text-sm"
                    }
                    >
                    {cartao.ativo
                        ? "Ativo"
                        : "Inativo"}
                    </span>

                </div>

                <ModalEditarCartao
                    id={cartao.id}
                    nome={cartao.nome}
                    cashbackPercent={Number(
                    cartao.cashbackPercent
                    )}
                />

            </div>

            <div className="mt-4 text-slate-600">
              Cashback:
              {" "}
              {Number(
                cartao.cashbackPercent
              ).toFixed(2)}
              %
            </div>

            <button
                onClick={async () => {
                    "use server";
                }}>
            </button>

            <BotaoStatusCartao
                id={cartao.id}
                ativo={cartao.ativo}
                />

          </div>

        ))}

      </div>

    </main>
  );
}