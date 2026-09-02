import { atualizarCotacoes }
from "@/services/quote-update.service";

export async function POST() {

  await atualizarCotacoes();

  return Response.json({
    success: true,
  });
}
