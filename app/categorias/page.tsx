import { prisma } from "@/lib/prisma";
import ModalCategoria from "@/components/categorias/ModalCategoria";
import ModalSubCategoria from "@/components/categorias/ModalSubCategoria";
import BotaoExcluirCategoria from "@/components/categorias/BotaoExcluirCategoria";
import BotaoExcluirSubCategoria from "@/components/categorias/BotaoExcluirSubCategoria";
import ModalEditarCategoria from "@/components/categorias/ModalEditarCategoria";
import ModalEditarSubCategoria from "@/components/categorias/ModalEditarSubCategoria";

export default async function CategoriasPage() {

  const categorias =
    await prisma.categoria.findMany({
      include: {
        subCategorias: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

  return (
    <main className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between items-start mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Categorias
          </h1>

          <p className="text-slate-600 mt-1">
            Gerencie categorias e subcategorias
          </p>

        </div>

        <ModalCategoria />

      </div>

      <div className="space-y-4">

        {categorias.map(
          (categoria) => (

            <div
              key={categoria.id}
              className="
                bg-white
                border
                rounded-xl
                p-5
              "
            >

              <div className="flex justify-between items-center">

                <h2
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  {categoria.nome}
                </h2>

                <div className="flex gap-2">

                  <ModalSubCategoria
                    categoriaId={categoria.id}
                    categoriaNome={categoria.nome}
                  />

                  <ModalEditarCategoria
                    id={categoria.id}
                    nome={categoria.nome}
                  />

                  <BotaoExcluirCategoria
                    categoriaId={categoria.id}
                  />

                </div>

              </div>

              <div className="mt-3">

                {categoria.subCategorias
                  .length === 0 && (
                  <div
                    className="
                      text-slate-400
                    "
                  >
                    Nenhuma subcategoria
                  </div>
                )}

                {categoria.subCategorias.map(
                  (
                    subCategoria
                  ) => (
                    <div
                      key={subCategoria.id}
                      className="
                        flex
                        justify-between
                        items-center
                        py-1
                      "
                    >
                      <span>
                        • {subCategoria.nome}
                      </span>

                      <div className="flex gap-2">

                        <ModalEditarSubCategoria
                          id={subCategoria.id}
                          nome={subCategoria.nome}
                        />

                        <BotaoExcluirSubCategoria
                          subCategoriaId={subCategoria.id}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

    </main>
  );
}