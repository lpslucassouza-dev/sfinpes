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

      console.log(
        tx.dataOperacao,
        tx.tipoOperacao,
        tx.quantidade,
        precoMedio
      );

      if (tx.tipoOperacao === "COMPRA") {

        custoTotal += tx.valorTotal;

        quantidadeAtual += tx.quantidade;

        precoMedio = custoTotal / quantidadeAtual;
      }

      if (tx.tipoOperacao === "VENDA") {

        custoTotal -= tx.quantidade * precoMedio;

        quantidadeAtual -= tx.quantidade;

      }
    }

    const valorInvestido = custoTotal;

    return {
      quantidadeAtual,

      precoMedio,

      valorInvestido,
    };
  }