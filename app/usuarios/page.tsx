import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModalUsuario from "@/components/usuarios/ModalUsuario";
import ModalEditarUsuario from "@/components/usuarios/ModalEditarUsuario";
import BotaoStatusUsuario from "@/components/usuarios/BotaoStatusUsuario";
import ModalSenhaUsuario from "@/components/usuarios/ModalSenhaUsuario";

export default async function UsuariosPage() {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const usuarios =
    await prisma.usuario.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    const usuarioLogadoId =
      Number(session?.user?.id);

  return (
    <main className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

            <h1 className="text-3xl font-bold">
            Usuários
            </h1>

            <p className="text-slate-600">
            Gerenciamento de acessos
            </p>

        </div>

        <ModalUsuario />

       </div>

      <div className="bg-white rounded-2xl border shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-200">
            <tr>

              <th className="text-left p-3">
                Nome
              </th>

              <th className="text-left p-3">
                E-mail
              </th>

              <th className="text-center p-3">
                Status
              </th>

              <th className="text-center p-3">
                Ações
              </th>              

            </tr>
          </thead>

          <tbody>

            {usuarios.map((usuario) => (

              <tr
                key={usuario.id}
                className="
                  border-t
                  hover:bg-blue-50
                "
              >

                <td className="p-3">
                  {usuario.nome}
                </td>

                <td className="p-3">
                  {usuario.email}
                </td>

                <td className="p-3 text-center">
                  {usuario.ativo
                    ? "Ativo"
                    : "Inativo"}
                </td>

                <td className="p-3 text-center">

                    <div className="flex justify-center gap-2">

                    <ModalEditarUsuario
                        id={usuario.id}
                        nome={usuario.nome}
                        email={usuario.email}
                    />

                    <ModalSenhaUsuario
                        id={usuario.id}
                        nome={usuario.nome}
                    />

                    <BotaoStatusUsuario
                      id={usuario.id}
                      ativo={usuario.ativo}
                      desabilitado={
                        usuario.id === usuarioLogadoId
                      }
                    />
  
                    </div>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}