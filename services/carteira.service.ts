export interface PosicaoAtivo {

  ticker: string;

  nome: string;

  tipo: string;

  setor?: string | null;

  segmento?: string | null;

  quantidadeAtual: number;

  precoMedio: number;

  valorInvestido: number;
}

export function calcularPosicaoAtual(
  transacoes: any[]
) {

  let quantidadeAtual = 0;

  let custoTotal = 0;

  let precoMedio = 0;

  for (const tx of transacoes) {

    if (tx.tipoOperacao === "COMPRA") {

      custoTotal += tx.valorTotal;

      quantidadeAtual += tx.quantidade;

      precoMedio =
        custoTotal / quantidadeAtual;
    }

    if (tx.tipoOperacao === "VENDA") {

      quantidadeAtual -= tx.quantidade;
    }
  }

  const valorInvestido =
  quantidadeAtual * precoMedio;

return {
  quantidadeAtual,

  precoMedio,

  valorInvestido,
};
}