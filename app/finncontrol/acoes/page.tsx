import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ValuationTable from "@/components/acoes/ValuationTable";

export default async function AcoesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const valuations =
    await prisma.valuation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    
    <main className="p-8">
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1 className="text-3xl font-bold">
            Ações
          </h1>

          <p className="text-slate-600">
            Ranking de valuations
          </p>
        </div>

        <Link
          href="/finncontrol/acoes/novo"
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
            hover:bg-blue-700
          "
        >
          + Novo Valuation
        </Link>
      </div>

      <ValuationTable
        valuations={valuations}
      />
    </main>
  );
}