import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModalEditarPerfil from "@/components/perfil/ModalEditarPerfil";
import ModalTrocarSenha from "@/components/perfil/ModalTrocarSenha";

export default async function PerfilPage() {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const usuario =
    await prisma.usuario.findUnique({
      where: {
        id: Number(
          session.user?.id
        ),
      },
    });

  if (!usuario) {
    redirect("/login");
  }

  return (
    <main className="max-w-4xl mx-auto p-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Meu Perfil
        </h1>

        <p className="text-slate-600">
          Gerencie seus dados
        </p>

      </div>

      <div
        className="
            bg-white
            rounded-2xl
            border
            shadow-md
            p-6
        "
        >

        <div className="flex justify-between items-start">

            <div>

            <div className="mb-4">
                <span className="font-bold">
                Nome:
                </span>

                <div>
                {usuario.nome}
                </div>
            </div>

            <div className="mb-4">
                <span className="font-bold">
                E-mail:
                </span>

                <div>
                {usuario.email}
                </div>
            </div>

            <div>
                <span className="font-bold">
                Status:
                </span>

                <div>
                {usuario.ativo
                    ? "Ativo"
                    : "Inativo"}
                </div>
            </div>

            </div>

            <div className="flex gap-2">

            <ModalEditarPerfil
                nome={usuario.nome}
                email={usuario.email ?? ""}
            />

            <ModalTrocarSenha />

            </div>

        </div>

        </div>

    </main>
  );
}